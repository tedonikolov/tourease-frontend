import CustomTable from "../componets/CustomTable";
import Header from "../componets/Header";
import {useQuery} from "@tanstack/react-query";
import {getChronologyTypes, getLogs} from "../hooks/admin";
import React, {useContext, useState} from "react";
import dayjs from "dayjs";
import CommonInputText from "../componets/CommonInputText";
import CustomDatePicker from "../componets/CustomDatePicker";
import CustomSelect from "../componets/CustomSelect";
import {useTranslation} from "react-i18next";
import CustomPagination from "../componets/CustomPagination";
import CustomPageSizeSelector from "../componets/CustomPageSizeSelector";
import NoDataComponent from "../componets/NoDataComponent";
import {Spinner} from "react-bootstrap";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import {SideBarContext} from "../context/SideBarContext";

export default function LogsPage() {
    const [t] = useTranslation("translation", {keyPrefix: 'logs'});
    const {t: common} = useTranslation("translation", {keyPrefix: 'common'});
    const { sideBarVisible } = useContext(SideBarContext);

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

    function split(message){
        const list = message.split(":");
        return list.length>1 ? t(message.split(":")[0])+":"+message.split(":")[1] : t(message)
    }

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='d-flex content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Chronology")}/>
                <div>
                    <div className={"d-flex justify-content-between"}>
                        <div className={"d-flex m-2"}>
                            <div className={"mx-4"}><CustomDatePicker label={common("fromDate")}
                                                                      setValue={setChronologyFilter}
                                                                      name={"createdAfter"}/></div>
                            <CustomDatePicker label={common("toDate")} setValue={setChronologyFilter}
                                              name={"createdBefore"}
                                              minDate={dayjs(chronologyFilter.createdAfter)}/>
                        </div>
                        <div className={"w-50 mt-3 mx-5"}>
                            <CustomSelect label={t("type")} name={"type"} setObjectValue={setChronologyFilter}
                                          isClearable={true} defaultValue={chronologyFilter.type}
                                          options={types ? types.map((type) => {
                                              return {value: type, label: t(type)}
                                          }) : []}/>
                        </div>
                    </div>
                    <div className={"d-flex w-100 justify-content-between"}>
                        <CustomPageSizeSelector value={pagination.pageSize} setValue={setPagination}/>
                        <CommonInputText label={common("user")} name={"email"} setObjectValue={setChronologyFilter}/>
                    </div>
                </div>
                {!isLoading && !isPending ? logs.items.length > 0 ?
                        <div className={"w-75 mx-5"}>
                            <CustomTable
                                tableData={logs.items}
                                columns={{
                                headings: ["User", "Message", "Date"],
                                items: logs.items.map(({email, message, date}) => [email, split(message), convertDate(date)])
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
        </div>
    )
}