import React, {useContext, useState} from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import Header from "../componets/Header";
import CustomSelect from "../componets/CustomSelect";
import Navigation from "../componets/Navigation";
import SideBar from "../componets/SideBar";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";

const Swagger = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'common' });
    const { sideBarVisible } = useContext(SideBarContext);

    const [serviceName, setServiceName] = useState("user-service");
    const options = [{label: "user-service", value: "user-service"},
        {label: "logger-service", value: "logger-service"},
        {label: "hotel-service", value: "hotel-service"},
        {label: "config-service", value: "configuration-service"}
    ]

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page w-100'>
                <Header title={t("Swagger")}/>
                <div className={"d-flex m-4 text-nowrap justify-content-start align-items-center"}>
                    <label className={"m-2"}>Choose service</label>
                    <CustomSelect options={options} label={"service"} defaultValue={serviceName}
                                  setValue={setServiceName}/>
                </div>
                <SwaggerUI
                    url={`http://localhost:9000/${serviceName}/swagger`}
                    requestInterceptor={req => {
                        req.headers["Authorization"] = `Bearer ${sessionStorage.getItem('token')}`
                    }}
                />
            </div>
        </div>
    );
};

export default Swagger;