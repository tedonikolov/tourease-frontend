import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getConfigurations, saveConfigurations} from "../hooks/configurations";
import CommonInputText from "../componets/CommonInputText";
import {Button, Form} from "react-bootstrap";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";

export default function ConfigurationsPage() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {sideBarVisible} = useContext(SideBarContext);
    const [configurations, setConfigurations] = useState();

    const {data, isSuccess} = useQuery({
        queryKey: ["get configurations"],
        queryFn: getConfigurations
    })

    const {mutate} = useMutation({
        mutationFn: saveConfigurations,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
        }
    })

    useEffect(() => {
        if (isSuccess) {
            let configs = []
            Object.entries(data).map((config) => {
                Object.entries(Object.entries(config).map(([name, configuration]) => {
                    return name, configuration
                })[1]).forEach((value) => configs.push({name: value[0], value: value[1]}))
            });
            setConfigurations(() => configs)
        }
    }, [isSuccess, data]);

    function handleInput(event, name) {
        setConfigurations(() => configurations.map((config) => config.name === name ? {
            name: config.name,
            value: event.target.value
        } : config));
    }

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Configurations")}/>
                {configurations &&
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        mutate(configurations)
                    }}>
                        <div className={"box center p-4"}>
                            {configurations.map((config, index) => {
                                return (
                                    <div key={index}>
                                        <CommonInputText
                                            value={config.value}
                                            type='text'
                                            label={t(config.name)}
                                            handleInput={(event) => handleInput(event, config.name)}
                                        />
                                    </div>
                                );
                            })}
                            <Button className={"register-button mt-3"} type={"submit"}>{t("save")}</Button>
                        </div>
                    </Form>
                }
            </div>

        </div>
    )
}