import {Nav} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import RequiredPermissions from "./RequiredPermissions";
import {Admin, Hotel, Regular} from "../utils/Role";
import {faBed, faCogs, faHistory, faHotel, faUser} from "@fortawesome/free-solid-svg-icons";
import NavLink from "./NavLink";
import Logo from ".././assets/Logo.ico"
import {AuthContext} from "../context/AuthContext";
import {useContext} from "react";

export default function Navigation () {
    const { mainPage } = useContext(AuthContext);
    const { t } = useTranslation('translation', { keyPrefix: 'common' });
    return (
        <Nav
            className='flex-column position-relative h-100 w-100 pt-2'
            role='tablist'
        >
            <NavLink
                path={mainPage}
                image={Logo}
                label='Main Page'
            />
            <div className='d-flex flex-column align-items-start'>
                <h6 className='px-4 pt-3 text-uppercase color-second'>{t('menu')}</h6>
                <RequiredPermissions requiredPermissions={[Regular]}>
                    <NavLink path='/regular/profile' label={t('profile')} icon={faUser} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Hotel]}>
                    <NavLink path='/hotel/profile' label={t('profile')} icon={faUser} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Hotel]}>
                    <NavLink path='/hotel/facilities' label={t('Facilities')} icon={faHotel} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Hotel]}>
                    <NavLink path='/hotel/beds' label={t('Beds')} icon={faBed} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Admin]}>
                    <NavLink path='/logs' label={t('logs')} icon={faHistory} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Admin]}>
                    <NavLink path='/swagger' label={t('Swagger')} icon={faCogs}/>
                </RequiredPermissions>
            </div>
        </Nav>
    );
};