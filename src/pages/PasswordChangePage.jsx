import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "../componets/CommonInputText";
import {sendChangePassword} from "../hooks/User";
import {Navigate, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import LoginForm from "../componets/LoginForm";

export default function PasswordChangePage() {
    const [userInfo, setUserInfo] = useState({email: '', password: '', secondPassword: ''});
    const [loading, setLoading] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const email = url.searchParams.get('email');
        setUserInfo({...userInfo, email: email})
        setLoading(false)
    }, []);

    async function changePassword(event) {
        event.preventDefault();
        const response = await sendChangePassword(userInfo);
        response === '' ? setUpdated(true) : toast.error(<CustomToastContent
            content={['Couldn\'t change password!']}/>);
    }

    const disabled = userInfo.password !== userInfo.secondPassword || userInfo.password === '' || userInfo.secondPassword === '';

    return (
        !loading && (userInfo.email !== "" ?
            <div className={"mt-lg-5 w-100 register d-flex row justify-content-center text-center"}>
                <h2>Change password</h2>
                <div className={"register-box"}>
                    {!updated ? <Form onSubmit={changePassword} id={"changePassword"} className={"mt-lg-5 mb-lg-3"}>
                        <CommonInputText name={"password"} label={"Password:"} value={userInfo.password}
                                         setObjectValue={setUserInfo} type={"password"}></CommonInputText>
                        <CommonInputText name={"secondPassword"} label={"Repeat password:"}
                                         value={userInfo.secondPassword}
                                         setObjectValue={setUserInfo} type={"password"}></CommonInputText>
                        <div className={"d-flex justify-content-end mx-5 mt-3"}>
                            <Button className={"register-button"} type={"submit"} disabled={disabled}>Update</Button>
                        </div>
                    </Form> : <div>
                        <h4>Password has been changed! You can log in now.</h4>
                        <Button className={"login-button"} onClick={()=>setShow(true)}>Log in</Button>
                        <LoginForm show={show} onHide={()=>navigate(`/`)}/>
                    </div>}
                </div>
            </div>
            :
            <Navigate to={"/error"}/>)
    )
}