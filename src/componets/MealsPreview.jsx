import CustomTable from "./CustomTable";
import React from "react";
import {useTranslation} from "react-i18next";

export default function MealsPreview({meals, people}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
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
                             [t(type), people, (people*price) + " " + currency])
                     }}/>
    )
}