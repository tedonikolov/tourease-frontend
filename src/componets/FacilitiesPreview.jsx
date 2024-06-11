import {useTranslation} from "react-i18next";
import CustomTable from "./CustomTable";
import React, {useContext} from "react";
import {CurrencyContext} from "../context/CurrencyContext";

export default function FacilitiesPreview({facilities}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {currency:userCurrency, changePrice} = useContext(CurrencyContext);

    return (
        <CustomTable darkHeader={false}
                     tableData={facilities.sort((a, b) => a.id - b.id)}
                     columns={{
                         headings: ["Name", "Price"],
                         items: facilities.sort((a, b) => a.id - b.id).map(({
                                                                           name,
                                                                           price,
                                                                           currency,
                                                                           paid
                                                                       }) =>
                             [t(name), paid ? changePrice({currency: currency, price: price}, userCurrency) + " " + userCurrency : t("Free")])
                     }}/>
    )
}