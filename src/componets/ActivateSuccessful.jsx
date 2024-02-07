import React, {useState} from "react";
import {Button} from "react-bootstrap";
import LoginForm from "./LoginForm";

export default function ActivateSuccessful (){
    const [show,setShow]=useState(false);

    return (
        <div className={"register-box"}>
            <h3 className={"mt-3"}>Profile has been activate successful <i className="bi bi-check-circle-fill text-success"/></h3>
            <Button onClick={()=>setShow(true)} className={"register-button m-3"}>Login</Button>
            <LoginForm show={show} onHide={()=>setShow(false)}/>
        </div>
    )
}