import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import RegularProfileInfo from "../componets/RegularProfileInfo";
import StepWizard from "react-step-wizard";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useQuery} from "@tanstack/react-query";
import {getCountries} from "../hooks/config";
import PassportRegularInfo from "../componets/PassportRegularInfo";
import Header from "../componets/Header";
import {useTranslation} from "react-i18next";

export default function RegularProfilePage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"})
    const {t: countries} = useTranslation("translation", {keyPrefix: "countries"})

    const {loggedUser, setLoggedUser} = useContext(AuthContext);
    const {data, isLoading} = useQuery({
            queryKey: ["get all countries"],
            queryFn: getCountries,
            staleTime: 5000
        }
    )
    const [step, setStep] = useState();

    useEffect(() => {
        const url = new URL(window.location.href);
        const expired = url.searchParams.get('passportExpired');
        expired ? setStep(2) : setStep(1);
    }, []);

    return (
        !isLoading && <div>
            <Header/>
            <StepWizard
                initialStep={step}
                className=''
                nav={<CustomStepWizardNav steps={[t('profile'), t('passport')]}/>}
                transitions={{
                    enterRight: '',
                    enterLeft: '',
                    exitRight: '',
                    exitLeft: '',
                }}
            >
                <RegularProfileInfo userInfo={loggedUser} setUserInfo={setLoggedUser}
                                    countries={data ? data.map((country) => {
                                        return {value: country, label: countries(country)}
                                    }) : []}/>
                <PassportRegularInfo userInfo={loggedUser} setUserInfo={setLoggedUser}
                                     countries={data ? data.map((country) => {
                                         return {value: country, label: countries(country)}
                                     }) : []}/>
            </StepWizard>
        </div>
    )
}