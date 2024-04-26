import Header from "../componets/Header";
import {useTranslation} from "react-i18next";
import SideBar from "../componets/SideBar";
import Navigation from "../componets/Navigation";
import React, {createRef, useCallback, useContext, useEffect, useRef, useState} from "react";
import {SideBarContext} from "../context/SideBarContext";
import GoogleMapReact from "google-map-react";
import {useQuery} from "@tanstack/react-query";
import {getHotelListing} from "../hooks/hotel";
import {Accordion, Button, Image} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPointDown} from "@fortawesome/free-solid-svg-icons";
import checkStars, {checkRating} from "../utils/checkStars";
import Flags from "country-flag-icons/react/3x2";
import {countries} from "../utils/options";
import Carousel from "react-bootstrap/Carousel";
import TypesPreview from "../componets/TypesPreview";
import CustomStepWizardNav from "../componets/CustomStepWizardNav";
import StepWizard from "react-step-wizard";
import MealsPreview from "../componets/MealsPreview";

export default function MainRegularPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const apiKey = process.env["GOOGLE_KEY"];
    const [searchBy, setSearchBy] = useState();
    const [location, setLocation] = useState();
    const [zoom, setZoom] = useState(7);
    const [pageNumber, setPageNumber] = useState(1);
    const [hotels, setHotels] = useState([]);
    const [activeHotelId, setActiveHotelId] = useState();

    const accordionItemRefs = useRef({});
    hotels.forEach(hotel => {
        if (!accordionItemRefs.current[hotel.hotelId]) {
            accordionItemRefs.current[hotel.hotelId] = createRef();
        }
    });

    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const lastHotelElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, [hasMore]);

    const {data} = useQuery({
        queryKey: ["hotels", pageNumber],
        queryFn: () => getHotelListing(pageNumber),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
        retry: false,
        staleTime: 5000
    });

    useEffect(() => {
        if (data && data.pager.page < data.pager.pagesCount) {
            setHasMore(true);
        } else {
            setHasMore(false);
        }
        if(data) {
            setHotels(prevHotels => {
                return [...new Set([...prevHotels, ...data.items])];
            });
        }
    }, [data]);

    const Marker = () => (
        <div style={{
            zIndex: 100,
            color: 'red',
            transform: 'translate(-50%, -50%)',
            fontSize: '25px'
        }}>
            <FontAwesomeIcon icon={faHandPointDown}/>
        </div>
    );

    const Flag = ({countryCode}) => {
        const FlagComponent = Flags[countryCode.toUpperCase()];
        return <FlagComponent className={"w-30 border-black border-2 border"}/>;
    };

    useEffect(() => {
        setZoom(() => location ? 15 : 7);
    }, [location]);

    useEffect(() => {
        if (activeHotelId && accordionItemRefs.current[activeHotelId]) {
            accordionItemRefs.current[activeHotelId].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [activeHotelId]);

    return (
        <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Hotels")}/>
                <div className={"d-flex"}>
                    <div className={"w-50"}>
                        <input
                            className={"searchBy w-100"}
                            type={"text"}
                            value={searchBy}
                            placeholder={t("searchBy")}
                            onChange={(event) => setSearchBy(event.value)}
                            required
                        />
                        {hotels && hotels.length > 0 && <Accordion activeKey={activeHotelId} className={"scrollable-accordion"}>
                            {hotels.map((hotel, index) =>
                                <Accordion.Item ref={index === hotels.length - 5 ? lastHotelElementRef : null}
                                    key={hotel.hotelId} className='w-100 py-0' eventKey={hotel.hotelId}
                                                onClick={() => {setLocation(hotel.location); setActiveHotelId(()=>hotel.hotelId)}}>
                                    <Accordion.Header ref={accordionItemRefs.current[hotel.hotelId]}>
                                        <div className={"w-100"}>
                                            <div className='d-flex w-100 justify-content-between'>
                                                <div className={"w-60"}>
                                                    {checkStars(hotel.stars)}
                                                    <h5 className={"d-flex"}>{hotel.name}</h5>
                                                </div>
                                                <div className={""}>
                                                    <div className={"d-flex justify-content-between"}>
                                                        <div>{t("rating")+": "+hotel.rating}</div>
                                                        <div>({hotel.numberOfRates})</div>
                                                    </div>
                                                    <div className={"align-self-end"}>{checkRating(hotel.rating)}</div>
                                                </div>
                                            </div>
                                            <div className={"d-flex w-100 justify-content-between"}>
                                                {hotel && hotel.images.length > 0 && <Carousel className={"w-50"}>
                                                    {hotel.images.map((image, key) =>
                                                        <Carousel.Item key={key}>
                                                            <Image className={"hotel-listing-image"}
                                                                   src={image.startsWith("http") ? image : process.env.REACT_APP_API_URL + image}></Image>
                                                        </Carousel.Item>
                                                    )}
                                                </Carousel>}
                                                <div className={"w-30 align-content-center"}>
                                                    {countries.find((country)=> country.value===hotel.location.country) && <Flag countryCode={hotel && countries.find((country)=> country.value===hotel.location.country).code}/>}
                                                {" "+hotel.location.country + ", " + hotel.location.city + ", " + hotel.location.address}</div>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>

                                            <StepWizard
                                                className=''
                                                nav={<CustomStepWizardNav steps={[t('Room types'), t('Meal types')]} />}
                                                transitions={{
                                                    enterRight: '',
                                                    enterLeft: '',
                                                    exitRight: '',
                                                    exitLeft: '',
                                                }}
                                            >
                                                <TypesPreview types={hotel.types}/>
                                                <MealsPreview meals={hotel.meals}/>
                                            </StepWizard>
                                        <Button className={"w-100 register-button"}>{t("MakeReserve")}</Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}
                        </Accordion>}
                    </div>
                    <div className={"google-maps w-50"}>
                        <GoogleMapReact bootstrapURLKeys={{key: apiKey}}
                                        zoom={zoom} center={{
                            lat: location ? location.latitude : 42.550,
                            lng: location ? location.longitude : 25.616
                        }}
                                        onChildClick={(key) => {setActiveHotelId(()=> parseInt(key), 10) }}
                                        onChange={({zoom}) => setZoom(() => zoom)}
                        >
                            {hotels && hotels.map((hotel) =>
                                <Marker key={hotel.hotelId}
                                        lat={hotel.location.latitude}
                                        lng={hotel.location.longitude}
                                />
                            )}
                        </GoogleMapReact>
                    </div>
                </div>
            </div>
        </div>
    )
}