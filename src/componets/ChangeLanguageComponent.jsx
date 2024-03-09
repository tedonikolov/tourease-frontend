import i18n from '../i18n';
import React from "react";
import CustomSelect from "./CustomSelect";


export default function ChangeLanguageComponent() {
    const languages = [{value: 'us', label: "English", image: "US"}, {value: 'bg', label: "Български", image: "BG"}];

    const handleSelect = (e) => {
        i18n.changeLanguage(e.value);
    };

    return (
        <div className={"w-40"}>
            <CustomSelect
                isSearchable={false}
                options={languages}
                handleSelect={handleSelect}
                defaultValue={i18n.language}
                hideIndicator={true}/>
        </div>
    );
};
