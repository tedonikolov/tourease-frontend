import {useContext} from "react";
import { AuthContext } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

export default function AccessibilityCheckRoute ({ allowedRoles, isOpen }) {
    const { hasPermission } = useContext(AuthContext);
    if (isOpen) return <><Outlet/></>;
    return hasPermission(allowedRoles) ? (
        <>
            <Outlet />
        </>
    ) : (
        <></>
    );
};
