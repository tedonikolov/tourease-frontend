import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import React, {useContext, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import HotelOwnerProfile from "../componets/HotelOwnerProfile";
import OwnerHotels from "../componets/OwnerHotels";
import {countries} from "../utils/options";
import {HotelContext} from "../context/HotelContext";

export default function OwnerProfilePage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {t: tcountries} = useTranslation("translation", {keyPrefix: "countries"})
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner} = useContext(HotelContext);

    const [step, setStep] = useState(1)

    return (
        owner && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("profile")}/>
                <StepWizard
                    initialStep={step}
                    nav={<CustomStepWizardNav steps={[t('profile'), t('hotels')]}/>}
                    transitions={{
                        enterRight: '',
                        enterLeft: '',
                        exitRight: '',
                        exitLeft: '',
                    }}
                >
                    <HotelOwnerProfile owner={owner} countries={countries ? countries.map((country) => {
                        return {value: country.value, label: tcountries(country.label)}
                    }) : []}
                    />
                    <OwnerHotels setStep={setStep} hotels={owner.hotels} owner={owner}
                                 countries={countries ? countries.map((country) => {
                                     return {value: country.value, label: tcountries(country.label)}
                                 }) : []}
                    />
                </StepWizard>
            </div>
        </div>
    )
}