import CustomTable from "./CustomTable";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {CurrencyContext} from "../context/CurrencyContext";

export default function MealsPreview({meals, people}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {currency:userCurrency, changePrice} = useContext(CurrencyContext);

    return (
        <CustomTable darkHeader={false}
                     tableData={meals.sort((a, b) => a.id - b.id)}
                     columns={{
                         headings: ["Name", "People", "Price"],
                         items: meals.sort((a, b) => a.id - b.id).map(({
                                                                           type,
                                                                           price,
                                                                           currency
                                                                       }) =>
                             [t(type), people, changePrice({currency: currency, price: (people*price)}, userCurrency) + " " + userCurrency])
                     }}/>
    )
}