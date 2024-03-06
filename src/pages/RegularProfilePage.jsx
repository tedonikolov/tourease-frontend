import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import RegularProfileInfo from "../componets/RegularProfileInfo";
import StepWizard from "react-step-wizard";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import PassportRegularInfo from "../componets/PassportRegularInfo";
import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import {SideBarContext} from "../context/SideBarContext";
import {countries} from "../utils/options";

export default function RegularProfilePage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"})
    const {t: tcountries} = useTranslation("translation", {keyPrefix: "countries"})
    const { sideBarVisible } = useContext(SideBarContext);

    const {loggedUser, setLoggedUser} = useContext(AuthContext);
    const [step, setStep] = useState();

    useEffect(() => {
        const url = new URL(window.location.href);
        const expired = url.searchParams.get('passportExpired');
        expired ? setStep(2) : setStep(1);
    }, []);

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("profile")}/>
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
                                        countries={countries ? countries.map((country) => {
                                            return {value: country.value, label: tcountries(country.label)}
                                        }) : []}/>
                    <PassportRegularInfo userInfo={loggedUser} setUserInfo={setLoggedUser}
                                         countries={countries ? countries.map((country) => {
                                             return {value: country.value, label: tcountries(country.label)}
                                         }) : []}/>
                </StepWizard>
            </div>
        </div>
    )
}