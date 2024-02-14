import Select from "react-select";
import i18n from '../i18n';
import Flags from "country-flag-icons/react/3x2";
import {useState} from "react";


export default function ChangeLanguageComponent (){
    const languages = [{value:'us',label:"🇺🇸"}, {value:'bg',label: "🇧🇬"}];
    const defaultOption = languages.find(option => option.value === i18n.language);
    const [countryFlag, setCountryFlag] = useState(i18n.language);

    const Flag = ({ countryCode }) => {
        const FlagComponent = Flags[countryCode.toUpperCase()];
        return <FlagComponent className={"w-25 me-2"}/>;
    };

    const handleSelect = (e) => {
        i18n.changeLanguage(e.value);
        setCountryFlag(()=>e.value);
    };

    return (
        <div className='d-flex justify-content-between align-items-center text-center w-25 me-2'>
            <Flag countryCode={countryFlag}/>
            <Select
                className='w-100 z-2'
                hideSelectedOptions={true}
                isSearchable={false}
                options={languages}
                defaultValue={defaultOption}
                onChange={(e) => handleSelect(e)}
                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            />
        </div>
    );
};
