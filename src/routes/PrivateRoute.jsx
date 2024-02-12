import React, {useContext} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

export const PrivateRoute = () => {
    const {token, permissions, setLocation} = useContext(AuthContext);

    const location = useLocation();

    if (!token && !permissions) {
        setLocation(location);
        return <Navigate to='/login'/>;
    }
    return <Outlet/>;
};
