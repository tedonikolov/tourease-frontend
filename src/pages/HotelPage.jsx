import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import React, {useContext, useEffect, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import StepWizard from "react-step-wizard";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import {countries} from "../utils/options";
import {HotelContext} from "../context/HotelContext";
import HotelInfo from "../componets/HotelInfo";
import HotelImages from "../componets/HotelImages";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import HotelWorkingPeriod from "../componets/HotelWorkingPeriod";

export default function HotelPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {workerHotel} = useContext(HotelContext);
    const [hotel, setHotel] = useState();

    useEffect(() => {
        if (workerHotel) {
            setHotel(()=>workerHotel);
        }
    }, [workerHotel]);

    function checkStars(column) {
        switch (column) {
            case "ONE": {
                return <FontAwesomeIcon color='orange' icon={faStar}/>;
            }
            case "TWO": {
                return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/></div>);
            }
            case "THREE": {
                return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/></div>);
            }
            case "FOUR": {
                return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/></div>);
            }
            case "FIVE": {
                return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/>
                    <FontAwesomeIcon color='orange' icon={faStar}/></div>);
            }
            case "NONE":{
                return <FontAwesomeIcon color='white' icon={faStar}/>;
            }
            default: {
                return column;
            }
        }
    }

    return (
        hotel && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("profile")}/>
                <StepWizard
                    nav={<CustomStepWizardNav steps={[t('Hotel'), t('WorkingPeriod'), t('Images')]}/>}
                    transitions={{
                        enterRight: '',
                        enterLeft: '',
                        exitRight: '',
                        exitLeft: '',
                    }}
                >
                    <div className={"m-2"}><HotelInfo hotel={hotel} setHotel={setHotel} checkStars={checkStars} countries={countries}/></div>
                    <HotelWorkingPeriod hotel={hotel}/>
                    <HotelImages hotel={hotel}/>
                </StepWizard>
            </div>
        </div>
    )
}