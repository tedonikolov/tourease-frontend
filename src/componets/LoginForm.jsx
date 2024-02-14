import "../styles/login.css"
import {Form, Modal, Spinner} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {Navigate} from "react-router-dom";
import {sendPasswordChangeEmail} from "../hooks/User";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";

export default function LoginForm({show, onHide}) {
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
            <Modal show={show} onHide={onHide} centered>
                {!changePassword ? <div className={"login-box"}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <h3>{t("Login into your account")}</h3>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {isError && <div className={"text-danger text-center mb-2"}>{t("wrongCredentials")}</div>}
                            <Form id={"login"} onSubmit={(event) => {
                                event.preventDefault();
                                sendLogin(userInfo);
                            }}>
                                <CommonInputText label={t("email")} name={"username"} type={"text"}
                                                 value={userInfo.username}
                                                 setObjectValue={setUserInfo}/>
                                <CommonInputText label={t("password")} name={"password"} type={"password"}
                                                 value={userInfo.password} setObjectValue={setUserInfo}/>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-between'>
                            <button form={"login"} className={"login-button"}>{t("login")}</button>
                            <button className={"password-button"}
                                    onClick={() => setChangePassword(true)}>{t("forgotPassword")}</button>
                            <button className={"close-button"} onClick={onHide}>{t("close")}</button>
                        </Modal.Footer>
                    </div>
                    :
                    <div className={"login-box"}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <h3>{t("forgotPassword")}</h3>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form id={"changePassword"} onSubmit={sendChangePassword}>
                                <CommonInputText label={t("email")} type={"text"}
                                                 value={email}
                                                 setValue={setEmail}/>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-between'>
                            {isPending ? <Spinner animation={'border'}/> : delay !== 0 ?
                                <div><h5>{t("Can resend it again after")}</h5> <h5
                                    className={"text-danger"}> {delay} </h5></div> :
                                <button form={"changePassword"} className={"login-button"}>{t("send")}</button>}
                            <button className={"close-button"}
                                    onClick={() => setChangePassword(false)}>{t("close")}</button>
                        </Modal.Footer>
                    </div>}
            </Modal>
            :
            <Navigate to={mainPage}/>
    )
}