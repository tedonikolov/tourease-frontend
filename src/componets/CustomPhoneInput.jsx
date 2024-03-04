import Select from "react-select";
import Flags from "country-flag-icons/react/3x2";
import {phonecodes} from "../utils/phonecodes";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

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
    const defaultOption = phonecodes.find(option => option.label === countryNumber);
    const [countryFlag, setCountryFlag] = useState(defaultOption && defaultOption.value);
    const [number, setNumber] = useState(value && value.phoneNumber);

    function handleInputChange(event) {
        event.preventDefault();
        setNumber(event.target.value);
    }

    const handleSelect = (e) => {
        setCountryFlag(() => e.value);
        setCountryNumber(() => e.label);
    };

    useEffect(() => {
        setObjectValue ? setObjectValue((prevValue) => ({
                ...prevValue,
                [name]: countryNumber + number
            }))
            :
            setValue(countryNumber + number);
    }, [countryNumber, number]);

    const Flag = ({countryCode}) => {
        const FlagComponent = Flags[countryCode.toUpperCase()];
        return <FlagComponent className={"w-25"}/>;
    };

    return (
        <>
            <div className='d-flex text-nowrap justify-content-center align-items-center text-center mt-3'>
                <label className={"w-75 text-start"}>{label}:</label>
                <div className='d-flex justify-content-between align-items-center text-center w-100 mx-5'>
                    {countryFlag && <Flag countryCode={countryFlag}/>}
                    <Select
                        required={true}
                        className="w-75 react-select-container"
                        hideSelectedOptions={true}
                        isSearchable={false}
                        options={phonecodes}
                        placeholder={t("phoneCode")}
                        onChange={(e) => handleSelect(e)}
                        defaultValue={defaultOption}
                    />
                    <input
                        className={"w-75"}
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