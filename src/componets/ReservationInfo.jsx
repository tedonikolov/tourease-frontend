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

export default function ReservationInfo({reservation, filter, setNewReservation, setShowReservation}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const [loggedUser] = useContext(AuthContext);
    const [reservationInfo, setReservationInfo] = useState( {...reservation, pricePerNight: 0 });
    const [typesOptions, setTypesOptions] = useState([]);
    const [type, setType] = useState();
    const [disabledDates, setDisabledDates] = useState();

    useEffect(() => {
        setReservationInfo(reservation);
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
            toast.success(<CustomToastContent content={[t("updateReservation")]}/>);
            setShowReservation(false);
        }
    })

    useEffect(() => {
        if (reservationInfo && takenDaysForRoom) {
            reservationInfo.id ? setDisabledDates(() => takenDaysForRoom.filter((day) => {
                return !(dayjs(day).isAfter(dayjs(reservationInfo.checkIn).startOf('day')) && dayjs(day).isBefore(dayjs(reservationInfo.checkOut).startOf('day')))
            })): setDisabledDates(() => takenDaysForRoom);
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
        }
    }, [type]);

    useEffect(() => {
            setReservationInfo((prev) => ({
                ...prev,
                price: reservationInfo.pricePerNight * reservationInfo.nights,
            }))
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

    function handlePriceChange(event) {
        setReservationInfo((prevState) => ({
            ...prevState,
            price: event.target.value,
            pricePerNight: reservationInfo.nights!==0 ? parseFloat((event.target.value/reservationInfo.nights).toFixed(2)) : 0,
        }))
    }

    function handlePricePerNightChange(event) {
        setReservationInfo((prevState) => ({
            ...prevState,
            pricePerNight: event.target.value,
            price: reservationInfo.nights!==0 ? event.target.value*reservationInfo.nights : 0,
        }))
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
                    <CommonInputText type={'text'} value={reservationInfo.nights}
                                     label={t('nights')} disabled={true}/>
                    {reservation.status !== "FINISHED" && <CustomSelect
                        options={typesOptions} defaultValue={type} handleSelect={handleSelect}
                        label={t("Type")} required={false}
                        isClearable={true}/>}
                    <CommonInputText name={"pricePerNight"} label={t("pricePerNight")} handleInput={handlePricePerNightChange}
                                     type={"number"} value={reservationInfo.pricePerNight} disabled={reservationInfo.paid}/>
                    <CommonInputText name={"price"} label={t("price")} handleInput={handlePriceChange}
                                     type={"number"} value={reservationInfo.price} disabled={reservationInfo.paid}/>
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