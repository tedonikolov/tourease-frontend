import {useTranslation} from "react-i18next";
import CustomTable from "./CustomTable";
import React from "react";

export default function FacilitiesPreview({facilities}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
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
                             [t(name), paid ? price + " " + currency : t("Free")])
                     }}/>
    )
}