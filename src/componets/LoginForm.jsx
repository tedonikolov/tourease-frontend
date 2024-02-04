import "../styles/login.css"
import {Form, Modal} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";

export default function LoginForm({show, onHide}) {
    const [userInfo, setUserInfo] = useState({username: "", password: ""})
    const {login} = useContext(AuthContext);
    const [error, setError] = useState(false);

    async function sendLogin(event) {
        setError(false);
        event.preventDefault();
        const status = await login(userInfo)
        status === 200 ? onHide() : setError(() => true)
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <div className={"login-box"}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3>Login into your account</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className={"text-danger text-center mb-2"}>Wrong credentials</div>}
                    <Form id={"form"} onSubmit={sendLogin}>
                        <CommonInputText label={"Email:"} name={"username"} type={"text"} value={userInfo.username}
                                         setValue={setUserInfo}/>
                        <CommonInputText label={"Password:"} name={"password"} type={"password"}
                                         value={userInfo.password} setValue={setUserInfo}/>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <button form={"form"} className={"login-button"}>Login</button>
                    <button className={"close-button"} onClick={onHide}>Close</button>
                </Modal.Footer>
            </div>
        </Modal>
    )
}