import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import ChangeLanguageComponent from "./ChangeLanguageComponent";
import {useTranslation} from "react-i18next";

export default function Header() {
    const {logout, loggedUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const {t}=useTranslation("translation",{keyPrefix:"common"})

    return (
        <div
            className='shadow d-flex flex-wrap justify-content-end align-items-center w-100 ps-4 pe-2 py-2 bg-white border-bottom '>
            <div className='d-flex align-items-center w-25'>
                <ChangeLanguageComponent/>

                <h5 className='mb-0 px-2 w-50 text-end'>
                    {t("welcome")}, {loggedUser.regular ? loggedUser.regular.firstName : loggedUser.email}!
                </h5>

                <Button
                    variant='outline-primary color-main'
                    size='sm'
                    onClick={() => {
                        logout();
                        navigate('/login', {replace: true});
                    }}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className='fa-fw' rotation={180}/>
                </Button>
            </div>
        </div>
    );
}