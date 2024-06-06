import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import Header from "../componets/Header";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../context/AuthContext";
import {SideBarContext} from "../context/SideBarContext";
import {useMutation, useQuery} from "@tanstack/react-query";
import {cancelReservation, getReservations, giveRating} from "../hooks/core";
import CustomPagination from "../componets/CustomPagination";
import NoDataComponent from "../componets/NoDataComponent";
import {Button, Card, CardBody, Modal, Spinner} from "react-bootstrap";
import CustomPageSizeSelector from "../componets/CustomPageSizeSelector";
import checkStars, {checkRating} from "../utils/checkStars";
import {Flag} from "@mui/icons-material";
import dayjs from "dayjs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faXmark} from "@fortawesome/free-solid-svg-icons";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import {defaultReservationsFilter} from "../utils/defaultValues";
import ReservationsFilter from "../componets/ReservationsFilter";

export default function UserReservationsPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {loggedUser} = useContext(AuthContext);
    const {sideBarVisible} = useContext(SideBarContext);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState();
    const [reservationsFilter, setReservationsFilter] = useState(defaultReservationsFilter);
    const [showFilter, setShowFilter] = useState(false);
    const [hotels, setHotels] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 25
    });

    const {data: reservations, isLoading, isPending} = useQuery({
        queryKey: ["get reservations for user", loggedUser.id, reservationsFilter, pagination.page, pagination.pageSize],
        queryFn: () => getReservations(loggedUser.id, reservationsFilter, pagination.page, pagination.pageSize),
        retry: false,
        staleTime: 5000,
        enabled: reservationsFilter.checkIn !== "Invalid Date" && reservationsFilter.creationDate !== "Invalid Date"
    });

    const {mutate:cancel} = useMutation({
        mutationFn: cancelReservation,
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservations for user", loggedUser.id]});
            toast.success(<CustomToastContent content={[t("successCancelled")]}/>);
        }
    });

    const {mutate:rate} = useMutation({
        mutationFn: () => giveRating(rating),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get reservations for user", loggedUser.id]});
            toast.success(<CustomToastContent content={[t("successRated")]}/>);
            setShowRating(false);
        }
    });

    const textAreaRef = useRef(null);

    const handleInput = (e) => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "120px";
            textAreaRef.current.style.height = `${e.target.scrollHeight - 16}px`;
        }
    };

    useEffect(() => {
        if (hotels.length === 0 && reservations) {
            const hotelSet = new Set(hotels);
            reservations.items.forEach((reservation) => {
                hotelSet.add(reservation.hotel.name);
            });
            setHotels(Array.from(hotelSet));
        }
    }, [reservations]);

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Reservations")}/>
                <div className={"d-flex mx-2 align-items-center justify-content-center"}>
                    {!isLoading && !isPending && reservations.items.length > 0 ?
                        <CustomPagination recordsCount={reservations.pager.totalCount} setPagination={setPagination}
                                          pagination={pagination}/>
                        : <Spinner animation={"grow"}/>}
                    <CustomPageSizeSelector value={pagination.pageSize} setValue={setPagination}/>
                    <Button className={"login-button"} onClick={() => setShowFilter(true)}>{t("filter")}</Button>
                </div>
                {!isLoading && !isPending ? reservations.items.length > 0 ?
                            reservations.items.map((reservation) =>
                                <Card
                                    key={reservation.id} className='w-100 py-0'>
                                    <CardBody aria-disabled={true} className={` 
                                        ${reservation.status === 'PENDING' ? 'warning' : reservation.status === 'FINISHED' ? 'info' : reservation.status === 'CANCELLED' || reservation.status === 'NO_SHOW' ? 'danger' : 'success'}`}
                                    >
                                        <div className={"d-flex w-100 justify-content-between align-items-center"}>
                                            <div className={"d-flex flex-column w-70"}>
                                                <div className={"w-100"}><h5>{reservation.reservationNumber}</h5></div>
                                                <div className={"w-100"}><h5>{dayjs(reservation.creationDate).format("DD-MM-YYYY")}</h5></div>
                                            </div>
                                            <div className={"d-flex w-70"}>
                                                {checkStars(reservation.hotel.stars)}
                                                <h5>{reservation.hotel.name}</h5>
                                            </div>
                                            <div className={"align-self-center w-100"}>
                                                <div>
                                                    <h6>{t("checkIn") + ": " + dayjs(reservation.checkIn).format("DD-MM-YYYY")}</h6>
                                                </div>
                                                <div>
                                                    <h6>{t("checkOut") + ": " + dayjs(reservation.checkOut).format("DD-MM-YYYY")}</h6>
                                                </div>
                                            </div>
                                            <div className={"w-60 align-content-center"}>
                                                <Flag/>
                                                {" " + reservation.hotel.country + ", " + reservation.hotel.city + ", " + reservation.hotel.address}
                                            </div>
                                            <div className={"align-self-center w-60 mx-2"}>
                                                <div>
                                                    <h6>{t("status") + ": "}{t(reservation.status === "CONFIRMED" ? "APPROVED" : reservation.status  === "ACCOMMODATED" ? "SETTLED" : reservation.status)}</h6>
                                                </div>
                                                <div>
                                                    <h6>{t("price") + ": " + reservation.price + " " + reservation.currency}</h6>
                                                </div>
                                            </div>
                                            <div className={"align-self-center mx-3"}>
                                                {reservation.status !== "FINISHED" && reservation.status !== "ACCOMMODATED" ?
                                                    <Button className={"delete-button"} disabled={reservation.status === "CANCELLED" || reservation.status === "NO_SHOW"} onClick={()=>cancel(reservation.id)}>
                                                        <FontAwesomeIcon icon={faXmark}/>
                                                    </Button>
                                                    :
                                                    <Button className={"icon-button"} disabled={reservation.status === "ACCOMMODATED"}
                                                            onClick={()=>{setRating( () => ({...reservation.rating, reservationId: reservation.id, hotelId: reservation.hotel.id})); setShowRating(true);}}>
                                                        <FontAwesomeIcon icon={faStar}/>
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )
                        :
                        <NoDataComponent sentence={"noReservationsToShow"}/>
                    :
                    <Spinner animation={"grow"}/>
                }
                {rating && <Modal show={showRating} onHide={() => {
                    setShowRating(false)
                    setRating(null)
                }} size={"lg"}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t("rating")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"d-flex"}>
                            <div className={"w-50 align-content-center text-center"}>
                                <input type="range"
                                       defaultValue={1}
                                       min={1}
                                       max={10}
                                       step={0.1}
                                       onChange={(e) => setRating(()=>({...rating, rate: e.target.value}))}
                                       value={rating.rate}
                                />
                                <span className={"slider-current-value"}>{rating.rate}</span>
                                {checkRating(rating.rate)}
                            </div>
                            <div className={"w-50"}>
                                <textarea
                                    ref={textAreaRef}
                                    value={rating.comment}
                                    onChange={(e) => {setRating(()=>({...rating, comment: e.target.value}));
                                        }}
                                    onInput={handleInput}
                                    placeholder={t("comment")}/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={"d-flex justify-content-between"}>
                        <Button className={"login-button"} disabled={rating.rate === undefined || rating.comment === "" || rating.comment === undefined || rating.id!== undefined}
                                onClick={rate}>{t("save")}</Button>
                        <Button className={"close-button"}
                                onClick={() => {
                                    setShowRating(false)
                                    setRating(null)
                                }}>{t("close")}</Button>
                    </Modal.Footer>
                </Modal>}
                {showFilter && <Modal show={showFilter} onHide={() => {
                    setShowFilter(false)
                }} size={"lg"}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t("filter")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReservationsFilter reservationsFilter={reservationsFilter} setReservationsFilter={setReservationsFilter}
                            hotels={hotels}/>
                    </Modal.Body>
                    <Modal.Footer className={"d-flex justify-content-end"}>
                        <Button className={"close-button"}
                                onClick={() => {
                                    setReservationsFilter(defaultReservationsFilter)
                                }}>{t("clear")}</Button>
                        <Button className={"button"}
                                onClick={() => {
                                    setShowFilter(false)
                                }}>{t("close")}</Button>
                    </Modal.Footer>
                </Modal>}
            </div>
        </div>
    )
}