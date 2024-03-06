import {Button, Modal} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomSelect from "./CustomSelect";
import NoDataComponent from "./NoDataComponent";
import GoogleMapReact from 'google-map-react';
import {geocode, RequestType, setKey} from "react-geocode";
import {useMutation} from "@tanstack/react-query";
import {saveHotelInfo} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {queryClient} from "../hooks/RestInterceptor";

export default function HotelInfo({setStep, hotel, clear, setHotel, checkStars, countries}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const [show, setShow] = useState();
    const [location, setLocation] = useState(hotel.location);
    const [zoom, setZoom] = useState(5);

    const stars = [
        {value: "ONE", label: checkStars("ONE")},
        {value: "TWO", label: checkStars("TWO")},
        {value: "THREE", label: checkStars("THREE")},
        {value: "FOUR", label: checkStars("FOUR")},
        {value: "FIVE", label: checkStars("FIVE")},
    ]

    useEffect(() => {
        setShow(true)
    }, [hotel]);

    useEffect(() => {
        setHotel((prev) => ({...prev, location: location}))
    }, [location]);

    function findLocation() {
        setKey("AIzaSyAbcJS6U1QqXWAfi-_IptxZylvqtJfoPKA")
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

    const {mutate} = useMutation({
        mutationFn: saveHotelInfo,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            setShow(false);
            clear();
            setStep(2);
            queryClient.resetQueries({ queryKey: ["get owner", hotel.owner.email]});
        }
    })

    function saveHotel(event) {
        event.preventDefault();
        mutate(hotel);
    }

    return (
        <div>
            <Modal size={"xl"} show={show} onHide={() => {
                setShow(false);
                clear();
            }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3>{t("Hotel")}</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id={"form"}>
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
                            <GoogleMapReact bootstrapURLKeys={{key: 'AIzaSyAbcJS6U1QqXWAfi-_IptxZylvqtJfoPKA'}}
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
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <Button form={"form"} className={"main-button"} onClick={saveHotel}>{t("save")}</Button>
                    <Button className={"close-button"} onClick={() => {
                        setShow(false);
                        clear();
                    }}>{t("close")}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}