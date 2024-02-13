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
import {Suspense} from 'react';
import {Spinner} from 'react-bootstrap';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
            <BrowserRouter>
                <Suspense fallback={<Spinner animation='border'/>}>
                    <Router/>
                </Suspense>
                <ToastContainer theme={"colored"}/>
            </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
