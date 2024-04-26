import CustomTable from "./CustomTable";
import React from "react";

export default function TypesPreview({types}) {
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
                             [name, beds.reduce((total, bed) => total + bed.people, 0), price + " " + currency])
                     }}/>
    )
}