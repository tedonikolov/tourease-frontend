import CustomDatePicker from "./CustomDatePicker";
import {Button, Modal} from "react-bootstrap";
import dayjs from "dayjs";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {HotelContext} from "../context/HotelContext";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    cancelReservation, confirmReservation,
    createReservationByWorker,
    getConfirmReservationsForHotel,
} from "../hooks/hotel";
import CustomTable from "./CustomTable";
import NoDataComponent from "./NoDataComponent";
import ReservationInfo from "./ReservationInfo";
import {defaultCustomer, defaultReservation} from "../utils/defaultValues";
import CustomerInfo from "./CustomerInfo";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {
    faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function Reservations({status, fromDate, toDate}) {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const [filter, setFilter] = useState({
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        hotelId: null,
        status: null,
        roomId: null
    });
    const [showNewReservation, setShowNewReservation] = useState(false);
    const [newReservation, setNewReservation] = useState(false);
    const [reservation, setReservation] = useState(false);

    useEffect(() => {
        if (workerHotel) {
            setFilter((prevValue) => ({
                ...prevValue,
                hotelId: workerHotel.id
            }))
        }
        if (status) {
            setFilter((prevValue) => ({
                ...prevValue,
                status: status
            }))
        }
    }, [workerHotel, status]);

    function clearCache() {
        queryClient.resetQueries({
            queryKey: ["get all reservations for hotel", {
                date: filter.date,
                hotelId: filter.hotelId,
                status: "CONFIRMED"
            }]
        });
        queryClient.resetQueries({
            queryKey: ["get all reservations for hotel", {
                date: filter.date,
                hotelId: filter.hotelId,
                status: "PENDING"
            }]
        });
        queryClient.resetQueries({
            queryKey: ["get all reservations for hotel", {
                date: filter.date,
                hotelId: filter.hotelId,
                status: "CANCELLED"
            }]
        });
        queryClient.resetQueries({
            queryKey: ["get all free rooms for hotel", {
                date: filter.date,
                hotelId: filter.hotelId
            }]
        });
        queryClient.resetQueries({queryKey: ["get reservation", {date: filter.date, roomId: filter.roomId}]});
    }

    const {isSuccess, data: reservations} = useQuery({
        queryKey: ["get all reservations for hotel", filter.hotelId && {
            date: filter.date,
            hotelId: filter.hotelId,
            status: filter.status
        }],
        queryFn: () => getConfirmReservationsForHotel(filter),
        enabled: filter.hotelId != null && filter.date !== "Invalid Date",
    })

    const {mutate: createReservation} = useMutation({
        mutationFn: () => createReservationByWorker(loggedUser.id, newReservation, filter.roomId),
        onSuccess: () => {
            clearCache();
            queryClient.resetQueries({
                queryKey: ["get all free room count for hotel", {
                    fromDate: fromDate,
                    toDate: toDate,
                    hotelId: filter.hotelId
                }]
            });
            toast.success(<CustomToastContent content={[t("successReservation")]}/>);
            setShowNewReservation(false);
        }
    })

    const disabled = (newReservation.checkIn === 'Invalid Date' || newReservation.checkIn === null
            || newReservation.checkOut === 'Invalid Date' || newReservation.checkOut === null) || newReservation.typeId === null ||
        newReservation.price === 0 || newReservation.currency === "" || newReservation.fullName === "" || filter.roomId === null;

    const {mutate: cancelReservationById} = useMutation({
        mutationFn: (id) => cancelReservation(id),
        onSuccess: () => {
            clearCache();
            toast.success(<CustomToastContent content={[t("successCancelled")]}/>);
        }
    })

    const {mutate: confirmReservationById} = useMutation({
        mutationFn: (reservation) => confirmReservation(reservation.id),
        onSuccess: () => {
            clearCache();
            queryClient.resetQueries({
                queryKey: ["get all free room count for hotel", {
                    fromDate: fromDate,
                    toDate: toDate,
                    hotelId: filter.hotelId
                }]
            });
            toast.success(<CustomToastContent content={[t("successConfirm")]}/>);
        }
    })

    function buttonIcon() {
        return faCheckSquare
    }

    return (
        <div className={"w-100"}>
            <div className={"d-flex align-self-center justify-items-center m-2"}>
                <CustomDatePicker label={t('date')}
                                  selectedDate={filter.date}
                                  name={'date'}
                                  setValue={setFilter}/>
                <div className={"d-flex align-self-end h-50"}>
                    <Button className={"register-button"}
                            onClick={() => setFilter((prevValue) => ({
                                ...prevValue,
                                date: dayjs(new Date()).format('YYYY-MM-DD')
                            }))}>{t("Today")}</Button></div>
                {(status === "PENDING" || status === "CONFIRMED") && <div className={"d-flex align-self-end mx-4"}>
                    <Button className={"register-button"}
                            onClick={() => setShowNewReservation(true)}>
                        {t("New reservation")}</Button>
                </div>}
            </div>
            {!isSuccess ? <div className="spinner-border text-primary" role="status"/> :
                <div className={"box"}>
                    {reservations && reservations.length > 0 ? <CustomTable
                            darkHeader={false}
                            tableData={reservations}
                            viewComponent={(reservationId) => setReservation(reservations.find(({id}) => id === reservationId))}
                            columns={{
                                headings: ["ReservationNumber", "RoomName", "People", "CheckIn", "CheckOut", "Nights", "Price", "Customer", "Worker", (status === "CANCELLED" && "Status"), (status === "PENDING" && "Action")],
                                items: reservations.map(({
                                                             reservationNumber,
                                                             room,
                                                             people,
                                                             checkIn,
                                                             checkOut,
                                                             nights,
                                                             price,
                                                             currency,
                                                             customers,
                                                             workerName,
                                                             status
                                                         }) =>
                                    [reservationNumber, room.name, people, dayjs(checkIn).format("DD-MM-YYYY"), dayjs(checkOut).format("DD-MM-YYYY"),
                                        nights, price + " " + (currency != null ? currency : ""), customers.map(customer => customer.fullName), workerName.split(" ")[0],
                                        filter.status === "CANCELLED" ? t(status) : null])
                            }}
                            onDelete={filter.status === "PENDING" && cancelReservationById}
                            onAction={filter.status === "PENDING" && confirmReservationById}
                            actionIcon={filter.status === "PENDING" && buttonIcon}
                        />
                        :
                        <div><NoDataComponent sentence={"No reservations"}/></div>}
                    <Modal show={reservation} onHide={() => {
                        setReservation(null)
                        setFilter((prevValue) => ({
                            ...prevValue,
                            roomId: null
                        }))
                    }} size={"lg"}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("Reservation")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {reservation && <ReservationInfo
                                reservation={reservation} setShowReservation={setReservation}
                                setFilter={setFilter} room={reservation.room}
                                filter={{...filter, roomId: filter.roomId ? filter.roomId : reservation.room.id}}/>}
                        </Modal.Body>
                    </Modal>
                    <Modal show={showNewReservation} onHide={() => {
                        setShowNewReservation(false)
                        setFilter((prevValue) => ({
                            ...prevValue,
                            roomId: null
                        }))
                    }} size={"xl"}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("Reservation")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className={"d-flex"}>
                                <div className={"box px-4"}>
                                    <ReservationInfo
                                        reservation={defaultReservation} setNewReservation={setNewReservation}
                                        filter={filter} setFilter={setFilter}/>
                                </div>
                                <div className={"box px-4"}>
                                    <CustomerInfo reservationId={0}
                                                  customer={defaultCustomer}
                                                  filter={filter}
                                                  setNewReservation={setNewReservation}/>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className={"d-flex justify-content-between"}>
                            <Button className={"login-button"} disabled={disabled}
                                    onClick={createReservation}>{t("save")}</Button>
                            {newReservation.fullName === "" && <div className={"text-danger"}>{t("enterName")}</div>}
                            <Button className={"close-button"}
                                    onClick={() => {
                                        setShowNewReservation(false)
                                        setFilter((prevValue) => ({
                                            ...prevValue,
                                            roomId: null
                                        }))
                                    }}>{t("close")}</Button>
                        </Modal.Footer>
                    </Modal>
                </div>}
        </div>
    )
}