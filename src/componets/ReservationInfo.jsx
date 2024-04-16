import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import {currencyOptions} from "../utils/options";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getTakenDaysForRoom, getTypesForRoom, updateReservation} from "../hooks/hotel";
import dayjs from "dayjs";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {CurrencyContext} from "../context/CurrencyContext";

export default function ReservationInfo({reservation, filter, setFilter, setNewReservation, setShowReservation, rooms}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {loggedUser} = useContext(AuthContext);
    const {currency, handleRate, currencies} = useContext(CurrencyContext);
    const [oldCurrency, setOldCurrency] = useState(null);
    const [reservationInfo, setReservationInfo] = useState( {...reservation, pricePerNight: 0, price:0, currency:currency});
    const [typesOptions, setTypesOptions] = useState([]);
    const [type, setType] = useState();
    const [disabledDates, setDisabledDates] = useState();

    useEffect(() => {
        setReservationInfo({...reservation, pricePerNight: 0, price:0, currency:currency});
    }, [reservation]);

    const {data: types} = useQuery(
        {
            queryKey: ["get types", filter.roomId],
            queryFn: () => getTypesForRoom(filter.roomId),
            enabled: filter.roomId != null,
            retry: false,
            staleTime: 5000
        });

    const {data: takenDaysForRoom} = useQuery({
        queryKey: ["get reservations", filter.roomId],
        queryFn: () => getTakenDaysForRoom(filter.roomId),
        enabled: filter.roomId != null,
        retry: false,
        staleTime: 5000
    })

    const {mutate} = useMutation({
        mutationFn: () => updateReservation(loggedUser.id, reservationInfo),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservation", filter]});
            queryClient.resetQueries({queryKey: ["get unpaid payments", reservation && reservation.customers]});
            filter.hotelId && queryClient.resetQueries({queryKey: ["get all confirm reservations for hotel", {date:filter.date, hotelId:filter.hotelId}]});
            toast.success(<CustomToastContent content={[t("updateReservation")]}/>);
            setShowReservation(false);
        }
    })

    function changePrice(rate){
        setReservationInfo((prev) => {
            return {
                ...prev,
                price: parseFloat((oldCurrency.price / rate).toFixed(2)),
                pricePerNight: parseFloat((oldCurrency.pricePerNight / rate).toFixed(2)),
            }
        })
    }

    useEffect(() => {
        if(currencies && reservationInfo && oldCurrency){
            changePrice(handleRate(oldCurrency, reservationInfo.currency));
        }
    }, [currencies, oldCurrency, reservationInfo && reservationInfo.currency]);

    useEffect(() => {
        if (reservationInfo && takenDaysForRoom) {
            let days = takenDaysForRoom.filter((day) => {  return dayjs(day).isAfter(dayjs(reservationInfo.checkIn).add( 1, 'day').endOf('day'))})
            reservationInfo.id ? setDisabledDates(() => days.filter((day) => {
                return !(dayjs(day).isAfter(dayjs(reservationInfo.checkIn).startOf('day')) && dayjs(day).isBefore(dayjs(reservationInfo.checkOut).startOf('day')))
            })): setDisabledDates(() => days);
        }
    }, [takenDaysForRoom]);

    useEffect(() => {
        if (types) {
            setTypesOptions(() => types.map((type) => {
                return {label: type.name, value: type}
            }));
        }
    }, [types]);

    useEffect(() => {
        if (type) {
            setReservationInfo((prev) => ({
                ...prev,
                pricePerNight: type.price,
                price: type.price * reservationInfo.nights,
                currency: type.currency
            }))
            setOldCurrency(() => {return {currency: type.currency, pricePerNight:type.price, price: type.price * reservationInfo.nights}});
        }
    }, [type]);

    useEffect(() => {
            setReservationInfo((prev) => ({
                ...prev,
                price: reservationInfo.pricePerNight * reservationInfo.nights,
            }))
        setOldCurrency(() => {return {currency:reservationInfo.currency, pricePerNight:reservationInfo.pricePerNight, price: reservationInfo.pricePerNight * reservationInfo.nights}});
    }, [reservationInfo.nights]);

    useEffect(() => {
        if (!reservationInfo.checkIn) {
            setReservationInfo((prev) => ({
                ...prev,
                checkIn: filter.date
            }))
        }
        if (reservationInfo.checkIn && reservationInfo.checkOut) {
            const nights = dayjs(reservationInfo.checkOut).startOf('day').diff(dayjs(reservationInfo.checkIn).startOf('day'), 'day');
            setReservationInfo((prev) => ({
                ...prev,
                nights: nights
            }))
        }
    }, [reservationInfo.checkOut, reservationInfo.checkIn]);

    useEffect(() => {
        setNewReservation && setNewReservation((prevValue)=>({...prevValue, ...reservationInfo}));
    }, [reservationInfo]);

    function saveReservation(event) {
        mutate();
        event.preventDefault();
    }

    function handleSelect(newValue) {
        newValue ? setType(newValue.value) : setType(null);
    }

    function handleSelectRoom(newValue) {
        setFilter((prevValue) => ({
            ...prevValue,
            roomId: newValue.value
        }))
    }

    function handlePriceChange(event) {
        setReservationInfo((prevState) => ({
            ...prevState,
            price: event.target.value,
            pricePerNight: reservationInfo.nights!==0 ? parseFloat((event.target.value/reservationInfo.nights).toFixed(2)) : 0,
        }))
        setOldCurrency(() => {return {currency:reservationInfo.currency, pricePerNight:parseFloat((event.target.value/reservationInfo.nights).toFixed(2)) , price: event.target.value}});
    }

    function handlePricePerNightChange(event) {
        setReservationInfo((prevState) => ({
            ...prevState,
            pricePerNight: event.target.value,
            price: reservationInfo.nights!==0 ? event.target.value*reservationInfo.nights : 0,
        }))
        setOldCurrency(() => {return {currency:reservationInfo.currency, pricePerNight:event.target.value, price: event.target.value*reservationInfo.nights}});
    }

    return (
        reservationInfo && <div className={'d-flex'}>
            <Form id={'reservationCreate'} onSubmit={saveReservation}>
                <div className={"justify-content-center mt-3 mb-3"}>
                    <CommonInputText disabled={true} type={'text'} value={reservationInfo.reservationNumber}
                                     label={t('reservationNumber')}/>
                    {reservationInfo.creationDate && <CustomDatePicker label={t('CreationDate')}
                                      selectedDate={reservationInfo.creationDate}
                                      name={'creationDate'}
                                      disabled={true}
                    />}
                    <div className={"d-flex"}>
                        <CustomDatePicker label={t('checkIn')}
                                          minDate={reservation.id == null ? dayjs(new Date()) : dayjs(reservation.checkIn)}
                                          selectedDate={reservationInfo.checkIn}
                                          name={'checkIn'}
                                          setValue={setReservationInfo}
                                          disabledDates={disabledDates}
                                          disabled={reservation.id != null && (reservationInfo.status !== "PENDING" ||
                                              reservationInfo.status !== "CONFIRMED")}
                        />
                        <CustomDatePicker label={t('checkOut')}
                                          minDate={dayjs(reservationInfo.checkIn).add(1, 'day')}
                                          selectedDate={reservationInfo.checkOut}
                                          name={'checkOut'}
                                          setValue={setReservationInfo}
                                          disabledDates={disabledDates}
                                          disabled={reservation.status === "FINISHED"}
                        />
                    </div>
                    {rooms && <CustomSelect
                        options={rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => {
                            return {value: room.id, label: room.name}
                        })}
                        defaultValue={filter.roomId} handleSelect={handleSelectRoom}
                        label={t("roomName")}/>}
                    <CommonInputText type={'text'} value={reservationInfo.nights}
                                     label={t('nights')} disabled={true}/>
                    {reservation.status !== "FINISHED" && <CustomSelect
                        options={typesOptions} defaultValue={type} handleSelect={handleSelect}
                        label={t("Type")} required={false}
                        isClearable={true}/>}
                    <CommonInputText name={"pricePerNight"} label={t("pricePerNight")} handleInput={handlePricePerNightChange}
                                     type={"number"} value={reservationInfo.pricePerNight}/>
                    <CommonInputText name={"price"} label={t("price")} handleInput={handlePriceChange}
                                     type={"number"} value={reservationInfo.price}/>
                    <div className={"w-45"}><CustomSelect
                        options={currencyOptions.map((currency) => ({
                            label: t(currency.label),
                            value: currency.value,
                            image: currency.image
                        }))}
                        label={t("Currency")} name={"currency"}
                        setObjectValue={setReservationInfo}
                        defaultValue={reservationInfo.currency} isClearable={true}/></div>
                    {(!setNewReservation && reservation.status!=="FINISHED") && <Button type={'submit'} className={'register-button'}
                                                  disabled={reservation.status === "FINISHED"}>{t("save")}</Button>}
                </div>
            </Form>
        </div>
    )
}