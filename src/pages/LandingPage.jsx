import {Button} from "react-bootstrap";
import {useContext, useState} from "react";
import LoginForm from "../componets/LoginForm";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export default function LandingPage() {
    const [toggleLogin, setToggleLogin] = useState(false)
    const [registerPage, setRegisterPage] = useState(false);
    const {mainPage, loggedUser} = useContext(AuthContext);

    return (
         !loggedUser ?
            toggleLogin ?
                <LoginForm show={toggleLogin} onHide={() => setToggleLogin(false)}/>
                :
                <div className={'overlay'}>
                    <div className={'login-box text-center'}>
                        <h2>Welcome to TourEase</h2>
                        <h3>In order to use the platform, you need to have profile</h3>
                        <Button className={'login-button m-2'} onClick={() => setToggleLogin(true)}>Login</Button>
                        <Button className={'register-button'} onClick={() => setRegisterPage(true)}>Create
                            profile</Button>
                    </div>
                    {registerPage && <Navigate to={'/register'}/>}
                </div>
            :
            <Navigate to={mainPage}/>
    )
}