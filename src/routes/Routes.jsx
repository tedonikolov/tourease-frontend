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
import HotelSchemePage from "../pages/HotelSchemePage";
import RoomPage from "../pages/RoomPage";
import ReservationsPage from "../pages/ReservationsPage";
import MealsPage from "../pages/MealsPage";
import HotelPage from "../pages/HotelPage";
import {Admin, Manager, Owner, Receptionist, Regular} from "../utils/Role";
import MainRegularPage from "../pages/MainRegularPage";

export const Router = () => {
    return (
        <Routes>
            <Route
                path='/'
                element={<AccessibilityCheckRoute isOpen={true}/>}
            >
                <Route path='/' element={<MainRegularPage/>}/>
                <Route path='/login' element={<LandingPage/>}/>
                <Route path='/register' element={<RegisterPage step={1}/>}/>
                <Route path='/changePassword/*' element={<PasswordChangePage step={1}/>}/>
                <Route path='/activateProfile/*' element={<RegisterPage activateProfile={true} step={3}/>}/>
                <Route path='/:error' element={<NotExist/>}/>
            </Route>
            <Route path='/' element={<PrivateRoute/>}>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={[Regular]}/>}
                >
                    <Route path={'/'} element={<MainRegularPage/>}/>
                    <Route path={'/regular/profile'} element={<RegularProfilePage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={[Owner, Manager]}/>}
                >
                    <Route path={'/hotel/facilities'} element={<FacilitiesPage/>}/>
                    <Route path={'/hotel/meals'} element={<MealsPage/>}/>
                    <Route path={'/hotel/beds'} element={<BedsPage/>}/>
                    <Route path={'/hotel/types'} element={<TypesPage/>}/>
                    <Route path={'/hotel/rooms'} element={<RoomsPage/>}/>
                    <Route path={'/hotel/workers'} element={<WorkersPage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={[Owner]}/>}
                >
                    <Route path={'/'} element={<OwnerProfilePage/>}/>
                    <Route path={'/hotel/profile'} element={<OwnerProfilePage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={[Manager, Receptionist]}/>}
                >
                    <Route path={'/'} element={<HotelSchemePage/>}/>
                    <Route path={'/hotel/scheme'} element={<HotelSchemePage/>}/>
                    <Route path={'/hotel/reservations'} element={<ReservationsPage/>}/>
                    <Route path={'/hotel/room/*'} element={<RoomPage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={[Manager]}/>}
                >
                    <Route path={'/hotel'} element={<HotelPage/>}/>
                </Route>
                <Route
                    path={'/'}
                    element={<AccessibilityCheckRoute allowedRoles={[Admin]}/>}
                >
                    <Route path={'/logs'} element={<LogsPage/>}/>
                    <Route path={'/swagger'} element={<Swagger/>}/>
                    <Route path={'/configurations'} element={<ConfigurationsPage/>}/>
                </Route>
            </Route>
        </Routes>
);
};
