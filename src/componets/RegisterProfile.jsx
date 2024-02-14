import CommonInputText from "./CommonInputText";
import {Button, Form, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import "../styles/register.css"
import Select from "react-select";
import {createProfile} from "../hooks/User";
import {useTranslation} from "react-i18next";

export default function RegisterProfile({userInfo, setUserInfo, nextStep}) {
    const {t}=useTranslation("translation",{keyPrefix:"common"})
    const [isLoading, setIsLoading] = useState(false);

    const types = [{value: 'REGULAR', label: t('Regular')},
        {value: 'HOTEL', label: t('Hotel')},
        {value: 'TRANSPORT', label: t('Transport')}]

    async function register(event) {
        event.preventDefault();
        setIsLoading(()=>true);
        let response = await createProfile(userInfo);
        if(!response)
            nextStep();
        setIsLoading(()=>false);
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
                    {isLoading ? <Spinner animation={'border'}/> :
                        <Button className={"register-button"} type={"submit"} disabled={disabled}>{t("register")}</Button>}
                </div>
            </Form>
        </div>
    )
}