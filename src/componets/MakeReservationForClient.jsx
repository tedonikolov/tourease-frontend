import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import {currencyOptions} from "../utils/options";
import {useMutation, useQuery} from "@tanstack/react-query";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {CurrencyContext} from "../context/CurrencyContext";
import {createReservationByWorker, getNotAvailableDates} from "../hooks/core";

export default function MakeReservationForClient({
                                            hotel,
                                            setHotel
                                        }) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {loggedUser} = useContext(AuthContext);
    const {currency, handleRate, currencies} = useContext(CurrencyContext);
    const [oldCurrency, setOldCurrency] = useState(null);
    const [reservationInfo, setReservationInfo] = useState({
        peopleCount: hotel && hotel.people ? hotel.people : 1,
        checkIn: dayjs(new Date()).format('YYYY-MM-DD'),
        checkOut: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
        nights: 1,
        pricePerNight: 0,
        priceForMeal: 0,
        price: 0,
        currency: currency
    });
    const [typesOptions, setTypesOptions] = useState([]);
    const [typeId, setTypeId] = useState();
    const [disabledDates, setDisabledDates] = useState();
    const [mealId, setMealId] = useState();

    const {data: notAvailableDates} = useQuery({
        queryKey: ["get not available dates", typeId, reservationInfo.checkIn, reservationInfo.checkOut],
        queryFn: () => getNotAvailableDates(hotel.hotelId, typeId, reservationInfo.checkIn, reservationInfo.checkOut),
        enabled: typeId != null && reservationInfo.checkIn != null && reservationInfo.checkOut != null,
        retry: false,
        staleTime: 5000
    })

    const {mutate} = useMutation({
        mutationFn: () => createReservationByWorker(loggedUser.id, {...reservationInfo, hotelId: hotel.hotelId}),
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("createdReservation")]}/>);
            setHotel(null);
        }
    })

    function changePrice(rate) {
        setReservationInfo((prev) => {
            return {
                ...prev,
                price: parseFloat((oldCurrency.price / rate).toFixed(2)),
                priceForMeal: parseFloat((oldCurrency.priceForMeal / rate).toFixed(2)),
                pricePerNight: parseFloat((oldCurrency.pricePerNight / rate).toFixed(2)),
            }
        })
    }

    useEffect(() => {
        if (currencies && reservationInfo && oldCurrency) {
            changePrice(handleRate(oldCurrency, reservationInfo.currency));
        }
    }, [currencies, oldCurrency, reservationInfo && reservationInfo.currency]);

    useEffect(() => {
        if (notAvailableDates) {
            let days = notAvailableDates.filter((day) => {
                return dayjs(day).isAfter(dayjs(reservationInfo.checkIn).add(1, 'day').endOf('day'))
            })
            setDisabledDates(() => days);
        }
    }, [notAvailableDates]);

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
                    pricePerNight: type.price,
                    peopleCount: calcPeople(type.beds),
                    currency: type.currency
                }))
                setOldCurrency((prev) => {
                    return {
                        ...prev,
                        currency: type.currency,
                        pricePerNight: type.price,
                    }
                });
            }
        }
    }, [typeId]);

    useEffect(() => {
        if (mealId) {
            let meal = hotel.meals.find((meal) => meal.id === mealId);
            setReservationInfo((prev) => ({
                ...prev,
                mealId: meal.id,
                priceForMeal: meal.price,
                currency: meal.currency
            }))
            setOldCurrency((prev) => {
                return {
                    ...prev,
                    currency: meal.currency,
                    priceForMeal: meal.price,
                }
            });
        }
    }, [mealId]);

    useEffect(() => {
        if(oldCurrency && reservationInfo.currency === oldCurrency.currency) {
            setReservationInfo((prev) => ({
                ...prev,
                price: ((reservationInfo.priceForMeal * reservationInfo.peopleCount) + reservationInfo.pricePerNight) * reservationInfo.nights
            }))
            setOldCurrency((prev) => {
                return {
                    ...prev,
                    price: ((reservationInfo.priceForMeal * reservationInfo.peopleCount) + reservationInfo.pricePerNight) * reservationInfo.nights
                }
            });
        }
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

    const disabled = disabledDates && disabledDates.filter((date) => dayjs(date).isAfter(dayjs(reservationInfo.checkIn)) && dayjs(date).isBefore(dayjs(reservationInfo.checkOut))).length > 0;

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
                                          disabledDates={disabledDates}
                        />
                        <CustomDatePicker label={t('checkOut')}
                                          minDate={dayjs(reservationInfo.checkIn).add(1, 'day')}
                                          maxDate={hotel && dayjs(hotel.closingDate)}
                                          selectedDate={reservationInfo.checkOut}
                                          name={'checkOut'}
                                          setValue={setReservationInfo}
                                          disabledDates={disabledDates}
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
                        label={t("Currency")} name={"currency"}
                        setObjectValue={setReservationInfo}
                        defaultValue={reservationInfo.currency}/></div>
                    {disabled && <p className={'text-danger'}>{t("Not available")}</p>}
                        <Button type={'submit'} className={'register-button'} disabled={disabled}>
                            {t("Reserve")}</Button>
                </div>
            </Form>
        </div>
    )
}