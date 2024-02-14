import React from 'react';
import '../styles/error.css';
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export default function NotExist() {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    return (
        <div className='error-page '>
            <h1>{t("pageDontExist")}</h1>
            <Button className='register-button' href='/'>{t("homePage")}</Button>
        </div>
    );
};