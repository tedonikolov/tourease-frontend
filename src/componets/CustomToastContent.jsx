import {useTranslation} from "react-i18next";

export default function CustomToastContent ({content, translated}){
    const {t}=useTranslation("translation",{keyPrefix:"errors"})

    return (
        <div className={`d-flex flex-column justify-content-center w-100 `}>
            {content.map((element, index) => (
                <p className={`mb-0`} key={index}>
                    {translated ? t(element):element}
                </p>
            ))}
        </div>
    );
};