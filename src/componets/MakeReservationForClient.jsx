import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import {useMutation, useQuery} from "@tanstack/react-query";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {CurrencyContext} from "../context/CurrencyContext";
import {createReservation, getFreeRoomsForDate, getNotAvailableDates} from "../hooks/core";
import {currencyOptions} from "../utils/options";

export default function MakeReservationForClient({
                                            hotel,
                                            setHotel
                                        }) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {loggedUser} = useContext(AuthContext);
    const {currency, changePrice} = useContext(CurrencyContext);

    const [reservationInfo, setReservationInfo] = useState({
        peopleCount: hotel && hotel.people ? hotel.people : 1,
        checkIn: hotel && hotel.fromDate ? hotel.fromDate : dayjs(new Date()).format('YYYY-MM-DD'),
        checkOut: hotel && hotel.toDate ? hotel.toDate : dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
        nights: 1,
        pricePerNight: 0,
        priceForMeal: 0,
        price: 0,
        currency: currency
    });
    const [typesOptions, setTypesOptions] = useState([]);
    const [typeId, setTypeId] = useState();
    const [mealId, setMealId] = useState();

    const {data: dates} = useQuery({
        queryKey: ["get not available dates", typeId],
        queryFn: () => getNotAvailableDates(typeId),
        enabled: typeId != null,
        retry: false,
        staleTime: 5000
    })

    const {data: rooms} = useQuery({
        queryKey: ["get all free rooms for hotel", hotel && {
            fromDate: reservationInfo.checkIn,
            toDate: reservationInfo.checkOut,
            hotelId: hotel.hotelId,
            typeId: typeId
        }],
        queryFn: () => getFreeRoomsForDate({hotelId: hotel.hotelId, fromDate:reservationInfo.checkIn, toDate:reservationInfo.checkOut, typeId: typeId}),
        enabled: reservationInfo.checkIn !== "Invalid Date" && reservationInfo.checkOut !== "Invalid Date" && reservationInfo.checkIn !== null && reservationInfo.checkOut !== null && typeId != null,
    })

    const {mutate} = useMutation({
        mutationFn: () => createReservation(loggedUser.id, {...reservationInfo, hotelId: hotel.hotelId}),
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("createdReservation"), t("checkReservation")]}/>);
            setHotel(null);
        }
    })

    useEffect(() => {
        if (hotel && hotel.types) {
            setTypesOptions(() => hotel.types.map((type) => {
                return {label: type.name, value: type.id}
            }));
        }
    }, [hotel]);

    function calcPeople(beds) {
        {
            let sum = 0;
            beds.forEach(bed => sum += bed.people);
            return sum;
        }
    }

    useEffect(() => {
        if (typeId) {
            if (hotel.types) {
                let type = hotel.types.find((type) => type.id === typeId);
                setReservationInfo((prev) => ({
                    ...prev,
                    typeId: type.id,
                    pricePerNight: changePrice({currency: type.currency, price: type.price}, currency),
                    peopleCount: calcPeople(type.beds),
                }))
            }
        }
    }, [typeId]);

    useEffect(() => {
        if (mealId) {
            let meal = hotel.meals.find((meal) => meal.id === mealId);
            setReservationInfo((prev) => ({
                ...prev,
                mealId: meal.id,
                priceForMeal: changePrice({currency: meal.currency, price: meal.price}, currency),
            }))
        }
    }, [mealId]);

     useEffect(() => {
             setReservationInfo((prev) => ({
                 ...prev,
                 price: (((reservationInfo.priceForMeal * reservationInfo.peopleCount) + reservationInfo.pricePerNight) * reservationInfo.nights).toFixed(2)
             }))
    }, [reservationInfo.pricePerNight, reservationInfo.peopleCount, reservationInfo.priceForMeal, reservationInfo.nights]);

    useEffect(() => {
        if (reservationInfo.checkIn && reservationInfo.checkOut) {
            const nights = dayjs(reservationInfo.checkOut).startOf('day').diff(dayjs(reservationInfo.checkIn).startOf('day'), 'day');
            setReservationInfo((prev) => ({
                ...prev,
                nights: nights
            }))
        }
    }, [reservationInfo.checkOut, reservationInfo.checkIn]);

    function saveReservation(event) {
        mutate();
        event.preventDefault();
    }

    function handleSelectType(newValue) {
        newValue ? setTypeId(newValue.value) : setTypeId(null);
    }

    function handleSelectMeal(newValue) {
        newValue ? setMealId(newValue.value) : setMealId(null);
    }

    const disabled = ( rooms && rooms.length === 0) ||
        reservationInfo.checkIn > reservationInfo.checkOut ||
        reservationInfo.checkIn === reservationInfo.checkOut;

    return (
        reservationInfo && <div className={'d-flex'}>
            <Form id={'reservationCreate'} onSubmit={saveReservation}>
                <div className={"justify-content-center mt-3 mb-3"}>
                    <div className={"d-flex"}>
                        <CustomDatePicker label={t('checkIn')}
                                          minDate={dayjs(new Date())}
                                          selectedDate={reservationInfo.checkIn}
                                          name={'checkIn'}
                                          setValue={setReservationInfo}
                                          disabledDates={dates && dates.checkInDates}
                        />
                        <CustomDatePicker label={t('checkOut')}
                                          minDate={dayjs(reservationInfo.checkIn).add(1, 'day')}
                                          maxDate={hotel && dayjs(hotel.closingDate)}
                                          selectedDate={reservationInfo.checkOut}
                                          name={'checkOut'}
                                          setValue={setReservationInfo}
                                          disabledDates={dates && dates.checkOutDates}
                        />
                    </div>
                    <CommonInputText type={'text'} value={reservationInfo.nights}
                                     label={t('nights')} disabled={true}/>
                    <CommonInputText name={"peopleCount"} label={t("people")} disabled={true}
                                                        setObjectValue={setReservationInfo}
                                                        type={"number"} value={reservationInfo.peopleCount}/>
                    {typesOptions && <CustomSelect
                        options={typesOptions} defaultValue={typeId} handleSelect={handleSelectType}
                        label={t("Type")} required={true}/>}
                    {rooms && rooms.length === 0 && <p className={'text-danger'}>{t("Not available rooms")}</p>}
                    {rooms && typeId && <CustomSelect required={true}
                                                      options={rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => {
                                                          return {value: room.id, label: room.name}
                                                      })}
                                                      defaultValue={reservationInfo.roomId} label={t("roomName")}
                                                      setObjectValue={setReservationInfo} name={"roomId"}
                    />}
                    {hotel && hotel.meals && <CustomSelect
                        options={hotel.meals.sort((a, b) => a.id - b.id).map((meal) => ({label: t(meal.type), value: meal.id}))}
                        defaultValue={mealId} handleSelect={handleSelectMeal}
                        label={t("Meal")} required={true}/>}
                    <CommonInputText name={"priceForMeal"} label={t("priceForMeal")}
                                     disabled={true}
                                     type={"number"} value={reservationInfo.priceForMeal}/>
                    <CommonInputText name={"pricePerNight"} label={t("pricePerNight")}
                                     disabled={true}
                                     type={"number"} value={reservationInfo.pricePerNight}/>
                    <CommonInputText name={"price"} label={t("price")} disabled={true}
                                     type={"number"} value={reservationInfo.price}/>
                    <div className={"w-45"}><CustomSelect
                        options={currencyOptions.map((currency) => ({
                            label: t(currency.label),
                            value: currency.value,
                            image: currency.image
                        }))}
                        label={t("Currency")} disabled={true}
                        defaultValue={reservationInfo.currency}/></div>
                    {disabled && <p className={'text-danger'}>{t("Not available")}</p>}
                        <Button type={'submit'} className={'register-button'} disabled={disabled}>
                            {t("Reserve")}</Button>
                </div>
            </Form>
        </div>
    )
}