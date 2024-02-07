import {Button, Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {sendActivateEmail} from "../hooks/User";

export default function ActivateEmail({userInfo}) {
    let [delay, setDelay] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    async function sendEmail() {
        setIsLoading(() => true);
        await sendActivateEmail(userInfo.email);
        setIsLoading(() => false);
        setDelay(() => 60);
    }

    useEffect(() => {
        if (delay !== 0) {
            const interval = setInterval(() => setDelay(() => delay - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [delay]);

    return (
        <div className={"register-box"}>
            <h3 className={"mt-3"}>Activation email has been send!</h3>
            <h4 className={"mt-5"}>
                Please click on sent link.<br/>
                If you didn't receive email, click on resend it.
            </h4>
            {delay !== 0 ? <div> <h5>Can resend it again after:</h5> <h5 className={"text-danger"}> {delay} </h5> </div> : isLoading ? <Spinner animation={'border'}/> :
                <Button onClick={sendEmail} className={"register-button m-3"}>Resent</Button>}
        </div>
    )
}