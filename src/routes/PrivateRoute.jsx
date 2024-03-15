import React, {useContext} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

export const PrivateRoute = () => {
    const {token, permission} = useContext(AuthContext);

    if (!token && !permission) {
        return <Navigate to=''/>;
    }
    return <Outlet/>;
};
