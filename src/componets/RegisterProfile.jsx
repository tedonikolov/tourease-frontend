import CommonInputText from "./CommonInputText";
import {Button, Form, Spinner} from "react-bootstrap";
import React from "react";
import "../styles/register.css"
import Select from "react-select";
import {createProfile} from "../hooks/User";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";

export default function RegisterProfile({userInfo, setUserInfo, nextStep}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    const types = [{value: 'REGULAR', label: t('Regular')},
        {value: 'OWNER', label: t('Hotel')}]

    const {mutate: create, isPending} = useMutation({
        mutationFn: createProfile,
        onSuccess: () => nextStep()
    })

    function register(event) {
        event.preventDefault();
        create(userInfo);
    }

    const disabled = userInfo.password !== userInfo.secondPassword;

    return (
        <div className={"register-box"}>
            <Form onSubmit={register} id={"register"} className={"mt-lg-5 mb-lg-3"}>
                <Select
                    onChange={(newValue) => {
                        setUserInfo((prevValue) => ({
                            ...prevValue,
                            userType: newValue.value
                        }));
                    }}
                    placeholder={'Choose role'}
                    defaultValue={types[0]}
                    options={types}
                    isSearchable={false}
                />
                <CommonInputText name={"email"} label={t("email")} value={userInfo.email} setObjectValue={setUserInfo}
                                 type={"email"}></CommonInputText>
                <CommonInputText name={"password"} label={t("password")} value={userInfo.password}
                                 setObjectValue={setUserInfo} type={"password"}></CommonInputText>
                <CommonInputText name={"secondPassword"} label={t("repeatPassword")} value={userInfo.secondPassword}
                                 setObjectValue={setUserInfo} type={"password"}></CommonInputText>
                <div className={"d-flex justify-content-end mx-5 mt-3"}>
                    {isPending ? <Spinner animation={'border'}/> :
                        <Button className={"register-button"} type={"submit"}
                                disabled={disabled}>{t("register")}</Button>}
                </div>
            </Form>
        </div>
    )
}