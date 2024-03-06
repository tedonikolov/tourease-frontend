import Select from "react-select";
import React from "react";
import {useTranslation} from "react-i18next";

export default function CustomSelect({
                                         options,
                                         setObjectValue,
                                         setValue,
                                         label,
                                         name,
                                         defaultValue,
                                         isClearable = false,
                                         isSearchable = true
                                     }) {
    const defaultOption = options.find(option => option.value === defaultValue);
    const {t} = useTranslation("translation", {keyPrefix: 'common'});

    function handleInputChange(newValue) {
        setObjectValue ? setObjectValue((prevValue) => ({
                ...prevValue,
                [name]: newValue ? newValue.value : null
            }))
            :
            setValue(newValue.value);
    }

    return (
        <Select className={'mt-4 mb-4'}
                onChange={handleInputChange}
                isClearable={isClearable}
                placeholder={t('choose') + ' ' + label}
                defaultValue={defaultOption}
                options={options}
                required={true}
                isSearchable={isSearchable}
        />
    )
}