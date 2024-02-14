import {Button, Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {sendActivateEmail} from "../hooks/User";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";

export default function ActivateEmail({userInfo}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    let [delay, setDelay] = useState(0);

    const {mutate: sendEmail, isPending} = useMutation({
        mutationFn: sendActivateEmail,
        onSuccess: () => setDelay(() => 60)
    })

    useEffect(() => {
        if (delay !== 0) {
            const interval = setInterval(() => setDelay(() => delay - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [delay]);

    return (
        <div className={"register-box"}>
            <h3 className={"mt-3"}>{t("Activation email has been send!")}</h3>
            <h4 className={"mt-5"}>
                {t("Please click on sent link.")}<br/>
                {t("If you didn't receive email, click on resend it.")}
            </h4>
            {isPending ? <Spinner animation={'border'}/> : delay !== 0 ?
                <div><h5>{t("Can resend it again after")}</h5> <h5 className={"text-danger"}> {delay} </h5></div>
                : <Button onClick={()=>sendEmail(userInfo.email)} className={"register-button m-3"}>{t("resend")}</Button>}
        </div>
    )
}