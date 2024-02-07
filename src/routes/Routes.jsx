import {Route, Routes} from 'react-router-dom';
import React from "react";
import RegisterPage from "../pages/RegisterPage";
import AccessibilityCheckRoute from "./AccessibilityCheckRoute";
import LoginForm from "../componets/LoginForm";
import LandingPage from "../pages/LandingPage";

export const Router = () => {
    return (
        <Routes>
            <Route
                path='/'
                element={<AccessibilityCheckRoute isOpen={true}/>}
            >
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/register' element={<RegisterPage step={1}/>}/>
                <Route path='/activateProfile' element={<RegisterPage activateProfile={true} step={3}/>}/>
            </Route>
            <Route path={'/login'} element={<LoginForm show={true} />}/>
        </Routes>
    );
};
