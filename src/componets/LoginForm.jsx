import "../styles/login.css"
import {Form, Modal, Spinner} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {Navigate} from "react-router-dom";
import {sendPasswordChangeEmail} from "../hooks/User";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";

export default function LoginForm({show, onHide}) {
    const [userInfo, setUserInfo] = useState({username: "", password: ""})
    const {login, mainPage, loggedUser} = useContext(AuthContext);
    const [error, setError] = useState(false);

    const [changePassword, setChangePassword] = useState(false);
    const [email, setEmail] = useState("");
    let [delay, setDelay] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    async function sendLogin(event) {
        setError(false);
        event.preventDefault();
        const status = await login(userInfo)
        status === 200 ? onHide && onHide() : setError(() => true)
    }

    async function sendChangePassword(event) {
        setIsLoading(true);
        event.preventDefault();
        const status = await sendPasswordChangeEmail(email);
        setIsLoading(false);
        status ==='' && toast.success(<CustomToastContent content={['Email send successfully!']}/>);
        setDelay(() => 60);
    }

    useEffect(() => {
        setError(false);
    }, [show]);

    useEffect(() => {
        if (delay !== 0) {
            const interval = setInterval(() => setDelay(() => delay - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [delay]);

    return (
        !loggedUser ?
            <Modal show={show} onHide={onHide} centered>
                {!changePassword ? <div className={"login-box"}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <h3>Login into your account</h3>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error && <div className={"text-danger text-center mb-2"}>Wrong credentials</div>}
                            <Form id={"login"} onSubmit={sendLogin}>
                                <CommonInputText label={"Email:"} name={"username"} type={"text"} value={userInfo.username}
                                                 setObjectValue={setUserInfo}/>
                                <CommonInputText label={"Password:"} name={"password"} type={"password"}
                                                 value={userInfo.password} setObjectValue={setUserInfo}/>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-between'>
                            <button form={"login"} className={"login-button"}>Login</button>
                            <button className={"password-button"} onClick={() => setChangePassword(true)}>Forgot password</button>
                            <button className={"close-button"} onClick={onHide}>Close</button>
                        </Modal.Footer>
                    </div>
                    :
                    <div className={"login-box"}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <h3>Change password</h3>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form id={"changePassword"} onSubmit={sendChangePassword}>
                                <CommonInputText label={"Email:"} type={"text"}
                                                 value={email}
                                                 setValue={setEmail}/>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-between'>
                            {delay !== 0 ? <div> <h5>Can resend it again after:</h5> <h5 className={"text-danger"}> {delay} </h5> </div> : isLoading ? <Spinner animation={'border'}/> :
                                <button form={"changePassword"} className={"login-button"}>Resent</button>}
                            <button className={"close-button"} onClick={()=>setChangePassword(false)}>Close</button>
                        </Modal.Footer>
                    </div>}
            </Modal>
            :
            <Navigate to={mainPage}/>
    )
}