import CommonInputText from "./CommonInputText";
import CustomSelect from "./CustomSelect";
import {ReservationStatus} from "../utils/enums";
import React from "react";
import {useTranslation} from "react-i18next";
import CustomDatePicker from "./CustomDatePicker";

export default function ReservationsFilter({reservationsFilter, setReservationsFilter, hotels}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});

    return (
        <div className={"d-flex justify-content-center"}>
            <div className={"justify-content-center"}>
                <CommonInputText name={'reservationNumber'} value={reservationsFilter.reservationNumber} setObjectValue={setReservationsFilter}
                    type={"number"} label={t("reservationNumber")}/>
                <CustomDatePicker label={t('CreationDate')} selectedDate={reservationsFilter.creationDate}
                                  name={'creationDate'} setValue={setReservationsFilter}/>
                <CustomDatePicker label={t('checkIn')} selectedDate={reservationsFilter.checkIn}
                                  name={'checkIn'} setValue={setReservationsFilter}/>
                <div className={"w-50 align-self-center"}><CustomSelect
                    options={ReservationStatus.map((name) => ({label: t(name), value: name}))} name={"status"}
                    label={t("status")} setObjectValue={setReservationsFilter} defaultValue={reservationsFilter.status} isClearable={true}/></div>
                <div className={"w-100 align-self-center"}><CustomSelect
                    options={hotels.map((name) => ({label: name, value: name}))} name={"hotel"}
                    label={t("Hotel")} setObjectValue={setReservationsFilter} defaultValue={reservationsFilter.hotel} isClearable={true}/></div>
            </div>
        </div>
    )
}