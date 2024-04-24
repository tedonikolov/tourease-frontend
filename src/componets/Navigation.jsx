import {Nav} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import RequiredPermissions from "./RequiredPermissions";
import {Admin, Manager, Owner, Receptionist, Regular} from "../utils/Role";
import {
    faAppleAlt,
    faBed, faClipboardList,
    faCogs, faGripHorizontal,
    faHistory,
    faHotel, faHouseUser,
    faKey,
    faUser, faUsers
} from "@fortawesome/free-solid-svg-icons";
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
                <RequiredPermissions requiredPermissions={[Owner]}>
                    <NavLink path='/hotel/profile' label={t('profile')} icon={faUser} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Manager]}>
                    <NavLink path='/hotel' label={t('HotelInfo')} icon={faUser} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Manager, Receptionist]}>
                    <NavLink path='/hotel/scheme' label={t('Scheme')} icon={faGripHorizontal} />
                    <NavLink path='/hotel/reservations' label={t('reservations')} icon={faClipboardList} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Owner, Manager]}>
                    <NavLink path='/hotel/facilities' label={t('Facilities')} icon={faHotel} />
                    <NavLink path='/hotel/meals' label={t('Meals')} icon={faAppleAlt} />
                    <NavLink path='/hotel/beds' label={t('Beds')} icon={faBed} />
                    <NavLink path='/hotel/types' label={t('Types')} icon={faKey} />
                    <NavLink path='/hotel/rooms' label={t('Rooms')} icon={faHouseUser} />
                    <NavLink path='/hotel/workers' label={t('workers')} icon={faUsers} />
                </RequiredPermissions>
                <RequiredPermissions requiredPermissions={[Admin]}>
                    <NavLink path='/logs' label={t('logs')} icon={faHistory} />
                    <NavLink path='/configurations' label={t('Configurations')} icon={faCogs}/>
                    <NavLink path='/swagger' label={t('Swagger')} icon={faCogs}/>
                </RequiredPermissions>
            </div>
        </Nav>
    );
};