import CustomTable from "./CustomTable";
import React, {useContext} from "react";
import {CurrencyContext} from "../context/CurrencyContext";

export default function TypesPreview({types}) {
    const {currency:userCurrency, changePrice} = useContext(CurrencyContext);

    return (
        <CustomTable darkHeader={false}
                     tableData={types.sort((a, b) => a.id - b.id)}
                     columns={{
                         headings: ["Name", "People", "Price"],
                         items: types.sort((a, b) => a.id - b.id).map(({
                                                                           name,
                                                                           beds,
                                                                           price,
                                                                           currency
                                                                       }) =>
                             [name, beds.reduce((total, bed) => total + bed.people, 0), changePrice({currency: currency, price: price}, userCurrency) + " " + userCurrency])
                     }}/>
    )
}