import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import LoginForm from "./LoginForm";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export default function ActivateSuccessful (){
    const {t}=useTranslation("translation",{keyPrefix:"common"})
    const [show,setShow]=useState(false);
    const navigate = useNavigate();

    return (
        !show ? <div className={"register-box"}>
            <h3 className={"mt-3"}>{t("Profile has been activate successful")} <i className="bi bi-check-circle-fill text-success"/></h3>
            <Button onClick={()=>setShow(true)} className={"register-button m-3"}>{t("login")}</Button>
            </div>
            : <Modal show={show} onHide={() => navigate(`/`)} centered={true} size={"lg"}>
                <div className={"text-center login-box"}><LoginForm onHide={() => navigate(`/`)}/></div>
            </Modal>
    )
}