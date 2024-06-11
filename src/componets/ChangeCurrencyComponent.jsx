import React, {useContext} from "react";
import CustomSelect from "./CustomSelect";
import {CurrencyContext} from "../context/CurrencyContext";
import {currencyOptions} from "../utils/options";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../context/AuthContext";
import {Regular} from "../utils/Role";


export default function ChangeCurrencyComponent() {
    const {setCurrency, currency} = useContext(CurrencyContext);
    const {permission} = useContext(AuthContext);
    const {t} = useTranslation("translation", {keyPrefix: "common"});

    return (
        <div className={"w-40"}>
            <CustomSelect
            options={currencyOptions.map((currency) => ({
                label: t(currency.label),
                value: currency.value,
                image: currency.image
            }))}
            label={t("Currency")} setValue={setCurrency} hideIndicator={true}
            disabled={permission!=='' && permission !== Regular}
            defaultValue={currency}/>
        </div>
    );
};
