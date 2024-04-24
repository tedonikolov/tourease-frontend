import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import FreeRoomsInfo from "../componets/FreeRoomsInfo";
import Reservations from "../componets/Reservations";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import dayjs from "dayjs";
import {AuthContext} from "../context/AuthContext";
import {Manager} from "../utils/Role";

export default function ReservationsPage() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {permission} = useContext(AuthContext);
    const {sideBarVisible} = useContext(SideBarContext);
    const [filter, setFilter] = useState({
        fromDate: dayjs(new Date()).format('YYYY-MM-DD'),
        toDate: dayjs(new Date()).add(8, 'day').format('YYYY-MM-DD'),
        hotelId: null
    });

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Reservations")}/>
                <FreeRoomsInfo filter={filter} setFilter={setFilter}/>
                <div className={"w-100 mt-4"}>
                    <StepWizard
                        className=''
                        nav={<CustomStepWizardNav steps={[
                            t('Confirm reservations'),
                            permission === Manager ? t('Pending reservations') : null,
                            permission === Manager ? t('Cancelled reservations') : null,
                            t('Ending reservations')
                        ].filter(Boolean)}/>}
                        transitions={{
                            enterRight: '',
                            enterLeft: '',
                            exitRight: '',
                            exitLeft: '',
                        }}
                    >
                        <Reservations status={"CONFIRMED"} fromDate={filter.fromDate} toDate={filter.toDate}/>
                        {permission===Manager && <Reservations status={"PENDING"} fromDate={filter.fromDate} toDate={filter.toDate}/>}
                        {permission===Manager && <Reservations status={"CANCELLED"} fromDate={filter.fromDate} toDate={filter.toDate}/>}
                        <Reservations status={"ENDING"} fromDate={filter.fromDate} toDate={filter.toDate}/>
                    </StepWizard>
                </div>
            </div>
        </div>
    )
}