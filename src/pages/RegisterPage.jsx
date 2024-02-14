import RegisterProfile from "../componets/RegisterProfile";
import React, {useEffect, useState} from "react";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import ActivateEmail from "../componets/ActivateEmail";
import {sendActivateProfile} from "../hooks/User";
import ActivateSuccessful from "../componets/ActivateSuccessful";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";
export default function RegisterPage ({activateProfile, step}){
    const {t}=useTranslation("translation",{keyPrefix:"common"})

    const [userInfo, setUserInfo] = useState({email: "", password: "", secondPassword: "", userType: "REGULAR"})

    const {mutate:activate}=useMutation({
        mutationFn:sendActivateProfile
    })

    useEffect(() => {
        if(activateProfile){
            const url = new URL(window.location.href);
            const email = url.searchParams.get('email');
            activate(email);
        }
    }, []);

    return(
        <div className={"mt-lg-5 w-100 register d-flex row justify-content-center text-center"}>
            <h2>{t("register")}</h2>
            <StepWizard
                initialStep={step}
                className=''
                nav={<CustomStepWizardNav hideNextSteps={true} isDisabled={true} steps={[t('Create profile'), t('Email activation'), t('Activated')]} />}
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