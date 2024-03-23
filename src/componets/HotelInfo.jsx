import CommonInputText from "./CommonInputText";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomSelect from "./CustomSelect";
import NoDataComponent from "./NoDataComponent";
import GoogleMapReact from 'google-map-react';
import {geocode, RequestType, setKey} from "react-geocode";

export default function HotelInfo({hotel, setHotel, checkStars, countries}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const [location, setLocation] = useState(hotel.location);
    const [zoom, setZoom] = useState(5);
    const apiKey = process.env["GOOGLE_KEY"]

    const stars = [
        {value: "NONE", label: checkStars("NONE")},
        {value: "ONE", label: checkStars("ONE")},
        {value: "TWO", label: checkStars("TWO")},
        {value: "THREE", label: checkStars("THREE")},
        {value: "FOUR", label: checkStars("FOUR")},
        {value: "FIVE", label: checkStars("FIVE")},
    ]

    useEffect(() => {
        setHotel((prev) => ({...prev, location: location}))
    }, [location]);

    function findLocation() {
        setKey(apiKey)
        geocode(RequestType.ADDRESS, location.country + " " + location.city + " " + location.address)
            .then(({results}) => {
                const {lat, lng} = results[0].geometry.location;
                setLocation((prevValue) => ({
                    ...prevValue,
                    latitude: lat,
                    longitude: lng
                }));
            })
            .catch(console.error);
    }

    useEffect(() => {
        if (location.country) {
            setZoom(() => 5);
            //TODO stopped because of google billing findLocation();
        }
    }, [location.country]);

    useEffect(() => {
        if (location.city) {
            setZoom(() => 12);
            //TODO stopped because of google billing findLocation();
        }
    }, [location.city]);

    useEffect(() => {
        if (location.address) {
            setZoom(() => 15);
            //TODO stopped because of google billing findLocation();
        }
    }, [location.address]);

    return (
        <div>
            <form id={"hotel"}>
                <div className={"d-flex"}>
                    <div className={"w-50"}>
                        <CommonInputText type={'text'} value={hotel.name}
                                         label={t('name')} name={'name'} setObjectValue={setHotel}/>
                        <div className={"w-50"}>
                            <CustomSelect setObjectValue={setHotel} name={"stars"} options={stars}
                                          label={t("stars")} defaultValue={hotel.stars} isSearchable={false}/>
                        </div>
                        <div className={"w-50"}>
                            <CustomSelect setObjectValue={setLocation} name={"country"} options={countries}
                                          label={t("country")} defaultValue={location.country}/>
                        </div>
                    </div>
                    {hotel.rating ? <div className={"w-50"}>
                        <CommonInputText type={'text'} value={hotel.rating.rating} disabled={true}
                                         label={t('rating')}/>
                        <CommonInputText type={'text'} value={hotel.rating.numberOfRates} disabled={true}
                                         label={t('numberOfRates')}/>
                        <CommonInputText type={'text'} value={hotel.rating.totalRating} disabled={true}
                                         label={t('totalRating')}/>
                    </div> : <NoDataComponent noDataText={t("ratings")}/>}
                </div>
                <div className={"d-flex"}>
                    <div className={"w-50"}>
                        <CommonInputText type={'text'} value={location.city}
                                         label={t('city')} name={'city'} setObjectValue={setLocation}/>
                    </div>
                    <div className={"w-50"}>
                        <CommonInputText type={'text'} value={location.address}
                                         label={t('address')} name={'address'} setObjectValue={setLocation}/>
                    </div>
                </div>
                <div className={"login-box mt-3"} style={{height: '70vh', width: '100%'}}>
                    <GoogleMapReact bootstrapURLKeys={{key: apiKey}}
                                    zoom={zoom} center={{
                        lat: location.latitude ? location.latitude : 46.350,
                        lng: location.longitude ? location.longitude : 13.616
                    }}
                                    onChange={({center}) => setLocation((prevValue) => ({
                                        ...prevValue,
                                        latitude: center.lat,
                                        longitude: center.lng
                                    }))}>
                    </GoogleMapReact>
                </div>
            </form>
        </div>
    )
}