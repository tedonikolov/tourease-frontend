import CommonInputText from "./CommonInputText";
import {Button, Form, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import "../styles/register.css"
import Select from "react-select";
import {createProfile} from "../hooks/User";

export default function RegisterProfile({userInfo, setUserInfo}) {
    const [isLoading, setIsLoading] = useState(false);

    const types = [{value: 'REGULAR', label: 'Regular'},
        {value: 'HOTEL', label: 'Hotel'},
        {value: 'TRANSPORT', label: 'Transport'}]

    async function register(event) {
        event.preventDefault();
        setIsLoading(()=>true);
        await createProfile(userInfo);
        setIsLoading(()=>false);
    }

    function disable() {
        return userInfo.password !== userInfo.secondPassword;
    }

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
                <CommonInputText name={"email"} label={"Email:"} value={userInfo.email} setValue={setUserInfo}
                                 type={"email"}></CommonInputText>
                <CommonInputText name={"password"} label={"Password:"} value={userInfo.password}
                                 setValue={setUserInfo} type={"password"}></CommonInputText>
                <CommonInputText name={"secondPassword"} label={"Repeat password:"} value={userInfo.secondPassword}
                                 setValue={setUserInfo} type={"password"}></CommonInputText>
                <div className={"d-flex justify-content-end mx-5 mt-3"}>
                    {isLoading ? <Spinner animation={'border'}/> :
                        <Button className={"register-button"} type={"submit"} disabled={disable()}>Register</Button>}              </div>
            </Form>
        </div>
    )
}