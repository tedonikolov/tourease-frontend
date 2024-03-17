import {Route, Routes} from 'react-router-dom';
import React from "react";
import RegisterPage from "../pages/RegisterPage";
import AccessibilityCheckRoute from "./AccessibilityCheckRoute";
import LandingPage from "../pages/LandingPage";
import RegularProfilePage from "../pages/RegularProfilePage";
import {PrivateRoute} from "./PrivateRoute";
import NotExist from "../pages/NotExistPage";
import PasswordChangePage from "../pages/PasswordChangePage";
import LogsPage from "../pages/LogsPage";
import Swagger from "../pages/Swagger";
import OwnerProfilePage from "../pages/OwnerProfilePage";
import FacilitiesPage from "../pages/FacilitiesPage";
import BedsPage from "../pages/BedsPage";
import TypesPage from "../pages/TypesPage";
import RoomsPage from "../pages/RoomsPage";
import ConfigurationsPage from "../pages/ConfigurationsPage";
import WorkersPage from "../pages/WorkersPage";

export const Router = () => {
    return (
        <Routes>
            <Route
                path='/'
                element={<AccessibilityCheckRoute isOpen={true}/>}
            >
                <Route path='/' element={<LandingPage/>}/>
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
                    <Route path={'/hotel/beds'} element={<BedsPage/>}/>
                    <Route path={'/hotel/types'} element={<TypesPage/>}/>
                    <Route path={'/hotel/rooms'} element={<RoomsPage/>}/>
                    <Route path={'/hotel/workers'} element={<WorkersPage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={['ADMIN']}/>}
                >
                    <Route path={'/logs'} element={<LogsPage/>}/>
                    <Route path={'/swagger'} element={<Swagger/>}/>
                    <Route path={'/configurations'} element={<ConfigurationsPage/>}/>
                </Route>
            </Route>
        </Routes>
);
};
