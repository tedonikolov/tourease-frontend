import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import RegularProfileInfo from "../componets/RegularProfileInfo";
import StepWizard from "react-step-wizard";
import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {useQuery} from "@tanstack/react-query";
import {getCountries} from "../hooks/config";
import PassportRegularInfo from "../componets/PassportRegularInfo";

export default function RegularProfilePage() {
    const {loggedUser, setLoggedUser} = useContext(AuthContext);
    const {data, isLoading} = useQuery({
            queryKey: ["get all countries"],
            queryFn: getCountries
        }
    )

    return (
        !isLoading && <div>
            <StepWizard
                className=''
                nav={<CustomStepWizardNav steps={['Profile', 'Passport']}/>}
                transitions={{
                    enterRight: '',
                    enterLeft: '',
                    exitRight: '',
                    exitLeft: '',
                }}
            >
                <RegularProfileInfo userInfo={loggedUser} setUserInfo={setLoggedUser}
                                    countries={data ? data.map((country) => {
                                        return {value: country, label: country}
                                    }) : []}/>
                <PassportRegularInfo userInfo={loggedUser} setUserInfo={setLoggedUser}
                                     countries={data ? data.map((country) => {
                                         return {value: country, label: country}
                                     }) : []}/>
            </StepWizard>
        </div>
    )
}