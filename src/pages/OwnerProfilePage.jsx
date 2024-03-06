import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import React, {useContext, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import HotelOwnerProfile from "../componets/HotelOwnerProfile";
import {useQuery} from "@tanstack/react-query";
import {AuthContext} from "../context/AuthContext";
import {getOwnerByEmail} from "../hooks/hotel";
import OwnerHotels from "../componets/OwnerHotels";
import {countries} from "../utils/options";

export default function OwnerProfilePage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {t: tcountries} = useTranslation("translation", {keyPrefix: "countries"})
    const {sideBarVisible} = useContext(SideBarContext);
    const {loggedUser} = useContext(AuthContext);

    const [step,setStep]=useState(1)

    const {data: owner, isLoading} = useQuery({
            queryKey: ["get owner", loggedUser.email],
            queryFn: () => getOwnerByEmail(loggedUser.email),
            staleTime: 5000
        }
    )

    return (
        !isLoading && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
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
                    <OwnerHotels setStep={setStep} hotels={owner.hotels} owner={owner} countries={countries ? countries.map((country) => {
                        return {value: country.value, label: tcountries(country.label)}
                    }) : []}
                    />
                </StepWizard>
            </div>
        </div>
    )
}