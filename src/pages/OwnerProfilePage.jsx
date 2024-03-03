import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import React, {useContext} from "react";
import {SideBarContext} from "../context/SideBarContext";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import HotelOwnerProfile from "../componets/HotelOwnerProfile";
import {useQuery} from "@tanstack/react-query";
import {getCountries} from "../hooks/config";
import {AuthContext} from "../context/AuthContext";
import {getOwnerByEmail} from "../hooks/hotel";

export default function OwnerProfilePage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {t: countries} = useTranslation("translation", {keyPrefix: "countries"})
    const {sideBarVisible} = useContext(SideBarContext);
    const {loggedUser} = useContext(AuthContext);

    const {data, isLoading: countriesLoading} = useQuery({
            queryKey: ["get all countries"],
            queryFn: getCountries,
            staleTime: 5000
        }
    )

    const {data: owner, isLoading: ownerLoading} = useQuery({
            queryKey: ["get owner", loggedUser.email],
            queryFn: () => getOwnerByEmail(loggedUser.email),
            staleTime: 5000
        }
    )

    const isLoading = countriesLoading || ownerLoading;

    return (
        !isLoading && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("profile")}/>
                <StepWizard
                    nav={<CustomStepWizardNav steps={[t('profile'), t('hotels')]}/>}
                    transitions={{
                        enterRight: '',
                        enterLeft: '',
                        exitRight: '',
                        exitLeft: '',
                    }}
                >
                    <HotelOwnerProfile owner={owner} countries={data ? data.map((country) => {
                        return {value: country, label: countries(country)}
                    }) : []}
                    />
                </StepWizard>
            </div>
        </div>
    )
}