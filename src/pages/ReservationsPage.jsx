import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import FreeRoomsInfo from "../componets/FreeRoomsInfo";
import Reservations from "../componets/Reservations";

export default function ReservationsPage(){
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {sideBarVisible} = useContext(SideBarContext);

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Reservations")}/>
                <FreeRoomsInfo/>
                <Reservations/>
            </div>
        </div>
    )
}