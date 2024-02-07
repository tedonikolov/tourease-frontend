import {Button} from "react-bootstrap";
import {useState} from "react";
import LoginForm from "../componets/LoginForm";

export default function LandingPage() {
    const [toggleLogin, setToggleLogin] = useState(false)

    return (
        toggleLogin ?
            <LoginForm show={toggleLogin} onHide={() => setToggleLogin(false)}/>
            :
            <div className={'overlay'}>
            <div className={'login-box text-center'}>
                <h2>Welcome to TourEase</h2>
                <h3>In order to use the platform, you need to have profile</h3>
                <Button className={'login-button m-2'} onClick={() => setToggleLogin(true)}>Login</Button>
                <Button className={'register-button'}>Create profile</Button>
            </div>
        </div>
    )
}