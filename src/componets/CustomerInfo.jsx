import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {defaultCustomer} from "../utils/defaultValues";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {countries, phonecodes} from "../utils/options";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomPhoneInput from "./CustomPhoneInput";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import dayjs from "dayjs";
import {addCustomerToReservation, getCustomerByPassportId} from "../hooks/hotel";
import {queryClient} from "../hooks/RestInterceptor";

export default function CustomerInfo({reservationId, customer, filter, setCustomerId, setNewReservation}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"})
    const {t: tcountries} = useTranslation("translation", {keyPrefix: "countries"})
    const [customerInfo, setCustomerInfo] = useState();

    useEffect(() => {
        setCustomerInfo(customer);
    }, [customer]);

    const gender = [{value: 'male', label: t('male')},
        {value: 'female', label: t('female')}]

    const disabled = customerInfo && (customerInfo.expirationDate === 'Invalid Date' || customerInfo.expirationDate === null || customerInfo.creationDate === 'Invalid Date' || customerInfo.creationDate === null)
    const disabledBirthday = customerInfo && (customerInfo.birthDate === 'Invalid Date' || customerInfo.birthDate === null);

    const {mutate} = useMutation({
        mutationFn: () => addCustomerToReservation(reservationId, customerInfo),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservation", filter]});
            setCustomerId && setCustomerId(() => null);
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
        }
    })

    const {data} = useQuery({
        queryKey: ["get customer info", customerInfo && customerInfo.passportId],
        queryFn: () => getCustomerByPassportId(customerInfo.passportId),
        enabled: customerInfo != null && customerInfo.passportId !== defaultCustomer.passportId,
        retry: false,
        staleTime: 5000
    })

    useEffect(() => {
        data && setCustomerInfo(() => data);
    }, [data]);

    function saveCustomer(event) {
        mutate();
        event.preventDefault();
    }

    function splitPhone() {
        let countryCode;
        let phoneNumber;
        customerInfo.phoneNumber && phonecodes.forEach(country => {
            if (customerInfo.phoneNumber.startsWith(country.label)) {
                countryCode = country.label;
                phoneNumber = customerInfo.phoneNumber.slice(country.label.length);
            }
        });
        return phoneNumber && countryCode ? {countryCode, phoneNumber} : countryCode ? {
            countryCode: countryCode,
            phoneNumber: ""
        } : {countryCode: "+359", phoneNumber: ""};
    }

    useEffect(() => {
        setNewReservation && setNewReservation((prevValue)=>({...prevValue, ...customerInfo}));
    }, [customerInfo]);

    return (
        customerInfo && <div className={'d-flex'}>
            <Form id={'customerCreate'} onSubmit={saveCustomer}>
                <CommonInputText type={'text'} value={customerInfo.fullName}
                                 label={t('fullName')} name={'fullName'} setObjectValue={setCustomerInfo}/>
                <CommonInputText type={'text'} value={customerInfo.passportId}
                                 label={t('passportNumber')} name={'passportId'} setObjectValue={setCustomerInfo}/>
                <div className={"d-flex justify-content-between mx-5"}><CustomDatePicker label={t('creationDate')}
                                                                                         selectedDate={customerInfo.creationDate}
                                                                                         name={'creationDate'}
                                                                                         setValue={setCustomerInfo}/>
                    <CustomDatePicker label={t('expirationDate')} selectedDate={customerInfo.expirationDate}
                                      name={'expirationDate'} minDate={dayjs()}
                                      setValue={setCustomerInfo}/></div>
                <CustomPhoneInput type={'text'} value={splitPhone()} required={false}
                                  label={t('phone')} name={'phoneNumber'} setObjectValue={setCustomerInfo}/>
                <CommonInputText type={'text'} value={customerInfo.email} required={false}
                                 label={t('email')} name={'email'} setObjectValue={setCustomerInfo}/>
                <div className={"d-flex justify-content-between mx-5"}><CustomDatePicker label={t('Date of birth')}
                                                                                         selectedDate={customerInfo.birthDate}
                                                                                         name={'birthDate'}
                                                                                         setValue={setCustomerInfo}
                                                                                         isClearable={false}/>
                    <CustomSelect options={gender} defaultValue={customerInfo.gender} setObjectValue={setCustomerInfo}
                                  label={t('gender')} name={'gender'}/></div>
                <CustomSelect options={countries ? countries.map((country) => {
                    return {value: country.value, label: tcountries(country.label)}
                }) : []} defaultValue={customerInfo.country} setObjectValue={setCustomerInfo}
                              label={t('country')} name={'country'}/>
                {!setNewReservation && disabled && <div className={"mt-4 text-danger"}>* {t("Select valid passport date!")}</div>}
                {!setNewReservation && disabledBirthday && <div className={"mt-4 text-danger"}>* {t("Select birthday date!")}</div>}
                {!setNewReservation && <div className={"d-flex justify-content-center mt-3 mb-3"}>
                    <Button type={'submit'} className={'register-button'}
                            disabled={disabled || disabledBirthday}>{t("save")}</Button>
                </div>}
            </Form>
        </div>
    )
}