import {phonecodes} from "../utils/options";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomSelect from "./CustomSelect";

export default function CustomPhoneInput({
                                             label,
                                             name,
                                             disabled,
                                             type,
                                             readOnly,
                                             value,
                                             setObjectValue,
                                             setValue,
                                             error,
                                             errorText,
                                         }) {
    const [t]=useTranslation("translation",{keyPrefix:"common"})
    const [countryNumber, setCountryNumber] = useState(value && value.countryCode);
    const [defaultOption, setDefaultOption ]= useState(phonecodes.find(option => option.label === countryNumber));
    const [number, setNumber] = useState(value && value.phoneNumber);

    function handleInputChange(event) {
        event.preventDefault();
        setNumber(event.target.value);
    }

    const handleSelect = (e) => {
        setCountryNumber(() => e.label);
    };

    useEffect(() => {
        setObjectValue ? setObjectValue((prevValue) => ({
                ...prevValue,
                [name]: countryNumber + number
            }))
            :
            setValue(countryNumber + number);
        setDefaultOption(()=> phonecodes.find(option => option.label === countryNumber));
    }, [countryNumber, number]);

    return (
        <>
            <div className='d-flex text-nowrap justify-content-center align-items-center mt-3'>
                <label className={"w-90 text-start"}>{label}:</label>
                <div className='d-flex justify-content-between align-items-center mx-5'>
                    <div className={"w-70"}><CustomSelect
                        options={phonecodes.map((phone) => ({label: phone.label, value: phone.value, image:phone.value}))}
                        label={t("phoneCode")} name={"currency"} handleSelect={handleSelect} hideIndicator={true} isSearchable={false}
                        defaultValue={defaultOption.value} /></div>
                    <input
                        className={"w-90"}
                        type={type}
                        readOnly={readOnly}
                        value={number}
                        disabled={disabled}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            {error && <div className={"text-danger text-center mb-2"}>{errorText}</div>}
        </>
    )
}