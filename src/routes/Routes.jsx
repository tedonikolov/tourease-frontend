import {Route, Routes, useNavigate} from 'react-router-dom';
import React from "react";
import RegisterPage from "../pages/RegisterPage";
import AccessibilityCheckRoute from "./AccessibilityCheckRoute";
import LoginForm from "../componets/LoginForm";
import LandingPage from "../pages/LandingPage";
import RegularProfilePage from "../pages/RegularProfilePage";
import {PrivateRoute} from "./PrivateRoute";
import NotExist from "../pages/NotExistPage";
import PasswordChangePage from "../pages/PasswordChangePage";
import LogsPage from "../pages/LogsPage";
import Swagger from "../pages/Swagger";
import OwnerProfilePage from "../pages/OwnerProfilePage";
import FacilitiesPage from "../pages/FacilitiesPage";

export const Router = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route
                path='/'
                element={<AccessibilityCheckRoute isOpen={true}/>}
            >
                <Route path='/' element={<LandingPage/>}/>
                <Route path={'/login'} element={<LoginForm show={true} onHide={()=>navigate(`/`)}/>}/>
                <Route path='/register' element={<RegisterPage step={1}/>}/>
                <Route path='/changePassword' element={<PasswordChangePage step={1}/>}/>
                <Route path='/activateProfile' element={<RegisterPage activateProfile={true} step={3}/>}/>
                <Route path='/:error' element={<NotExist/>}/>
            </Route>
            <Route path='/' element={<PrivateRoute/>}>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={['REGULAR']}/>}
                >
                    <Route path={'/'} element={<RegularProfilePage/>}/>
                    <Route path={'/regular/profile'} element={<RegularProfilePage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={['HOTEL']}/>}
                >
                    <Route path={'/'} element={<OwnerProfilePage/>}/>
                    <Route path={'/hotel/profile'} element={<OwnerProfilePage/>}/>
                    <Route path={'/hotel/facilities'} element={<FacilitiesPage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={['ADMIN']}/>}
                >
                    <Route path={'/logs'} element={<LogsPage/>}/>
                    <Route path={'/swagger'} element={<Swagger/>}/>
                </Route>
            </Route>
        </Routes>
);
};
