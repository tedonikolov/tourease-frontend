import CommonInputText from "./CommonInputText";
import React, {useState} from "react";
import {defaultRegular} from "../utils/defaultValues";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
import {Button, Form} from "react-bootstrap";
import {sendRegularProfile} from "../hooks/Regular";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";
import CustomPhoneInput from "./CustomPhoneInput";
import {phonecodes} from "../utils/options";

export default function RegularProfileInfo({userInfo, countries, setUserInfo}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    const [regular, setRegular] = useState(userInfo.regular ? userInfo.regular : defaultRegular);

    const gender = [{value: 'male', label: t('male')},
        {value: 'female', label: t('female')}]

    const disabled = regular.birthDate === 'Invalid Date' || regular.birthDate === null;

    const {mutate} = useMutation({
        mutationFn: sendRegularProfile,
        onSuccess: () => {
            setUserInfo({...userInfo, regular: regular});
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
        }
    })

    function saveRegular(event) {
        event.preventDefault();
        mutate({email:userInfo.email, regular:regular});
    }

    function splitPhone(){
        let countryCode;
        let phoneNumber;
        regular.phone && phonecodes.forEach(country => {
            if (regular.phone.startsWith(country.label)) {
                countryCode=country.label;
                phoneNumber=regular.phone.slice(country.label.length);
            }
        });
        return {countryCode,phoneNumber};
    }

    return (
        <div className={'register-box'}>
            <Form id={'regular'} onSubmit={saveRegular}>
                <CommonInputText disabled={true} type={'text'} value={userInfo.email} label={t('email')}/>
                <CommonInputText type={'text'} value={regular.firstName}
                                 label={t('firstName')} name={'firstName'} setObjectValue={setRegular}/>
                <CommonInputText type={'text'} value={regular.lastName}
                                 label={t('lastName')} name={'lastName'} setObjectValue={setRegular}/>
                <CustomPhoneInput type={'text'} value={splitPhone()}
                                  label={t('phone')} name={'phone'} setObjectValue={setRegular}/>
                <CustomDatePicker label={t('Date of birth')} selectedDate={regular.birthDate} name={'birthDate'}
                                  setValue={setRegular} isClearable={false}/>
                <CustomSelect options={countries} defaultValue={regular.country} setObjectValue={setRegular}
                              label={t('country')} name={'country'}/>
                <CustomSelect options={gender} defaultValue={regular.gender} setObjectValue={setRegular}
                              label={t('gender')} name={'gender'}/>

                {disabled && <div className={"mt-4 text-danger"}>* Select valid passport date!</div>}
                <div className={"d-flex justify-content-center mt-3 mb-3"}>
                    <Button type={'submit'} className={'register-button'} disabled={disabled}>{t("save")}</Button>
                </div>
            </Form>
        </div>
    )
}