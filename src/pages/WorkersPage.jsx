import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import {AuthContext} from "../context/AuthContext";
import {defaultWorker} from "../utils/defaultValues";
import {useMutation} from "@tanstack/react-query";
import {deleteWorkerById, reassignWorkerById, saveWorker} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import {queryClient} from "../hooks/RestInterceptor";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import CustomSelect from "../componets/CustomSelect";
import {Button, Form, Modal} from "react-bootstrap";
import CommonInputText from "../componets/CommonInputText";
import CustomTable from "../componets/CustomTable";
import NoDataComponent from "../componets/NoDataComponent";
import {phonecodes} from "../utils/options";
import CustomPhoneInput from "../componets/CustomPhoneInput";
import {workType} from "../utils/enums";
import {faCheckCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {HotelContext} from "../context/HotelContext";

export default function WorkersPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [worker, setWorker] = useState(defaultWorker);
    const [workerId, setWorkerId] = useState();
    const [disableEmail, setDisableEmail] = useState(false);
    const [show, setShow] = useState(false);

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
            setWorker((prev) => ({...prev, hotelId: hotelId}));
            hotel.workers.sort((a, b) => a.id - b.id)
        }
    }, [hotelId, owner]);

    useEffect(() => {
        if (workerId && hotel) {
            const worker = hotel.workers.find((worker) => worker.id === workerId);
            setWorker(() => ({...worker, hotelId: hotelId}));
            setDisableEmail(() => true);
            setShow(true);
        }
    }, [workerId]);

    function clear() {
        setWorkerId(null);
        setWorker(() => ({...defaultWorker, hotelId: hotelId}));
        setDisableEmail(() => false);
        setShow(false);
    }

    const {mutate} = useMutation({
        mutationFn: saveWorker,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
            clear();
        }
    });

    const {mutate: deleteWork} = useMutation({
        mutationFn: deleteWorkerById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    const {mutate: reassignWorker} = useMutation({
        mutationFn: reassignWorkerById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successReassign")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    function buttonHandler(worker) {
        worker.firedDate ? reassignWorker(worker.id) : deleteWork(worker.id)
    }

    function buttonIcon(worker) {
        return worker.firedDate ? faCheckCircle : faTrash
    }

    function isDisabled(worker) {
        return !!worker.firedDate
    }

    function save(event) {
        event.preventDefault();
        mutate(worker);
    }

    function splitPhone() {
        let countryCode;
        let phoneNumber;
        worker.phone !== "" && phonecodes.forEach(country => {
            if (worker.phone.startsWith(country.label)) {
                countryCode = country.label;
                phoneNumber = worker.phone.slice(country.label.length);
            }
        });
        return phoneNumber && countryCode ? {countryCode, phoneNumber} : {countryCode: "+359", phoneNumber: ""};
    }

    return (
        (owner || workerHotel) && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("workers")}/>
                {((owner && owner.hotels.length>0) || workerHotel)  ?
                    <div className={"px-2"}>
                        <div className={"d-flex justify-content-center m-3"}><Button className={"main-button"}
                                                                                     onClick={() => {setShow(true); setWorker(() =>({
                                                                                         ...defaultWorker,
                                                                                         hotelId: hotelId
                                                                                     }))}}>{t("Add worker")}</Button>
                        </div>
                        {workerHotel ? <div className={"mt-2"}></div> :
                        <div className={"w-25"}><CustomSelect
                            options={owner.hotels.map(({name, id}) => ({label: name, value: id}))}
                            label={t("Hotel")} setValue={setHotelId} defaultValue={hotelId}
                            setDefaultValue={() => setHotelId(owner.hotels[0].id)}/></div>}
                        <Modal size={"lg"} show={show} onHide={() => {
                            setShow(false);
                            clear();
                        }} centered>
                            <Modal.Header closeButton/>
                            <Modal.Body>
                                <div className={"mx-4 box h-100 px-2 pb-2"}>
                                    <Form id={"saveWorker"} onSubmit={save}>
                                        <CommonInputText name={"email"} label={t("email")}
                                                         setObjectValue={setWorker}
                                                         type={"email"} value={worker.email}
                                                         disabled={disableEmail}/>
                                        <CommonInputText name={"fullName"} label={t("fullName")}
                                                         setObjectValue={setWorker}
                                                         type={"text"} value={worker.fullName}/>
                                        <div className={"w-45"}><CustomSelect
                                            options={workType.map((worker) => ({
                                                label: t(worker),
                                                value: worker,
                                            }))}
                                            label={t("workerType")} name={"workerType"} setObjectValue={setWorker}
                                            defaultValue={worker.workerType}/></div>
                                        <CustomPhoneInput type={'text'} value={splitPhone()}
                                                          label={t('phone')} name={'phone'}
                                                          setObjectValue={setWorker}/>
                                    </Form>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className='d-flex justify-content-between'>
                                <Button form={"saveWorker"} className={"main-button mt-4"}
                                        type={"submit"}>{t("save")}</Button>
                                <Button className={"close-button mt-4"}
                                        onClick={clear}>{t("close")}</Button>
                            </Modal.Footer>
                        </Modal>
                        <div className={"w-100"}>
                            {hotel && hotel.workers.length > 0 &&
                                <CustomTable
                                    darkHeader={false}
                                    viewComponent={setWorkerId}
                                    tableData={hotel.workers}
                                    columns={{
                                        headings: ["Name", "Email", "Phone", "WorkType", "registrationDate", "firedDate", "Action"],
                                        items: hotel.workers.map(({
                                                                      fullName,
                                                                      email,
                                                                      phone,
                                                                      registrationDate,
                                                                      firedDate,
                                                                      workerType
                                                                  }) => [fullName, email, phone, t(workerType), registrationDate, firedDate])
                                    }}
                                    onAction={buttonHandler}
                                    actionIcon={buttonIcon}
                                    disabled={isDisabled}
                                />}
                        </div>
                    </div>
                    : <NoDataComponent sentence={"first add hotel"}/>
                }
            </div>
        </div>
    )
}