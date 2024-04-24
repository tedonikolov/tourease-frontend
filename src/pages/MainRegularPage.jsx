import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import React, {useContext} from "react";
import {SideBarContext} from "../context/SideBarContext";
import {AuthContext} from "../context/AuthContext";

export default function MainRegularPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {loggedUser} = useContext(AuthContext);

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                {loggedUser && <Header title={t("Hotels")}/>}

            </div>
        </div>
    )
}