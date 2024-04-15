import CustomDatePicker from "./CustomDatePicker";
import React, {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {HotelContext} from "../context/HotelContext";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getFreeRoomCountByDatesForHotel} from "../hooks/hotel";
import {Table} from "react-bootstrap";

export default function FreeRoomsInfo() {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {workerHotel} = useContext(HotelContext);
    const [filter, setFilter] = useState({
        fromDate: dayjs(new Date()).format('YYYY-MM-DD'),
        toDate: dayjs(new Date()).add(8, 'day').format('YYYY-MM-DD'),
        hotelId: null
    });
    const [dates, setDates] = useState([]);

    useEffect(() => {
        if (workerHotel) {
            setFilter((prevValue) => ({
                ...prevValue,
                hotelId: workerHotel.id
            }))
        }
    }, [workerHotel]);

    useEffect(() => {
        if (filter) {
            let dateArray = [];
            let currentDate = dayjs(filter.fromDate);

            while (currentDate <= dayjs(filter.toDate)) {
                dateArray.push(currentDate.format('YYYY-MM-DD'));
                currentDate = currentDate.add(1, 'day');
            }

            setDates(() => dateArray);
        }
    }, [filter]);

    useEffect(() => {
        if (filter) {
            setFilter((prevValue) => ({
                ...prevValue,
                toDate: dayjs(filter.fromDate).add(8, 'day').format('YYYY-MM-DD')
            }))
        }
    }, [filter.fromDate]);

    useEffect(() => {
        if (filter) {
            setFilter((prevValue) => ({
                ...prevValue,
                fromDate: dayjs(filter.toDate).subtract(8, 'day').format('YYYY-MM-DD')
            }))
        }
    }, [filter.toDate]);

    const {data} = useQuery({
        queryKey: ["get all free room count for hotel", filter],
        queryFn: () => getFreeRoomCountByDatesForHotel(filter),
        enabled: filter.hotelId != null,
        retry: false,
        staleTime: 5000
    })

    return (
        <div className={"w-100"}>
            <div className={"d-flex justify-content-center"}>
                <div>
                    <CustomDatePicker label={t('fromDate')}
                                      selectedDate={filter.fromDate}
                                      name={'fromDate'}
                                      setValue={setFilter}/>
                </div>
                <div>
                    <CustomDatePicker label={t('toDate')}
                                      selectedDate={filter.toDate}
                                      name={'toDate'}
                                      setValue={setFilter}/>
                </div>
            </div>
            <h4 className={"mx-2"}>{t("Free rooms")}:</h4>
            {data && <div className={"box"}>
                <div>
                    <Table className={"table table-striped table-bordered m-0"}>
                        <thead>
                        <tr>
                            {[t("Type"), t("Count"), ...dates].map((column, index) => (
                                    <th key={index}>
                                        {column}
                                    </th>
                                )
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            <tr>
                                <td>
                                    {data[0].typesCount.map(({id, name}) => (
                                            <label className={"px-2 d-flex row"} key={id}>
                                                {name}
                                            </label>
                                        )
                                    )}
                                </td>
                                {data.map((row, itemIndex) => (
                                        <td key={itemIndex}>
                                            {row.typesCount.map((column) => (
                                                <label className={"px-2 d-flex row"} key={column.id}>
                                                    {column.count}
                                                </label>
                                            ))}
                                        </td>
                                    )
                                )}
                            </tr>
                        }
                        <tr>
                            <th>{t("Total")}</th>
                            {data.map((row, itemIndex) => (
                                    <td key={itemIndex}>
                                        {row.typesCount.reduce((acc, curr) => acc + curr.count, 0)}
                                    </td>
                                )
                            )}
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </div>}
        </div>
    )
}