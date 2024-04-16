import CustomDatePicker from "./CustomDatePicker";
import {Button, Modal} from "react-bootstrap";
import dayjs from "dayjs";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {HotelContext} from "../context/HotelContext";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createReservationByWorker, getConfirmReservationsForHotel, getFreeRoomsForDate} from "../hooks/hotel";
import CustomTable from "./CustomTable";
import NoDataComponent from "./NoDataComponent";
import ReservationInfo from "./ReservationInfo";
import {defaultCustomer, defaultReservation} from "../utils/defaultValues";
import CustomerInfo from "./CustomerInfo";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";

export default function Reservations() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const [filter, setFilter] = useState({date: dayjs(new Date()).format('YYYY-MM-DD'), hotelId:null});
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
    }, [workerHotel]);

    const {data:reservations} = useQuery({
        queryKey: ["get all confirm reservations for hotel", filter],
        queryFn: () => getConfirmReservationsForHotel(filter),
        enabled: filter.hotelId != null && filter.date !== "Invalid Date"
    })

    const {data:rooms} = useQuery({
        queryKey: ["get all free rooms for hotel", filter],
        queryFn: () => getFreeRoomsForDate(filter),
        enabled: filter.hotelId != null && filter.date !== "Invalid Date"
    })

    const {mutate: createReservation} = useMutation({
        mutationFn: () => createReservationByWorker(loggedUser.id, newReservation, filter.roomId),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get all confirm reservations for hotel", filter]});
            queryClient.resetQueries({queryKey: ["get reservation", filter]});
            toast.success(<CustomToastContent content={[t("successReservation")]}/>);
            setShowNewReservation(false);
        }
    })

    const disabled = (newReservation.checkIn === 'Invalid Date' || newReservation.checkIn === null
            || newReservation.checkOut === 'Invalid Date' || newReservation.checkOut === null) ||
        newReservation.price === 0 || newReservation.currency === "" || newReservation.fullName === "" || filter.roomId===null;

    return (
        <div className={"w-100 mt-5"}>
            <h4 className={"mx-2"}>{t("Confirm reservations")}:</h4>
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
                <div className={"d-flex align-self-end mx-4"}>
                    <Button className={"register-button"}
                            onClick={() => setShowNewReservation(true)}>
                        {t("New reservation")}</Button>
                </div>
            </div>
            <div className={"box"}>
            {reservations && reservations.length > 0 ? <CustomTable
                    darkHeader={false}
                    tableData={reservations}
                    viewComponent={(reservationId)=>setReservation(reservations.find(({id})=>id===reservationId))}
                    columns={{
                        headings: ["ReservationNumber", "RoomName", "CheckIn", "CheckOut", "Nights", "Price", "Customer", "Worker"],
                        items: reservations.map(({
                                                              reservationId, roomName, checkIn, checkOut, nights, price, currency, customers, workerName
                                                          }) =>
                            [reservationId, roomName, dayjs(checkIn).format("DD-MM-YYYY"),  dayjs(checkOut).format("DD-MM-YYYY"),
                            nights, price+" "+currency, customers.map(customer=>customer.fullName), workerName.split(" ")[0]])
                    }}
                />
                :
                <div><NoDataComponent sentence={"No reservations"}/></div>}
            </div>
            <Modal show={reservation} onHide={() => {
                setReservation(null)
            }} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Reservation")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reservation && <ReservationInfo
                        reservation={reservation} setShowReservation={setReservation}
                        filter={{...filter,roomId:reservation.roomId}}/>}
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
                                filter={filter} rooms={rooms} setFilter={setFilter}/>
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
                    <Button className={"close-button"}
                            onClick={() => { setShowNewReservation(false)
                                setFilter((prevValue) => ({
                                ...prevValue,
                                roomId: null
                            }))
                            }}>{t("close")}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}