import Select from "react-select";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import Flags from "country-flag-icons/react/3x2";

export default function CustomSelect({
                                         options,
                                         setObjectValue,
                                         setValue,
                                         handleSelect,
                                         label,
                                         name,
                                         defaultValue,
                                         setDefaultValue,
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

    useEffect(() => {
        setDefaultValue && setDefaultValue();
    }, []);

    const Flag = ({countryCode}) => {
        const FlagComponent = Flags[countryCode.toUpperCase()];
        return <FlagComponent className={"w-25"}/>;
    };

    return (
        <Select className={'mt-4 mb-4'}
                onChange={handleSelect ? handleSelect : handleInputChange}
                isClearable={isClearable}
                placeholder={label && (t('choose') + ' ' + label.toLowerCase())}
                value={defaultOption || ""}
                options={options}
                required={true}
                isSearchable={isSearchable}
                formatOptionLabel={option => (
                    <div>
                        <span>{option.label} </span>
                        {option.image && <Flag countryCode={option.image}/>}
                    </div>
                )}        />
    )
}