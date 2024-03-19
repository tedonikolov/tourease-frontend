import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import {AuthContext} from "../context/AuthContext";
import {defaultRoom} from "../utils/defaultValues";
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
import {deleteRoomById, saveRoom} from "../hooks/hotel";
import {HotelContext} from "../context/HotelContext";

export default function RoomsPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [room, setRoom] = useState(defaultRoom);
    const [roomId, setRoomId] = useState();
    const [typesOptions, setTypesOptions] = useState();

    useEffect(() => {
        if(workerHotel){
            setHotelId(()=>workerHotel.id);
            setHotel(()=>workerHotel);
            setTypesOptions(() => workerHotel.types.map((type) => {
                return {label: type.name, value: type.id}
            }));
        }
    }, [workerHotel]);

    useEffect(() => {
        if (owner && hotelId) {
            let hotel = owner.hotels.find((hotel) => hotel.id === hotelId);
            setHotel(() => hotel);
            setRoom((prev) => ({...prev, hotelId: hotelId}));
            hotel.rooms.sort((a, b) => {
                    let regExp = /[a-zA-Z]/g;
                    if (regExp.test(a.name))
                        return -1
                    return a.name - b.name
                }
            );
            setTypesOptions(() => hotel.types.map((type) => {
                return {label: type.name, value: type.id}
            }));
        }
    }, [hotelId, owner]);

    useEffect(() => {
        if (roomId && hotel) {
            const room = hotel.rooms.find((room) => room.id === roomId);
            setRoom(() => ({
                id: room.id,
                name: room.name,
                types: room.types.map(type => {
                    return type.id
                }),
                hotelId: hotelId
            }));
        }
    }, [roomId]);

    function clear() {
        setRoomId(null)
        setRoom(() => ({...defaultRoom, hotelId: hotelId}))
    }

    const {mutate} = useMutation({
        mutationFn: saveRoom,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    const {mutate: deleteRoom} = useMutation({
        mutationFn: deleteRoomById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    function save(event) {
        event.preventDefault();
        mutate(room)
    }

    function calcPeople(beds) {
        {
            let sum = 0;
            beds.forEach(bed => sum += bed.people);
            return sum;
        }
    }

    function handleTypes(event) {
        console.log(event)

        setRoom((prevValue) => ({
            ...prevValue,
            types: event.map(({value})=>value)
        }));
    }

    return (
        (owner || workerHotel) && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Rooms")}/>
                {((owner && owner.hotels.length>0) || workerHotel) ?
                    <div className={"px-2"}>
                        {workerHotel ? <div className={"mt-2"}></div> :
                        <div className={"w-25"}><CustomSelect
                            options={owner.hotels.map(({name, id}) => ({label: name, value: id}))}
                            label={t("Hotel")} setValue={setHotelId} defaultValue={owner.hotels[0].id}
                            setDefaultValue={() => setHotelId(owner.hotels[0].id)}/></div>}
                        {hotel && <div className={"d-flex"}>
                            <div className={"mx-4 w-50 box h-100 px-2 pb-2"}>
                                <Form onSubmit={save}>
                                    <CommonInputText name={"name"} label={t("number")} setObjectValue={setRoom}
                                                     type={"text"} value={room.name}/>
                                    <CustomSelect
                                        options={typesOptions}
                                        label={t("Type")} handleSelect={handleTypes} isMulti={true}
                                        isClearable={true} defaultValue={room.types} name={"types"}/>
                                    <div className={"d-flex justify-content-between"}>
                                        <Button className={"main-button mt-4"} type={"submit"}>{t("save")}</Button>
                                        <Button className={"close-button mt-4"} onClick={clear}>{t("clear")}</Button>
                                    </div>
                                </Form>
                            </div>
                            <div className={"w-100"}>
                                {hotel && hotel.rooms.length > 0 &&
                                    <CustomTable
                                        darkHeader={false}
                                        viewComponent={setRoomId}
                                        tableData={hotel.rooms}
                                        columns={{
                                            headings: ["Number", "Name", "Price", "People", "Delete"],
                                            items: hotel.rooms.map(({
                                                                        name,
                                                                        types
                                                                    }) => [name, types.map((type, index) => {
                                                return (index !== 0 ? "|" : "") + type.name
                                            }), types.map((type, index) => {
                                                return (index !== 0 ? "|" : "") + type.price + " " + type.currency
                                            }), types.map((type, index) => {
                                                return (index !== 0 ? "|" : "") + calcPeople(type.beds)
                                            })
                                            ])
                                        }}
                                        onDelete={deleteRoom}
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