import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {ToastContainer} from "react-toastify";
import {Router} from "./routes/Routes";
import {BrowserRouter} from "react-router-dom";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./hooks/RestInterceptor";
import SideBarProvider from "./context/SideBarContext";
import {HotelProvider} from "./context/HotelContext";
import CurrencyProvider from "./context/CurrencyContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
            <AuthProvider>
                <HotelProvider>
                    <SideBarProvider>
                        <BrowserRouter>
                            <Router/>
                            <ToastContainer theme={"colored"}/>
                        </BrowserRouter>
                    </SideBarProvider>
                </HotelProvider>
            </AuthProvider>
        </CurrencyProvider>
    </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
