import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import {AuthContext} from "../context/AuthContext";
import {defaultType} from "../utils/defaultValues";
import {useMutation} from "@tanstack/react-query";
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
import {deleteTypeById, saveType} from "../hooks/hotel";
import {HotelContext} from "../context/HotelContext";

export default function TypesPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [type, setType] = useState(defaultType);
    const [typeId, setTypeId] = useState();
    const [bedsOptions, setBedsOptions] = useState();

    useEffect(() => {
        if(workerHotel){
            setHotelId(()=>workerHotel.id);
            setHotel(()=>workerHotel);
        }
    }, [workerHotel]);

    useEffect(() => {
        if (owner && hotelId) {
            let hotel = owner.hotels.find((hotel) => hotel.id === hotelId);
            setHotel(() => hotel);
            setType((prev) => ({...prev, hotelId: hotelId}));
            hotel.types.sort((a, b) => a.id - b.id);
            setBedsOptions(() => hotel.beds.map((bed) => {
                return {label: bed.name, value: bed.id}
            }));
        }
    }, [hotelId, owner]);

    useEffect(() => {
        if (typeId && hotel) {
            const type = hotel.types.find((type) => type.id === typeId);
            setType(() => ({
                id: type.id,
                name: type.name,
                price: type.price,
                currency: type.currency,
                beds: type.beds.map(bed => {
                    return bed.id
                }),
                hotelId: hotelId
            }));
        }
    }, [typeId]);

    function clear() {
        setTypeId(null)
        setType(() => ({...defaultType, hotelId: hotelId}))
    }

    const {mutate} = useMutation({
        mutationFn: saveType,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    const {mutate: deleteType} = useMutation({
        mutationFn: deleteTypeById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    function save(event) {
        event.preventDefault();
        mutate(type)
    }

    function handleBeds(event) {
        let beds = type.beds.slice(0);
        beds.push(event.value);
        let price = 0;

        beds.forEach((id) => price += hotel.beds.find((bed) => id === bed.id).price)

        setType((prevValue) => ({
            ...prevValue,
            price: price,
            beds: beds
        }));
    }

    function removeBed(index) {
        let beds = type.beds.toSpliced(index, 1);
        let price = 0;

        beds.forEach((id) => price += hotel.beds.find((bed) => id === bed.id).price)

        setType((prevValue) => ({
            ...prevValue,
            price: price,
            beds: beds
        }));
    }

    return (
        (owner || workerHotel) && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Types")}/>
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
                                    <CommonInputText name={"name"} label={t("name")} setObjectValue={setType}
                                                     type={"text"} value={type.name}/>
                                    <CustomSelect
                                        options={bedsOptions} required={type.beds.length === 0}
                                        label={t("Beds")} handleSelect={handleBeds}
                                        isClearable={true}/>
                                    <select className={"w-100"} multiple={true}>{type.beds.map((bed, index) =>
                                        <option key={index}
                                                onClick={() => removeBed(index)}>{bedsOptions.find((option) => option.value === bed).label}</option>
                                    )}</select>
                                    <CommonInputText name={"price"} label={t("price")} setObjectValue={setType}
                                                     type={"number"} value={type.price}/>
                                    <div className={"w-45"}><CustomSelect
                                        options={currencyOptions.map((currency) => ({
                                            label: t(currency.label),
                                            value: currency.value,
                                            image: currency.image
                                        }))}
                                        label={t("Currency")} name={"currency"} setObjectValue={setType}
                                        defaultValue={type.currency} isClearable={true}/></div>
                                    <div className={"d-flex justify-content-between"}>
                                        <Button className={"main-button mt-4"} type={"submit"}>{t("save")}</Button>
                                        <Button className={"close-button mt-4"} onClick={clear}>{t("clear")}</Button>
                                    </div>
                                </Form>
                            </div>
                            <div className={"w-100"}>
                                {hotel && hotel.types.length > 0 &&
                                    <CustomTable
                                        darkHeader={false}
                                        viewComponent={setTypeId}
                                        tableData={hotel.types}
                                        columns={{
                                            headings: ["Name", "Beds", "Price", "Delete"],
                                            items: hotel.types.map(({
                                                                        name,
                                                                        price,
                                                                        currency,
                                                                        beds
                                                                    }) => [name, beds.map((bed) => {
                                                return bed.name + "|"
                                            }), price + " " + currency])
                                        }}
                                        onDelete={deleteType}
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