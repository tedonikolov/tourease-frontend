import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import {currencyOptions} from "../utils/options";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    getFreeRoomsForDate, getNotAvailableDatesForType,
    getTakenDaysForRoom,
    getTypesForRoom,
    getTypesForRoomByPeopleCount,
    updateReservation
} from "../hooks/hotel";
import dayjs from "dayjs";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {CurrencyContext} from "../context/CurrencyContext";
import {HotelContext} from "../context/HotelContext";
import {Manager} from "../utils/Role";

export default function ReservationInfo({
                                            reservation,
                                            filter,
                                            setFilter,
                                            setNewReservation,
                                            setShowReservation,
                                            room,
                                            fromDate,
                                            toDate,
                                            newPrice,
                                        }) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {loggedUser,permission} = useContext(AuthContext);
    const {currency, handleRate, currencies} = useContext(CurrencyContext);
    const {workerHotel} = useContext(HotelContext);
    const [oldCurrency, setOldCurrency] = useState(null);
    const [reservationInfo, setReservationInfo] = useState({
        ...reservation,
        peopleCount: reservation.peopleCount ?? 1,
        pricePerNight: reservation.pricePerNight ? reservation.pricePerNight : 0,
        priceForMeal: reservation.priceForMeal ? reservation.priceForMeal : 0,
        price: reservation.price ? ((reservation.price * (1 + reservation.discount / 100)) + reservation.sub) : 0,
        discount: reservation.discount ? reservation.discount : 0,
        sub: reservation.sub ? reservation.sub : 0,
        priceWithDiscount: 0,
        currency: currency,
        typeId: reservation.type && reservation.type.id,
        mealId: reservation.meal && reservation.meal.id,
    });
    const [typesOptions, setTypesOptions] = useState([]);
    const [typeId, setTypeId] = useState(reservation.type && reservation.type.id);
    const [disabledCheckInDates, setDisabledCheckInDates] = useState();
    const [disabledCheckOutDates, setDisabledCheckOutDates] = useState();
    const [mealId, setMealId] = useState(reservation.meal && reservation.meal.id);

    useEffect(() => {
        setReservationInfo({
            ...reservation,
            peopleCount: reservation.peopleCount ?? 1,
            pricePerNight: reservation.pricePerNight ? reservation.pricePerNight : 0,
            priceForMeal: reservation.priceForMeal ? reservation.priceForMeal : 0,
            price: reservation.price ? ((reservation.price / (1 - reservation.discount / 100)) + reservation.sub) : 0,
            discount: reservation.discount ? reservation.discount : 0,
            sub: reservation.sub ? reservation.sub : 0,
            priceWithDiscount: 0,
            currency: currency,
            typeId: reservation.type && reservation.type.id,
            mealId: reservation.meal && reservation.meal.id,
        });
        setOldCurrency((prev) => {
            return {
                ...prev,
                price: reservation.price ? ((reservation.price / (1 - reservation.discount / 100)) + reservation.sub) : 0,
                pricePerNight: reservation.pricePerNight ? reservation.pricePerNight : 0,
                priceForMeal: reservation.priceForMeal ? reservation.priceForMeal : 0,
                currency: currency,
            }
        });
        if (reservation.type) {
            setTypeId(reservation.type.id);
        }
        if (reservation.meal) {
            setMealId(reservation.meal.id);
        }
    }, [reservation]);

    const {data: types} = useQuery(
        {
            queryKey: ["get types", filter.hotelId, reservationInfo.peopleCount, filter.roomId],
            queryFn: () => filter.roomId != null ? getTypesForRoom(filter.roomId) : getTypesForRoomByPeopleCount(filter.hotelId, reservationInfo.peopleCount),
            enabled: (reservationInfo.peopleCount != null && reservationInfo.peopleCount != "" && filter.hotelId != null) || filter.roomId != null,
            retry: false,
            staleTime: 5000
        });

    const {data: dates} = useQuery({
        queryKey: ["get not free dates", filter.roomId ? filter.roomId : reservationInfo.typeId],
        queryFn: () => filter.roomId ? getTakenDaysForRoom(filter.roomId) : getNotAvailableDatesForType(reservationInfo.typeId),
        enabled: reservationInfo.typeId != null,
        retry: false,
        staleTime: 5000
    })

    const {data: rooms} = useQuery({
        queryKey: ["get all free rooms for hotel", filter.hotelId && {
            fromDate: reservationInfo.checkIn,
            toDate: reservationInfo.checkOut,
            hotelId: filter.hotelId,
            typeId: typeId
        }],
        queryFn: () => getFreeRoomsForDate({hotelId: filter.hotelId, fromDate:reservationInfo.checkIn, toDate:reservationInfo.checkOut, typeId: typeId}),
        enabled: filter.hotelId != null && reservationInfo.checkIn !== "Invalid Date" && reservationInfo.checkOut !== "Invalid Date" && reservationInfo.checkIn !== null && reservationInfo.checkOut !== null && typeId != null,
    })

    const {mutate} = useMutation({
        mutationFn: () => updateReservation(loggedUser.id, {...reservationInfo, price: reservationInfo.priceWithDiscount? reservationInfo.priceWithDiscount : reservationInfo.price}),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservation", filter]});
            queryClient.resetQueries({queryKey: ["get unpaid payments", reservation && reservation.customers]});
            filter.hotelId && queryClient.resetQueries({
                queryKey: ["get all reservations for hotel", {
                    date: filter.date,
                    hotelId: filter.hotelId,
                    status: filter.status
                }]
            });
            fromDate && queryClient.resetQueries({
                queryKey: ["get all free room count for hotel", {
                    fromDate: fromDate,
                    toDate: toDate,
                    hotelId: filter.hotelId
                }]
            });
            toast.success(<CustomToastContent content={[t("updateReservation")]}/>);
            setShowReservation(false);
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
        if (reservationInfo && dates) {
            reservationInfo.id ? setDisabledCheckInDates(() => dates.checkInDates.filter((day) => {
                return !(dayjs(day).isAfter(dayjs(reservationInfo.checkIn).startOf('day')) && dayjs(day).isBefore(dayjs(reservationInfo.checkOut).add(1, 'day').startOf('day')))
            })) : setDisabledCheckInDates(() => dates.checkInDates);
            reservationInfo.id ? setDisabledCheckOutDates(() => dates.checkOutDates.filter((day) => {
                return !(dayjs(day).isAfter(dayjs(reservationInfo.checkIn).startOf('day')) && dayjs(day).isBefore(dayjs(reservationInfo.checkOut).add(1, 'day').startOf('day')))
            })) : setDisabledCheckOutDates(() => dates.checkOutDates);
        }
    }, [dates]);

    useEffect(() => {
        if (types) {
            setTypesOptions(() => types.map((type) => {
                return {label: type.name, value: type.id}
            }));
        }
    }, [types]);

    useEffect(() => {
            if (typeId) {
                if (types) {
                    let type = types.find((type) => type.id === typeId);
                    if(type) {
                        setReservationInfo((prev) => ({
                            ...prev,
                            typeId: type.id,
                        }))
                        if(reservation.type==null || reservation.type.id!==typeId) {
                            setOldCurrency((prev) => {
                                return {
                                    ...prev,
                                    pricePerNight: type.price,
                                }
                            });
                            setReservationInfo((prev) => ({
                                ...prev,
                                pricePerNight: type.price,
                            }))
                        }else {
                            setOldCurrency((prev) => {
                                return {
                                    ...prev,
                                    pricePerNight: reservation.pricePerNight,
                                }
                            });
                            setReservationInfo((prev) => ({
                                ...prev,
                                pricePerNight: reservation.pricePerNight,
                            }))
                        }
                    }
                }
            } else {
                setReservationInfo((prev) => ({
                    ...prev,
                    typeId: null,
                    pricePerNight: 0,
                    currency: currency
                }))
                setOldCurrency((prev) => {
                    return {
                        ...prev,
                        currency: currency,
                        pricePerNight: 0,
                    }
                });
            }
    }, [typeId, types, reservationInfo.nights]);

    useEffect(() => {
            if (mealId) {
                let meal = workerHotel.meals.find((meal) => meal.id === mealId);
                setReservationInfo((prev) => ({
                    ...prev,
                    mealId: meal.id,
                }))
                if(reservation.meal==null || reservation.meal.id!==mealId) {
                    setOldCurrency((prev) => {
                        return {
                            ...prev,
                            priceForMeal: meal.price,
                        }
                    });
                    setReservationInfo((prev) => ({
                        ...prev,
                        priceForMeal: meal.price,
                    }))
                }else {
                    setOldCurrency((prev) => {
                        return {
                            ...prev,
                            priceForMeal: reservation.priceForMeal,
                        }
                    });
                    setReservationInfo((prev) => ({
                        ...prev,
                        priceForMeal: reservation.priceForMeal,
                    }))
                }
            } else {
                setReservationInfo((prev) => ({
                    ...prev,
                    meal: null,
                    priceForMeal: 0,
                    currency: currency
                }))
                setOldCurrency((prev) => {
                    return {
                        ...prev,
                        currency: currency,
                        priceForMeal: 0
                    }
                });
            }
    }, [mealId, reservationInfo.nights, reservationInfo.peopleCount]);

    useEffect(() => {
        if (reservationInfo.pricePerNight === reservation.pricePerNight && reservationInfo.priceForMeal === reservation.priceForMeal
            && reservationInfo.peopleCount === reservation.peopleCount && reservationInfo.nights === reservation.nights) {
            setReservationInfo((prev) => ({
                ...prev,
                price: reservation.price ? ((reservation.price / (1 - reservation.discount / 100)) + reservation.sub) : 0,
            }))
            setOldCurrency((prev) => {
                return {
                    ...prev,
                    price: reservation.price ? ((reservation.price / (1 - reservation.discount / 100)) + reservation.sub) : 0,
                }
            });
        } else {
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
        if (!reservationInfo.checkIn) {
            setReservationInfo((prev) => ({
                ...prev,
                checkIn: filter.date
            }))
        }
        if (!reservationInfo.checkOut) {
            setReservationInfo((prev) => ({
                ...prev,
                checkOut: dayjs(filter.date).add(1, 'day').format("YYYY-MM-DD")
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
        setNewReservation && setNewReservation((prevValue) => ({...prevValue, ...reservationInfo}));
    }, [reservationInfo]);

    useEffect(() => {
        setReservationInfo((prev) => ({
            ...prev,
            priceWithDiscount: parseFloat(reservationInfo.discount ? (reservationInfo.price * (1 - reservationInfo.discount / 100)) - reservationInfo.sub : reservationInfo.price - reservationInfo.sub).toFixed(2)
        }))
        setOldCurrency((prev) => {
            return {
                ...prev,
                priceWithDiscount: parseFloat(reservationInfo.discount ? (reservationInfo.price * (1 - reservationInfo.discount / 100)) - reservationInfo.sub : reservationInfo.price - reservationInfo.sub).toFixed(2)
            }
        });

    }, [reservationInfo.sub, reservationInfo.discount, reservationInfo.price]);

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

    function handleSelectRoom(newValue) {
        setFilter((prevValue) => ({
            ...prevValue,
            roomId: newValue.value
        }))
        setReservationInfo((prevValue) => ({
            ...prevValue,
            room: rooms.find((room) => room.id === newValue.value)
        }))
    }

    function handlePricePerNightChange(event) {
        setReservationInfo((prevState) => ({
            ...prevState,
            pricePerNight: event.target.value,
            priceForMeal: reservationInfo.priceForMeal,
            price: ((reservationInfo.priceForMeal * reservationInfo.peopleCount) + event.target.value) * reservationInfo.nights
        }))
        setOldCurrency((prev) => {
            return {
                ...prev,
                currency: reservationInfo.currency,
                pricePerNight: event.target.value,
                priceForMeal: reservationInfo.priceForMeal,
                price: ((reservationInfo.priceForMeal * reservationInfo.peopleCount) + event.target.value) * reservationInfo.nights
            }
        });
    }

    function handlePriceForMealChange(event) {
        setReservationInfo((prevState) => ({
            ...prevState,
            pricePerNight: reservationInfo.pricePerNight,
            priceForMeal: event.target.value,
            price: ((event.target.value * reservationInfo.peopleCount) + reservationInfo.pricePerNight) * reservationInfo.nights
        }))
        setOldCurrency((prev) => {
            return {
                ...prev,
                currency: reservationInfo.currency,
                pricePerNight: reservationInfo.pricePerNight,
                priceForMeal: event.target.value,
                price: ((event.target.value * reservationInfo.peopleCount) + reservationInfo.pricePerNight) * reservationInfo.nights
            }
        });
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
                                          minDate={reservation.id === 0 ? dayjs(new Date()) : dayjs(reservation.checkIn)}
                                          selectedDate={reservationInfo.checkIn}
                                          name={'checkIn'}
                                          setValue={setReservationInfo}
                                          disabledDates={disabledCheckOutDates!==undefined && disabledCheckInDates}
                                          disabled={reservation.id !== 0 && (reservationInfo.status !== "PENDING" ||
                                              reservationInfo.status !== "CONFIRMED")}
                        />
                        <CustomDatePicker label={t('checkOut')}
                                          minDate={dayjs(reservationInfo.checkIn).add(1, 'day')}
                                          selectedDate={reservationInfo.checkOut}
                                          name={'checkOut'}
                                          setValue={setReservationInfo}
                                          disabledDates={disabledCheckOutDates!==undefined && disabledCheckOutDates}
                                          maxDate={(reservationInfo.id && filter.roomId && disabledCheckOutDates && disabledCheckOutDates.length>0) ? dayjs(disabledCheckOutDates.sort((a, b) => dayjs(b).diff(dayjs(a)))[0]) > reservationInfo.checkOut ? dayjs(disabledCheckOutDates.sort((a, b) => dayjs(b).diff(dayjs(a)))[0]) : null : null}
                                          disabled={reservation.status === "FINISHED" || reservation.status === "NO_SHOW" || reservation.status === "CANCELLED"}
                        />
                    </div>
                    <CommonInputText type={'text'} value={reservationInfo.nights}
                                     label={t('nights')} disabled={true}/>
                    <CommonInputText name={"peopleCount"} label={t("people")}
                                                        setObjectValue={setReservationInfo}
                                                        disabled={reservation.id != 0 && reservationInfo.status !== "PENDING" && permission !== Manager}
                                                        type={"number"} value={reservationInfo.peopleCount}/>
                    {typesOptions && <CustomSelect
                        options={typesOptions} defaultValue={typeId} handleSelect={handleSelectType}
                        label={t("Type")} required={true}
                        disabled={reservation.id != 0 && reservationInfo.status !== "PENDING" && permission !== Manager}/>}
                    {reservationInfo && reservationInfo.id==null && rooms && rooms.length === 0 && <p className={'text-danger'}>{t("Not available rooms")}</p>}
                    {rooms && typeId && <CustomSelect required={true}
                        options={(room ? [...rooms, room] : rooms).sort((a, b) => a.name.localeCompare(b.name)).map((room) => {
                            return {value: room.id, label: room.name}
                        })}
                        defaultValue={filter.roomId} handleSelect={handleSelectRoom} label={t("roomName")}
                        disabled={reservation.id != 0 && (reservationInfo.status !== "PENDING" && reservationInfo.status !== "CONFIRMED")}
                    />}
                    {workerHotel.meals && <CustomSelect
                        options={workerHotel.meals.sort((a, b) => a.id - b.id).map((meal) => ({label: t(meal.type), value: meal.id}))}
                        defaultValue={mealId} handleSelect={handleSelectMeal}
                        label={t("Meal")} required={false}
                        disabled={reservation.id != 0 && reservationInfo.status !== "PENDING" && permission !== Manager}
                        />}
                    <CommonInputText name={"priceForMeal"} label={t("priceForMeal")} disabled={permission !== Manager}
                                     handleInput={handlePriceForMealChange}
                                     type={"number"} value={reservationInfo.priceForMeal}/>
                    <CommonInputText name={"pricePerNight"} label={t("pricePerNight")} disabled={permission !== Manager}
                                     handleInput={handlePricePerNightChange}
                                     type={"number"} value={reservationInfo.pricePerNight}/>
                    <CommonInputText name={"discount"} label={t("discount")} disabled={permission !== Manager}
                                     setObjectValue={setReservationInfo}
                                     type={"number"} value={reservationInfo.discount}/>
                    <CommonInputText name={"sub"} label={t("sub")}
                                     setObjectValue={setReservationInfo}
                                     type={"number"} value={reservationInfo.sub}/>
                    <CommonInputText name={"price"} label={t("price")} disabled={true}
                                     type={"number"} value={reservationInfo.priceWithDiscount!=0 ? reservationInfo.priceWithDiscount : reservationInfo.price}/>
                    <div className={"w-45"}><CustomSelect
                        options={currencyOptions.map((currency) => ({
                            label: t(currency.label),
                            value: currency.value,
                            image: currency.image
                        }))}
                        disabled={true} hideIndicator={true}
                        label={t("Currency")} name={"currency"}
                        setObjectValue={setReservationInfo}
                        defaultValue={reservationInfo.currency}/></div>
                    {(!setNewReservation && reservation.status !== "FINISHED") &&
                        <Button type={'submit'} className={'register-button'}
                                disabled={reservation.status === "FINISHED" || reservation.status === "NO_SHOW" || reservation.status === "CANCELLED" ||
                                    reservationInfo.checkIn > reservationInfo.checkOut
                        }>
                            {t("save")}</Button>}
                </div>
            </Form>
        </div>
    )
}