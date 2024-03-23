import Navigation from "../componets/Navigation";
import SideBar from "../componets/SideBar";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import Header from "../componets/Header";
import CustomTable from "../componets/CustomTable";
import CustomSelect from "../componets/CustomSelect";
import {facilitiesNames} from "../utils/enums";
import {Button, Form} from "react-bootstrap";
import {defaultFacility} from "../utils/defaultValues";
import CommonInputText from "../componets/CommonInputText";
import CustomCheckBox from "../componets/CustomCheckBox";
import {useMutation} from "@tanstack/react-query";
import {deleteFacilityById, saveFacility} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import {queryClient} from "../hooks/RestInterceptor";
import NoDataComponent from "../componets/NoDataComponent";
import {currencyOptions} from "../utils/options";
import {HotelContext} from "../context/HotelContext";
import {AuthContext} from "../context/AuthContext";

export default function FacilitiesPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [facility, setFacility] = useState(defaultFacility);
    const [facilityId, setFacilityId] = useState();
    const [facilityOptions, setFacilityOptions] = useState(facilitiesNames);

    useEffect(() => {
        if(workerHotel){
            setHotelId(()=>workerHotel.id);
            setHotel(()=>workerHotel);
        }
    }, [workerHotel]);

    useEffect(() => {
        if (owner && hotelId) {
            let hotel = owner.hotels.find((hotel) => hotel.id === hotelId);
            setHotel(() => hotel)
            setFacility((prev) => ({...prev, hotelId: hotelId}))
            hotel.facilities.length > 0 && setFacilityOptions(() => facilitiesNames.filter((facility) => !hotel.facilities.find((savedFacility) => savedFacility.name === facility)).map((name) => ({
                label: t(name),
                value: name
            })))
            hotel.facilities.sort((a, b) => a.id - b.id)
        }
    }, [owner, hotelId]);

    useEffect(() => {
        if (facilityId && hotel) {
            const facility = hotel.facilities.find((facility) => facility.id === facilityId);
            facilityOptions.push({label: t(facility.name), value: facility.name})
            setFacility(() => ({...facility, hotelId: hotelId}));
        }
    }, [facilityId]);

    useEffect(() => {
        if (facility.name === null) {
            setFacilityId(null)
            setFacility(() => ({...defaultFacility, hotelId: hotelId}))
            hotel.facilities.length > 0 && setFacilityOptions(() => facilitiesNames.filter((facility) => !hotel.facilities.find((savedFacility) => savedFacility.name === facility)).map((name) => ({
                label: t(name),
                value: name
            })))
        }
    }, [facility.name]);

    const {mutate} = useMutation({
        mutationFn: saveFacility,
        onSuccess:  () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    const {mutate: deleteFacility} = useMutation({
        mutationFn: deleteFacilityById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    function save(event) {
        event.preventDefault();
        mutate(facility)
    }

    return (
        (owner || workerHotel) && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Facilities")}/>
                {((owner && owner.hotels.length>0) || workerHotel) ?
                    <div className={"px-2"}>
                        {workerHotel ? <div className={"mt-2"}></div> :
                            <div className={"w-25"}><CustomSelect
                            options={owner.hotels.map(({name, id}) => ({label: name, value: id}))}
                            label={t("Hotel")} setValue={setHotelId} defaultValue={hotelId}
                            setDefaultValue={() => setHotelId(owner.hotels[0].id)}/></div>}
                        {hotel && <div className={"d-flex"}>
                            <div className={"mx-4 w-50 box h-100 px-2 pb-2"}>
                                <Form onSubmit={save}>
                                    <div className={"w-75"}><CustomSelect
                                        options={facilityOptions}
                                        label={t("Facility")} name={"name"} setObjectValue={setFacility}
                                        defaultValue={facility.name} isClearable={true}/></div>
                                    <CustomCheckBox name={"paid"} label={t("paid")} setObjectValue={setFacility}
                                                    type={"checkbox"} value={facility.paid}/>
                                    <CommonInputText name={"price"} label={t("price")} setObjectValue={setFacility}
                                                     type={"number"} value={facility.price}/>
                                    <div className={"w-45"}><CustomSelect
                                        options={currencyOptions.map((currency) => ({label: t(currency.label), value: currency.value, image:currency.image}))}
                                        label={t("Currency")} name={"currency"} setObjectValue={setFacility}
                                        defaultValue={facility.currency} isClearable={true}/></div>
                                    <div className={"d-flex justify-content-end"}><Button className={"main-button mt-4"}
                                                                                          type={"submit"}>{t("save")}</Button>
                                    </div>
                                </Form>
                            </div>
                            <div className={"w-100"}>
                                {hotel && hotel.facilities.length > 0 &&
                                    <CustomTable
                                        darkHeader={false}
                                        viewComponent={setFacilityId}
                                        tableData={hotel.facilities}
                                        columns={{
                                            headings: ["Name", "Paid", "Price", "Delete"],
                                            items: hotel.facilities.map(({
                                                                             name,
                                                                             paid,
                                                                             price,
                                                                             currency
                                                                         }) => [t(name), paid, price + " " + currency])
                                        }}
                                        onDelete={deleteFacility}
                                    />}
                            </div>
                        </div>}
                    </div>
                    : <NoDataComponent sentence={"first add hotel"}/>
                }
            </div>
        </div>
    )
}