import Navigation from "../componets/Navigation";
import SideBar from "../componets/SideBar";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import {AuthContext} from "../context/AuthContext";
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

export default function FacilitiesPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, ownerLoading} = useContext(AuthContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [facility, setFacility] = useState(defaultFacility);
    const [facilityId, setFacilityId] = useState(defaultFacility);
console.log(facility)
    useEffect(() => {
        if (hotelId) {
            setHotel(() => owner.hotels.find((hotel) => hotel.id === hotelId))
            setFacility((prev)=>({...prev,hotelId:hotelId}))
        }
    }, [hotelId]);

    useEffect(() => {
        if(owner) {
            setHotel(() => owner.hotels.find((hotel) => hotel.id === hotelId))
            setFacility((prev) => ({...prev, hotelId: hotelId}))
        }
    }, [owner]);

    useEffect(() => {
        facilityId && hotel && setFacility(()=>hotel.facilities.find((facility)=>facility.id===facilityId))
    }, [facilityId]);

    useEffect(() => {
        if(facility.name===null){
            setFacilityId(null)
            setFacility(()=>defaultFacility)
        }
    }, [facility.name]);

    const {mutate}=useMutation({
        mutationFn:saveFacility,
        onSuccess:()=>{
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", hotel.owner.email]});
        }
    });

    const {mutate:deleteFacility}=useMutation({
        mutationFn:deleteFacilityById,
        onSuccess:()=>{
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", hotel.owner.email]});
        }
    });

    function save(event){
        event.preventDefault();
        mutate(facility)
    }

    return (
        !ownerLoading && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Facilities")}/>
                {owner.hotels &&
                    <div className={"px-2"}>
                        <div className={"w-25"}><CustomSelect
                            options={owner.hotels.map(({name, id}) => ({label: name, value: id}))}
                            label={t("Hotel")} setValue={setHotelId} defaultValue={owner.hotels[0].id}
                            setDefaultValue={() => setHotelId(owner.hotels[0].id)}/></div>
                        {hotel && <div className={"d-flex"}>
                            <div className={"mx-4 w-50 box h-100 px-2 pb-2"}>
                                <Form onSubmit={save}>
                                    <div className={"w-75"}><CustomSelect
                                        options={facilitiesNames.map((name) => ({label: t(name), value: name}))}
                                        label={t("Facility")} name={"name"} setObjectValue={setFacility}
                                        defaultValue={facility.name} isClearable={true}/></div>
                                    <CustomCheckBox name={"paid"} label={t("paid")} setObjectValue={setFacility}
                                                     type={"checkbox"} value={facility.paid}/>
                                    <CommonInputText name={"price"} label={t("price")} setObjectValue={setFacility}
                                                     type={"number"} value={facility.price}/>
                                    <div className={"d-flex justify-content-end"}><Button className={"main-button mt-4"} type={"submit"}>{t("save")}</Button></div>
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
                                                                             price
                                                                         }) => [t(name), paid, price])
                                        }}
                                        onDelete={deleteFacility}
                                    />}
                            </div>
                        </div>}
                    </div>}
            </div>
        </div>
    )
}