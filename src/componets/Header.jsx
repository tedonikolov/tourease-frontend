import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import ChangeLanguageComponent from "./ChangeLanguageComponent";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import ChangeCurrencyComponent from "./ChangeCurrencyComponent";

export default function Header({title}) {
    const {logout, loggedUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const {t}=useTranslation("translation",{keyPrefix:"common"})
    const { sideBarVisible, setSideBarVisible } = useContext(SideBarContext);

    function sliceUsername(username){
        return username.length > 10 ? `${username.slice(0, 10)}..` : username
    }

    return (
        <div
            className='shadow d-flex align-items-center w-100 ps-4 pe-2 py-2 bg-white border-bottom '>
            <div className='d-flex w-100'>
                {!sideBarVisible && (
                    <Button
                        onClick={() => {
                            setSideBarVisible(true);
                        }}
                        className='bg-secondary me-2'
                        size='sm'
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                )}

                <h2 className='ps-2 mb-0'>{title}</h2>
            </div>
            <div className='d-flex w-55 align-items-center'>
                <ChangeCurrencyComponent/>
                <ChangeLanguageComponent/>

                {loggedUser && <h5 className='mb-0 px-2 w-50 text-end'>
                    {t("welcome")}, {sliceUsername(loggedUser.regular ? loggedUser.regular.firstName : loggedUser.email)}!
                </h5>}

                {loggedUser && <Button
                    variant='outline-primary color-main'
                    size='sm'
                    onClick={() => {
                        logout();
                        navigate('/', {replace: true});
                    }}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className='fa-fw' rotation={180}/>
                </Button>}
            </div>
        </div>
    );
}