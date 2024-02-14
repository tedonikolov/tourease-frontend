import CustomTable from "../componets/CustomTable";
import Header from "../componets/Header";
import {useQuery} from "@tanstack/react-query";
import {getChronologyTypes, getLogs} from "../hooks/admin";
import {useState} from "react";
import dayjs from "dayjs";
import CommonInputText from "../componets/CommonInputText";
import CustomDatePicker from "../componets/CustomDatePicker";
import CustomSelect from "../componets/CustomSelect";
import {useTranslation} from "react-i18next";
import CustomPagination from "../componets/CustomPagination";
import CustomPageSizeSelector from "../componets/CustomPageSizeSelector";
import NoDataComponent from "../componets/NoDataComponent";
import {Spinner} from "react-bootstrap";

export default function LogsPage() {
    const [t] = useTranslation("translation", {keyPrefix: 'logs'});
    const {t: common} = useTranslation("translation", {keyPrefix: 'common'});

    const [chronologyFilter, setChronologyFilter] = useState({
        email: "",
        type: null,
        createdAfter: null,
        createdBefore: null,
    });

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 25
    });

    const {data: logs, isLoading, isPending} = useQuery({
        queryKey: ["logs", {chronologyFilter: chronologyFilter}, {pagination: pagination}],
        queryFn: () => getLogs(chronologyFilter, pagination),
        enabled: (chronologyFilter.createdAfter !== 'Invalid Date' && chronologyFilter.createdBefore !== 'Invalid Date')
    });

    const {data: types} = useQuery({
        queryKey: ["types"],
        queryFn: getChronologyTypes,
        staleTime: 5000
    })

    function convertDate(date) {
        const newDate = dayjs(date)
        return newDate.format('DD-MM-YYYY🗓️ HH:mm:ss⏱️')
    }

    return (
        <div>
            <Header/>
            <div>
                <div className={"d-flex justify-content-between"}>
                    <h2 className={"mt-4 mx-5"}>{t("Chronology")}</h2>
                    <div className={"w-25 mt-3"}>
                        <CustomSelect label={t("type")} name={"type"} setValue={setChronologyFilter} isClearable={true}
                                      options={types ? types.map((type) => {
                                          return {value: type, label: t(type)}
                                      }) : []}/>
                    </div>
                    <div className={"d-flex justify-content-end m-2"}>
                        <CustomDatePicker label={common("fromDate")} setValue={setChronologyFilter}
                                          name={"createdAfter"}/>
                        <CustomDatePicker label={common("toDate")} setValue={setChronologyFilter} name={"createdBefore"}
                                          minDate={dayjs(chronologyFilter.createdAfter)}/>
                    </div>
                </div>
                <div className={"d-flex w-100 justify-content-between"}>
                    <CustomPageSizeSelector value={pagination.pageSize} setValue={setPagination}/>
                    <CommonInputText label={common("user")} name={"email"} setObjectValue={setChronologyFilter}/>
                </div>
            </div>
            {!isLoading && !isPending ? logs.items.length > 0 ?
                    <div className={"w-75 mx-5"}>
                        <CustomTable columns={{
                            headings: ["User", "Message", "Date"],
                            items: logs.items.map(({email, message, date}) => [email, t(message), convertDate(date)])
                        }}/>
                        <div className={"d-flex justify-content-center"}>
                            <CustomPagination recordsCount={logs.pager.totalCount} pagination={pagination}
                                              setPagination={setPagination}/>
                        </div>
                    </div>
                    :
                    <NoDataComponent noDataText={t("noLogsToShow")}/>
                :
                <Spinner animation={"grow"}/>
            }
        </div>
    )
}