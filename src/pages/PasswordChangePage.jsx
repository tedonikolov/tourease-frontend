import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "../componets/CommonInputText";
import {sendChangePassword} from "../hooks/User";
import {Navigate, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import LoginForm from "../componets/LoginForm";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";

export default function PasswordChangePage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    const [userInfo, setUserInfo] = useState({email: '', password: '', secondPassword: ''});
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const email = url.searchParams.get('email');
        setUserInfo({...userInfo, email: email})
        setLoading(false)
    }, []);

    const {mutate: changePassword, isSuccess} = useMutation({
        mutationFn: sendChangePassword,
        onError: () => toast.error(<CustomToastContent translated content={["Couldn't change password!"]}/>)
    })

    const disabled = userInfo.password !== userInfo.secondPassword || userInfo.password === '' || userInfo.secondPassword === '';

    return (
        !loading && (userInfo.email !== "" ?
            <div className={"mt-lg-5 w-100 register d-flex row justify-content-center text-center"}>
                <h2>{t("changePassword")}</h2>
                <div className={"register-box"}>
                    {!isSuccess ? <Form onSubmit={(event) => {
                        event.preventDefault();
                        changePassword(userInfo);
                    }} id={"changePassword"} className={"mt-lg-5 mb-lg-3"}>
                        <CommonInputText name={"password"} label={t("password")} value={userInfo.password}
                                         setObjectValue={setUserInfo} type={"password"}></CommonInputText>
                        <CommonInputText name={"secondPassword"} label={t("repeatPassword")}
                                         value={userInfo.secondPassword}
                                         setObjectValue={setUserInfo} type={"password"}></CommonInputText>
                        <div className={"d-flex justify-content-end mx-5 mt-3"}>
                            <Button className={"register-button"} type={"submit"}
                                    disabled={disabled}>{t("update")}</Button>
                        </div>
                    </Form> : <div>
                        <h4>{t("Password has been changed! You can log in now.")}</h4>
                        <Button className={"login-button"} onClick={() => setShow(true)}>{t("login")}</Button>
                        <LoginForm show={show} onHide={() => navigate(`/`)}/>
                    </div>}
                </div>
            </div>
            :
            <Navigate to={"/error"}/>)
    )
}