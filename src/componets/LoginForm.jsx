import "../styles/login.css"
import {Button, Form, Spinner} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {Navigate} from "react-router-dom";
import {sendPasswordChangeEmail} from "../hooks/User";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";
import ChangeLanguageComponent from "./ChangeLanguageComponent";

export default function LoginForm({onHide}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    const [userInfo, setUserInfo] = useState({username: "", password: ""})
    const {login, mainPage, loggedUser} = useContext(AuthContext);

    const [changePassword, setChangePassword] = useState(false);
    const [email, setEmail] = useState("");
    let [delay, setDelay] = useState(0);

    const {mutate: sendLogin, isError} = useMutation({
        mutationFn: login
    });

    const {mutate: sendPasswordLink, isPending} = useMutation({
        mutationFn: sendPasswordChangeEmail,
        onSuccess: () => toast.success(<CustomToastContent content={[t("successEmailSend")]}/>)
    });

    function sendChangePassword(event) {
        event.preventDefault();
        sendPasswordLink(email);
        setDelay(() => 60);
    }

    useEffect(() => {
        if (delay !== 0) {
            const interval = setInterval(() => setDelay(() => delay - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [delay]);

    return (
        !loggedUser ?
            !changePassword ? <div>
                    <div>
                        <div className={"d-flex text-end text-nowrap justify-content-center align-items-start"}>
                            <h3>{t("Login into your account")}</h3>
                            <div className={"d-flex justify-content-end"}><ChangeLanguageComponent/></div>
                        </div>
                        {isError && <div className={"text-danger text-center mb-2"}>{t("wrongCredentials")}</div>}
                        <Form id={"login"} onSubmit={(event) => {
                            event.preventDefault();
                            sendLogin(userInfo);
                        }}>
                            <div className={"px-5 mx-5"}><CommonInputText label={t("email")} name={"username"} type={"text"}
                                                                          value={userInfo.username}
                                                                          setObjectValue={setUserInfo}/></div>
                            <div className={"px-5 mx-5"}><CommonInputText label={t("password")} name={"password"}
                                                                          type={"password"}
                                                                          value={userInfo.password}
                                                                          setObjectValue={setUserInfo}/></div>
                        </Form>
                    </div>
                    <div className='border-black border-top border-2 mt-3 mb-3'></div>
                    <div className='d-flex justify-content-between'>
                        <Button form={"login"} type={"submit"} className={"login-button"}>{t("login")}</Button>
                        <Button className={"password-button"}
                                onClick={() => setChangePassword(true)}>{t("forgotPassword")}</Button>
                        <Button className={"close-button"} onClick={onHide}>{t("back")}</Button>
                    </div>
                </div>
                :
                <div>
                    <h3>{t("forgotPassword")}</h3>
                    <Form id={"changePassword"} onSubmit={sendChangePassword}>
                        <CommonInputText label={t("email")} type={"text"}
                                         value={email}
                                         setValue={setEmail}/>
                    </Form>
                    <div className='border-black border-top border-2 mt-3 mb-3'></div>
                    <div className='d-flex justify-content-between text-nowrap'>
                        {isPending ? <Spinner animation={'border'}/> : delay !== 0 ?
                            <div className={"text-start"}><h5>{t("Can resend it again after")}</h5> <h5
                                className={"text-danger"}> {delay} </h5></div> :
                            <Button type={"submit"} form={"changePassword"} className={"login-button"}>{t("send")}</Button>}
                        <div><Button className={"close-button"}
                                     onClick={() => setChangePassword(false)}>{t("back")}</Button></div>
                    </div>
                </div>
            :
            <Navigate to={mainPage}/>
    )
}