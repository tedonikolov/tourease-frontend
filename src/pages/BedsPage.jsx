import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import {AuthContext} from "../context/AuthContext";
import {defaultBed} from "../utils/defaultValues";
import {useMutation} from "@tanstack/react-query";
import {deleteBedById, saveBed} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import {queryClient} from "../hooks/RestInterceptor";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import CustomSelect from "../componets/CustomSelect";
import {Button, Form} from "react-bootstrap";
import CommonInputText from "../componets/CommonInputText";
import CustomTable from "../componets/CustomTable";
import NoDataComponent from "../componets/NoDataComponent";
import {currencyOptions} from "../utils/options";

export default function BedsPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, ownerLoading} = useContext(AuthContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [bed, setBed] = useState(defaultBed);
    const [bedId, setBedId] = useState();

    useEffect(() => {
        if (owner && hotelId) {
            let hotel = owner.hotels.find((hotel) => hotel.id === hotelId);

            setHotel(() => hotel);
            setBed((prev) => ({...prev, hotelId: hotelId}));
            hotel.beds.sort((a, b) => a.id - b.id)
        }
    }, [hotelId, owner]);

    useEffect(() => {
        if (bedId && hotel) {
            const bed = hotel.beds.find((bed) => bed.id === bedId);
            setBed(() => ({...bed, hotelId: hotelId}));
        }
    }, [bedId]);

    function clear() {
        setBedId(null)
        setBed(() => ({...defaultBed, hotelId: hotelId}))
    }

    const {mutate} = useMutation({
        mutationFn: saveBed,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", owner.email]});
        }
    });

    const {mutate: deleteBed} = useMutation({
        mutationFn: deleteBedById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", owner.email]});
        }
    });

    function save(event) {
        event.preventDefault();
        mutate(bed)
    }

    return (
        !ownerLoading && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Beds")}/>
                {owner.hotels ?
                    <div className={"px-2"}>
                        <div className={"w-25"}><CustomSelect
                            options={owner.hotels.map(({name, id}) => ({label: name, value: id}))}
                            label={t("Hotel")} setValue={setHotelId} defaultValue={owner.hotels[0].id}
                            setDefaultValue={() => setHotelId(owner.hotels[0].id)}/></div>
                        {hotel && <div className={"d-flex"}>
                            <div className={"mx-4 w-50 box h-100 px-2 pb-2"}>
                                <Form onSubmit={save}>
                                    <CommonInputText name={"name"} label={t("name")} setObjectValue={setBed}
                                                     type={"text"} value={bed.name}/>
                                    <CommonInputText name={"people"} label={t("people")} setObjectValue={setBed}
                                                     type={"number"} value={bed.people}/>
                                    <CommonInputText name={"price"} label={t("price")} setObjectValue={setBed}
                                                     type={"number"} value={bed.price}/>
                                    <div className={"w-45"}><CustomSelect
                                        options={currencyOptions.map((currency) => ({label: t(currency.label), value: currency.value, image:currency.image}))}
                                        label={t("Currency")} name={"currency"} setObjectValue={setBed}
                                        defaultValue={bed.currency} isClearable={true}/></div>
                                    <div className={"d-flex justify-content-between"}>
                                        <Button className={"main-button mt-4"} type={"submit"}>{t("save")}</Button>
                                        <Button className={"close-button mt-4"} onClick={clear}>{t("clear")}</Button>
                                    </div>
                                </Form>
                            </div>
                            <div className={"w-100"}>
                                {hotel && hotel.beds.length > 0 &&
                                    <CustomTable
                                        darkHeader={false}
                                        viewComponent={setBedId}
                                        tableData={hotel.beds}
                                        columns={{
                                            headings: ["Name", "People", "Price", "Delete"],
                                            items: hotel.beds.map(({
                                                                       name,
                                                                       people,
                                                                       price,
                                                                       currency
                                                                   }) => [name, people, price + " " + currency])
                                        }}
                                        onDelete={deleteBed}
                                    />}
                            </div>
                        </div>}
                    </div>
                    : <NoDataComponent sentence={t("first add hotel")}/>
                }
            </div>
        </div>
    )
}