import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomSelect from "./CustomSelect";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {saveOwnerInfo} from "../hooks/hotel";
import CustomPhoneInput from "./CustomPhoneInput";
import {phonecodes} from "../utils/options";

export default function HotelOwnerProfile({owner,countries}){
    const {t}=useTranslation("translation",{keyPrefix:"common"})

    const [newOwner,setOwner]=useState(owner);

    const {mutate} = useMutation({
        mutationFn: saveOwnerInfo,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
        }
    })
    function saveOwner(event){
        event.preventDefault();
        mutate(newOwner);
    }

    function splitPhone(){
        let countryCode;
        let phoneNumber;
        owner.phone && phonecodes.forEach(country => {
            if (owner.phone.startsWith(country.label)) {
                countryCode=country.label;
                phoneNumber=owner.phone.slice(country.label.length);
            }
        });
        return {countryCode,phoneNumber};
    }

    return(
        <div>
            <div className={'register-box'}>
                <Form id={'regular'} onSubmit={saveOwner}>
                    <CommonInputText disabled={true} type={'text'} value={newOwner.email} label={t('email')}/>
                    <CommonInputText type={'text'} value={newOwner.fullName}
                                     label={t('fullName')} name={'fullName'} setObjectValue={setOwner}/>
                    <CommonInputText type={'text'} value={newOwner.companyName}
                                     label={t('companyName')} name={'companyName'} setObjectValue={setOwner}/>
                    <CustomSelect options={countries} defaultValue={newOwner.country} setObjectValue={setOwner}
                                  label={t('country')} name={'country'}/>
                    <CommonInputText type={'text'} value={newOwner.city}
                                     label={t('city')} name={'city'} setObjectValue={setOwner}/>
                    <CommonInputText type={'text'} value={newOwner.companyAddress}
                                     label={t('companyAddress')} name={'companyAddress'} setObjectValue={setOwner}/>
                    <CustomPhoneInput type={'text'} value={splitPhone()}
                                     label={t('phone')} name={'phone'} setObjectValue={setOwner}/>
                    <CommonInputText type={'text'} value={newOwner.eik}
                                     label={t('eik')} name={'eik'} setObjectValue={setOwner}/>
                    <div className={"d-flex justify-content-center mt-3 mb-3"}>
                        <Button type={'submit'} className={'register-button'}>{t("save")}</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}