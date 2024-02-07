import RegisterProfile from "../componets/RegisterProfile";
import React, {useEffect, useState} from "react";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import ActivateEmail from "../componets/ActivateEmail";
import {sendActivateProfile} from "../hooks/User";
import ActivateSuccessful from "../componets/ActivateSuccessful";
export default function RegisterPage ({activateProfile, step}){
    const [userInfo, setUserInfo] = useState({email: "", password: "", secondPassword: "", userType: "REGULAR"})

    useEffect(() => {
        if(activateProfile){
            const url = new URL(window.location.href);
            const email = url.searchParams.get('email');
            sendActivateProfile(email);
        }
    }, []);

    return(
        <div className={"mt-lg-5 w-100 register d-flex row justify-content-center text-center"}>
            <h2>Register steps</h2>
            <StepWizard
                initialStep={step}
                className=''
                nav={<CustomStepWizardNav hideNextSteps={true} isDisabled={true} steps={['Create profile', 'Email activation', 'Activated']} />}
                transitions={{
                    enterRight: '',
                    enterLeft: '',
                    exitRight: '',
                    exitLeft: '',
                }}
            >
                <RegisterProfile {...{userInfo, setUserInfo}}/>
                <ActivateEmail userInfo={userInfo}/>
                <ActivateSuccessful/>
            </StepWizard>
        </div>
    )
}