import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {changeWorkingPeriod} from "../hooks/hotel";
import {useMutation} from "@tanstack/react-query";
import CustomToastContent from "./CustomToastContent";
import {toast} from "react-toastify";
import {queryClient} from "../hooks/RestInterceptor";
import {AuthContext} from "../context/AuthContext";
import CustomDatePicker from "./CustomDatePicker";
import dayjs from "dayjs";
import {Button} from "react-bootstrap";

export default function HotelWorkingPeriod({hotel}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const [workingPeriod, setWorkingPeriod] = useState();
    const {loggedUser} = useContext(AuthContext);

    useEffect(() => {
        if (hotel) {
            setWorkingPeriod(() => {
                return {
                    hotelId: hotel.id,
                    openingDate: hotel.openingDate,
                    closingDate: hotel.closingDate
                }
            });
        }
    }, [hotel]);

    const {mutate} = useMutation({
        mutationFn: () => changeWorkingPeriod(workingPeriod),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get worker", loggedUser && loggedUser.email]});
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
        }
    });

    const disabled = !workingPeriod || !workingPeriod.openingDate || !workingPeriod.closingDate ||
        workingPeriod.closingDate === 'Invalid Date' || workingPeriod.openingDate === 'Invalid Date' ||
        dayjs(workingPeriod.openingDate).isAfter(workingPeriod.closingDate);

    return (
        workingPeriod && <div className={"d-flex justify-content-center"}>
            <div className={"d-flex"}>
                <CustomDatePicker label={t('openingDate')}
                                  selectedDate={workingPeriod.openingDate}
                                  name={'openingDate'}
                                  setValue={setWorkingPeriod}
                />
                <CustomDatePicker label={t('closingDate')}
                                  selectedDate={workingPeriod.closingDate}
                                  name={'closingDate'}
                                  setValue={setWorkingPeriod}
                />
            </div>
            <div className={"align-self-end"}>
                <Button className={'register-button'}
                        disabled={disabled} onClick={mutate}>
                    {t("save")}</Button>
            </div>
        </div>
    )
}