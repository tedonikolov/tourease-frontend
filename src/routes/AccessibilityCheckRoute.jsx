import React, {useContext} from "react";
import { AuthContext } from '../context/AuthContext';
import {Navigate, Outlet} from 'react-router-dom';

export default function AccessibilityCheckRoute ({ allowedRoles, isOpen }) {
    const { hasPermission, mainPage } = useContext(AuthContext);

    if (isOpen) return <><Outlet/></>;
    return hasPermission(allowedRoles) ? (
        <>
            <Outlet />
        </>
    ) : (
        mainPage && <Navigate to={mainPage}/>
    );
};
