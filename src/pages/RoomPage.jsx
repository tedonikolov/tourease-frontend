import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import {HotelContext} from "../context/HotelContext";
import {useQuery} from "@tanstack/react-query";
import {getReservationForRoom, getRoomById} from "../hooks/hotel";
import NoDataComponent from "../componets/NoDataComponent";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import RoomInfo from "../componets/RoomInfo";
import CustomDatePicker from "../componets/CustomDatePicker";
import {Button, Modal} from "react-bootstrap";
import dayjs from "dayjs";
import {defaultReservation} from "../utils/defaultValues";
import ReservationInfo from "../componets/ReservationInfo";

export default function RoomPage() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {sideBarVisible} = useContext(SideBarContext);
    const {roomId, date} = useContext(HotelContext);
    const [filter, setFilter] = useState(null);
    const [newCustomer, setNewCustomer] = useState(false);
    const [show,setsShow]=useState(false);

    useEffect(() => {
        if (roomId && date) {
            setFilter(() => ({
                date: date,
                roomId: roomId
            }))
        }
    }, [roomId, date]);

    const {data: room} = useQuery(
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
            enabled: filter != null,
            retry: false,
            staleTime: 5000
        }
    )

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
                            <div className={"d-flex align-self-end mx-4"}>
                                <Button className={"register-button"}
                                        onClick={() => setsShow(true)}>
                                    {data && data.reservation ? t("Change reservation") : t("New reservation")}</Button>
                            </div>
                            <div className={"d-flex align-self-end mx-4"}>
                                <Button className={"register-button"}
                                        onClick={() => setNewCustomer(true)}>
                                    {t("Add customer")}</Button>
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
                        </div>}
                        <RoomInfo data={data} newCustomer={newCustomer} setNewCustomer={setNewCustomer} filter={filter}/>
                        <Modal show={show} onHide={() => {setsShow(false)}} size={"xl"}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t("Reservation")}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ReservationInfo reservation={data && data.reservation ? data.reservation : defaultReservation} filter={filter}/>
                            </Modal.Body>
                        </Modal>
                    </div>
                    :
                    <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                        <Header title={t("Room")}/>
                        <div className={"mt-5 w-100"}>
                            <NoDataComponent icon={faMinusCircle} color={"red"}
                                             sentence={"First select room from schema"} iconSize={"4x"}/>
                        </div>
                    </div>
            }
        </div>
    )
}