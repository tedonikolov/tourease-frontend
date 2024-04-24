import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import {HotelContext} from "../context/HotelContext";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    createReservationByWorker, getAllPaymentsByCustomersForHotel,
    getReservationForRoom,
    getRoomById,
    markCheckOut,
} from "../hooks/hotel";
import NoDataComponent from "../componets/NoDataComponent";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import RoomInfo from "../componets/RoomInfo";
import CustomDatePicker from "../componets/CustomDatePicker";
import {Button, Modal} from "react-bootstrap";
import dayjs from "dayjs";
import {defaultCustomer, defaultPayment, defaultReservation} from "../utils/defaultValues";
import ReservationInfo from "../componets/ReservationInfo";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import CustomerInfo from "../componets/CustomerInfo";
import {AuthContext} from "../context/AuthContext";
import PaymentInfo from "../componets/PaymentInfo";
import {CurrencyContext} from "../context/CurrencyContext";

export default function RoomPage() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {loggedUser} = useContext(AuthContext);
    const {currency} = useContext(CurrencyContext);
    const {sideBarVisible} = useContext(SideBarContext);
    const {roomId, date, workerHotel} = useContext(HotelContext);
    const [filter, setFilter] = useState(null);
    const [newCustomer, setNewCustomer] = useState(false);
    const [showReservation, setShowReservation] = useState(false);
    const [showNewReservation, setShowNewReservation] = useState(false);
    const [newReservation, setNewReservation] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        if (roomId && date) {
            setFilter(() => ({
                date: date,
                roomId: roomId
            }))
        }
    }, [roomId, date]);

    const {data: room, isLoading} = useQuery(
        {
            queryKey: ["get room", roomId],
            queryFn: () => getRoomById(roomId),
            enabled: filter != null,
            retry: false,
            staleTime: 5000
        }
    )

    const {data} = useQuery(
        {
            queryKey: ["get reservation", filter],
            queryFn: () => getReservationForRoom(filter),
            enabled: filter != null && filter.date !== "Invalid Date",
            retry: false,
            staleTime: 5000
        }
    )

    const {data: unPaidPayments} = useQuery({
        queryKey: ["get unpaid payments", data && data.reservation && data.reservation.customers],
        queryFn: () => getAllPaymentsByCustomersForHotel(data.reservation.customers.map((customer) => customer.id), workerHotel.id, false),
        enabled: data!=null && data.reservation!=null && data.reservation.customers.length > 0,
        retry: false,
        staleTime: 5000
    })

    const {data: paidPayments} = useQuery({
        queryKey: ["get paid payments", data && data.reservation && data.reservation.customers],
        queryFn: () => getAllPaymentsByCustomersForHotel(data.reservation.customers.map((customer) => customer.id), workerHotel.id, true),
        enabled: data!=null && data.reservation!=null && data.reservation.customers.length > 0,
        retry: false,
        staleTime: 5000
    })

    const {mutate: checkOut} = useMutation({
        mutationKey: ["check out reservation", data && data.reservation && data.reservation.id],
        mutationFn: () => markCheckOut(data.reservation.id),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservation", filter]});
            toast.success(<CustomToastContent content={[t("successCheckOut")]}/>);
        }
    })

    const {mutate: createReservation} = useMutation({
        mutationKey: ["create reservation", newReservation],
        mutationFn: () => createReservationByWorker(loggedUser.id, newReservation, roomId),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservation", filter]});
            toast.success(<CustomToastContent content={[t("successReservation")]}/>);
            setShowNewReservation(false);
        }
    })

    const disabled = (newReservation.checkIn === 'Invalid Date' || newReservation.checkIn === null
            || newReservation.checkOut === 'Invalid Date' || newReservation.checkOut === null) ||
        newReservation.price === 0 || newReservation.currency === "" || newReservation.fullName === "" ||
        newReservation.mealId === 0 || newReservation.peopleCount == 0;

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            {
                room ?
                    <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                        <Header title={t("Room") + " №" + room.name}/>
                        {filter && <div className={"d-flex align-self-center"}>
                            {data && data.reservation && (data.reservation.status === "ACCOMMODATED" || data.reservation.status === "ENDING") && !data.reservation.paid &&
                                <div className={"d-flex align-self-end mx-4"}>
                                    <Button className={"close-button"}
                                            onClick={() => setShowPayment(true)}>
                                        {t("New payment")}</Button>
                                </div>}
                            {data && !data.reservation &&
                                <div className={"d-flex align-self-end mx-4"}>
                                    <Button className={"register-button"}
                                            onClick={() => setShowNewReservation(true)}>
                                        {t("New reservation")}</Button>
                                </div>}
                            {data && data.reservation && data.reservation.status !== "FINISHED" &&
                                <div className={"d-flex align-self-end mx-4"}>
                                <Button className={"register-button"}
                                        onClick={() => setShowReservation(true)}>
                                    {t("Change reservation")}</Button>
                            </div>}
                            <div className={"d-flex align-self-end mx-4"}>
                                {data && data.reservation && data.reservation.status!=="FINISHED" && <Button className={"register-button"}
                                                                     onClick={() => setNewCustomer(true)}>
                                    {t("Add customer")}</Button>}
                            </div>
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
                            {data && data.reservation && data.reservation.status === "ENDING" && unPaidPayments && unPaidPayments.length===0 &&
                                <div className={"d-flex align-self-end mx-4"}>
                                    <Button className={"close-button"}
                                            onClick={() => checkOut()}>
                                        {t("CheckOut")}</Button>
                                </div>}
                        </div>}
                        <RoomInfo data={data} newCustomer={newCustomer} setNewCustomer={setNewCustomer}
                                  filter={filter} unPaidPayments={unPaidPayments} paidPayments={paidPayments}/>
                        <Modal show={showReservation} onHide={() => {
                            setShowReservation(false)
                        }} size={"lg"}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t("Reservation")}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ReservationInfo
                                    reservation={data && data.reservation ? data.reservation : defaultReservation}
                                    filter={filter} setShowReservation={setShowReservation}/>
                            </Modal.Body>
                        </Modal>
                        <Modal show={showNewReservation} onHide={() => {
                            setShowNewReservation(false)
                        }} size={"xl"}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t("Reservation")}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className={"d-flex"}>
                                    <div className={"box px-4"}>
                                        <ReservationInfo
                                            reservation={defaultReservation} setNewReservation={setNewReservation}
                                            filter={filter}/>
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
                                        onClick={() => createReservation()}>{t("save")}</Button>
                                <Button className={"close-button"}
                                        onClick={() => setShowNewReservation(false)}>{t("close")}</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={showPayment} onHide={() => {
                            setShowPayment(false);
                        }} size={"lg"}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t("Payment")}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <PaymentInfo payment={{...defaultPayment,currency:currency}} customers={data && data.reservation && data.reservation.customers}
                                                setShowPayment={setShowPayment}/>
                            </Modal.Body>
                        </Modal>
                    </div>
                    :
                    <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                        <Header title={t("Room")}/>
                        {isLoading ?
                            <div className={"d-flex justify-content-center"}>
                                <div className="spinner-border" role="status">
                                </div>
                            </div> :
                            <div className={"mt-5 w-100"}>
                                <NoDataComponent icon={faMinusCircle} color={"red"}
                                                 sentence={"First select room from schema"} iconSize={"4x"}/>
                            </div>}
                    </div>
            }
        </div>
    )
}