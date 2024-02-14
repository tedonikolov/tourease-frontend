import {Button} from "react-bootstrap";
import {useContext, useState} from "react";
import LoginForm from "../componets/LoginForm";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useTranslation} from "react-i18next";
import ChangeLanguageComponent from "../componets/ChangeLanguageComponent";

export default function LandingPage() {
    const {t}=useTranslation("translation",{keyPrefix:"common"})

    const [toggleLogin, setToggleLogin] = useState(false)
    const [registerPage, setRegisterPage] = useState(false);
    const {mainPage, loggedUser} = useContext(AuthContext);

    return (
         !loggedUser ?
            toggleLogin ?
                <LoginForm show={toggleLogin} onHide={() => setToggleLogin(false)}/>
                :
                <div className={'overlay'}>
                    <div className={'login-box text-center'}>
                        <div className={"d-flex justify-content-end"}><ChangeLanguageComponent/></div>
                        <h2>{t("Welcome to TourEase")}</h2>
                        <h3>{t("In order to use the platform, you need to have profile")}</h3>
                        <Button className={'login-button m-2'} onClick={() => setToggleLogin(true)}>{t("login")}</Button>
                        <Button className={'register-button'} onClick={() => setRegisterPage(true)}>{t("Create profile")}</Button>
                    </div>
                    {registerPage && <Navigate to={'/register'}/>}
                </div>
            :
            <Navigate to={mainPage}/>
    )
}