import CustomTable from "../componets/CustomTable";
import Header from "../componets/Header";
import {useQuery} from "@tanstack/react-query";
import {getChronologyTypes, getLogs} from "../hooks/admin";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import CommonInputText from "../componets/CommonInputText";
import CustomDatePicker from "../componets/CustomDatePicker";
import CustomSelect from "../componets/CustomSelect";

export default function LogsPage() {
    const [chronologyFilter, setChronologyFilter] = useState({
        email: "",
        type: null,
        createdAfter: null,
        createdBefore: null
    });
    const {data: logs, isLoading, refetch} = useQuery({
        queryKey: ["logs"],
        queryFn: () => getLogs(chronologyFilter)
    });

    const {data: types} = useQuery({
        queryKey: ["types"],
        queryFn: getChronologyTypes
    })

    useEffect(() => {
        console.log("asd")
        if (chronologyFilter.createdAfter !== 'Invalid Date' && chronologyFilter.createdBefore !== 'Invalid Date')
            refetch(chronologyFilter)
    }, [chronologyFilter, refetch]);

    function convertDate(date) {
        const newDate = dayjs(date)
        return newDate.format('DD-MM-YYYY🗓️ HH:mm:ss⏱️')
    }

    return (
        <div>
            <Header/>
            <div>
                <div className={"d-flex justify-content-between"}>
                    <h2 className={"mt-4 mx-5"}>Chronology</h2>
                    <div className={"w-25 mt-3"}>
                        <CustomSelect name={"type"} setValue={setChronologyFilter} isClearable={true}
                                      options={types ? types.map((type) => {
                                          return {value: type, label: type}
                                      }) : []}/>
                    </div>
                    <div className={"d-flex justify-content-end m-2"}>
                        <CustomDatePicker label={"From:"} setValue={setChronologyFilter} name={"createdAfter"}/>
                        <CustomDatePicker label={"To:"} setValue={setChronologyFilter} name={"createdBefore"}
                                          minDate={dayjs(chronologyFilter.createdAfter)}/>
                    </div>
                </div>
                <div className={"d-flex justify-content-end"}>
                    <CommonInputText label={"User:"} name={"email"} setObjectValue={setChronologyFilter}/>
                </div>
            </div>
            {!isLoading &&
                <div className={"w-75 mx-5"}>
                    <CustomTable columns={{
                        headings: ["User", "Message", "Date"],
                        items: logs.map(({email, message, date}) => [email, message, convertDate(date)])
                    }}/>
                </div>}
        </div>
    )
}