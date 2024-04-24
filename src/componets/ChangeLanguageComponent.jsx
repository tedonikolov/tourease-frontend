import i18n from '../i18n';
import React, {useContext} from "react";
import CustomSelect from "./CustomSelect";
import {CurrencyContext} from "../context/CurrencyContext";


export default function ChangeLanguageComponent() {
    const {setCurrency} = useContext(CurrencyContext);
    const languages = [{value: 'us', label: "English", image: "US"}, {value: 'bg', label: "Български", image: "BG"}];

    const handleSelect = (e) => {
        i18n.changeLanguage(e.value);
        switch (e.value) {
            case 'us':
                setCurrency("EUR");
                break;
            case 'bg':
                setCurrency("BGN");
                break;
            default:
                setCurrency("EUR");
        }
    };

    return (
        <div className={"w-40"}>
            <CustomSelect
                isSearchable={false}
                options={languages}
                handleSelect={handleSelect}
                defaultValue={i18n.language==="bg-BG" || i18n.language==="bg" ?  languages[1].value : languages[0].value}
                hideIndicator={true}/>
        </div>
    );
};
