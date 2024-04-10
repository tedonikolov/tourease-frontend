import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import {HotelContext} from "../context/HotelContext";
import Rooms from "../componets/Rooms";
import CustomDatePicker from "../componets/CustomDatePicker";
import {useQuery} from "@tanstack/react-query";
import {getAllReservationsViewByHotel} from "../hooks/hotel";
import dayjs from "dayjs";
import {Button} from "react-bootstrap";

export default function HotelSchemePage() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {sideBarVisible} = useContext(SideBarContext);
    const {workerHotel} = useContext(HotelContext);
    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState({date:dayjs(new Date()).format('YYYY-MM-DD'), hotelId: null});

    useEffect(() => {
        if (workerHotel) {
            setFilter((prevValue) => ({
                ...prevValue,
                hotelId: workerHotel.id
            }))
            setRooms(() => workerHotel.rooms)
        }
    }, [workerHotel]);

    const {data} = useQuery({
        queryKey: ["get all reservations view by hotel", filter],
        queryFn: () => getAllReservationsViewByHotel(filter),
        enabled: filter.hotelId != null
    })
    useEffect(() => {
        if (data) {
            let newRooms = workerHotel.rooms.map(room => {
                return {...room, reservationStatus: 'FREE'}
            })
            data.forEach(reservation => {
                newRooms = newRooms.map(room => {
                        return reservation.roomId === room.id ?
                            {...room, reservationStatus: reservation.status}
                            : room
                    }
                )
            })
            setRooms(newRooms)
        }
    }, [data, workerHotel])

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Scheme")}/>
                <div className={"d-flex align-self-center"}><CustomDatePicker label={t('date')}
                                                                              selectedDate={filter.date}
                                                                              name={'date'}
                                                                              setValue={setFilter}/>
                <div className={"d-flex align-self-end h-50"}><Button className={"register-button"} onClick={() => setFilter((prevValue) => ({
                    ...prevValue,
                    date: dayjs(new Date()).format('YYYY-MM-DD')
                }))}>{t("Today")}</Button></div>
                </div>
                <div className={"d-flex align-self-center align-items-center mt-3"}>
                    <label className={"p-2"}>{t("Legend")+":"}</label>
                    <ul className={"list-group list-group-horizontal"}>
                        <li className={"list-group-item info"}>{t("FREE")}</li>
                        <li className={"list-group-item success"}>{t("RESERVED")}</li>
                        <li className={"list-group-item warning"}>{t("ACCOMMODATED")}</li>
                        <li className={"list-group-item danger"}>{t("END")}</li>
                    </ul>
                </div>
                <div className={"d-flex align-self-center align-items-center mb-3"}>
                    <label className={"p-2"}>{t("Press")}<b> F2 </b>{t("for change status of room")}</label>
                </div>
                {workerHotel && <Rooms rooms={rooms} filter={filter}/>}
            </div>
        </div>
    )
}