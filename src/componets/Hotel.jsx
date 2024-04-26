import {Button, Modal} from "react-bootstrap";
import CustomStepWizardNav from "./CustomStepWizardNav";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import HotelInfo from "./HotelInfo";
import {useMutation} from "@tanstack/react-query";
import {saveHotelInfo} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {queryClient} from "../hooks/RestInterceptor";
import HotelImages from "./HotelImages";

export default function Hotel({setStep, hotel, clear, setHotel, checkStars, countries, owner}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const [show, setShow] = useState(true);

    const {mutate} = useMutation({
        mutationFn: saveHotelInfo,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            setShow(false);
            clear();
            setStep(2);
            queryClient.resetQueries({queryKey: ["get owner", hotel.owner.email]});
        }
    })

    function saveHotel(event) {
        event.preventDefault();
        mutate(hotel);
    }

    useEffect(() => {
        if(!hotel.owner){
            setHotel(()=>({...hotel, owner: owner}))
        }
    }, [hotel]);

    const [step, goToStep] = useState(1)

    const disabled = !hotel.name || !hotel.location.country || !hotel.location.city || !hotel.location.latitude
        || !hotel.location.longitude || !hotel.stars || !hotel.owner;

    return (
        <div>
            <Modal size={"xl"} show={show} onHide={() => {
                setShow(false);
                clear();
            }} centered>
                <Modal.Header closeButton>
                    <CustomStepWizardNav header={true} currentStep={step} goToStep={goToStep} steps={[t('Hotel'), t('Images')]}/>
                </Modal.Header>
                <Modal.Body>
                    {step === 1 &&
                        <HotelInfo hotel={hotel} setHotel={setHotel} checkStars={checkStars} countries={countries}/>}
                    {step === 2 && <HotelImages hotel={hotel}/>}
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <Button form={"hotel"} className={"main-button"} disabled={disabled} onClick={saveHotel}>{t("save")}</Button>
                    <Button className={"close-button"} onClick={() => {
                        setShow(false);
                        clear();
                    }}>{t("close")}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}