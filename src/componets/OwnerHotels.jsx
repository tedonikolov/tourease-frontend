import CustomTable from "./CustomTable";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {defaultHotel} from "../utils/defaultValues";
import Hotel from "./Hotel";

export default function OwnerHotels({setStep, hotels, countries, owner}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const [hotel,setHotel]=useState();

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
            default: {
                return column;
            }
        }
    }

    return (
        <div>
            <div className={"d-flex justify-content-center m-3"}><Button className={"main-button"} onClick={()=>setHotel(()=>({...defaultHotel,owner:owner}))}>{t("Add hotel")}</Button></div>
            {hotel && <Hotel setStep={setStep} hotel={hotel} clear={()=>setHotel(null)} setHotel={setHotel} checkStars={checkStars} countries={countries}/>}
            {hotels.length>0 && <CustomTable darkHeader={false}
                                    tableData={hotels}
                                    viewComponent={(id) => setHotel(()=>hotels.find((hotel)=>hotel.id===id))}
                                    checkStars={checkStars}
                                    columns={{
                                        headings: ["Name", "Address", "Stars", "Rating"],
                                        items: hotels.map(({
                                                               name,
                                                               location,
                                                               stars,
                                                               rating
                                                           }) => [name, location.city + ", " + location.address, stars, rating ? rating.rating : t("noRating")])
                                    }}/>}
        </div>
    )
}