import Navigation from "../componets/Navigation";
import SideBar from "../componets/SideBar";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SideBarContext} from "../context/SideBarContext";
import Header from "../componets/Header";
import CustomTable from "../componets/CustomTable";
import CustomSelect from "../componets/CustomSelect";
import {mealTypes} from "../utils/enums";
import {Button, Form} from "react-bootstrap";
import {defaultMeal} from "../utils/defaultValues";
import CommonInputText from "../componets/CommonInputText";
import {useMutation} from "@tanstack/react-query";
import {deleteMealById, saveMeal} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "../componets/CustomToastContent";
import {queryClient} from "../hooks/RestInterceptor";
import NoDataComponent from "../componets/NoDataComponent";
import {currencyOptions} from "../utils/options";
import {HotelContext} from "../context/HotelContext";
import {AuthContext} from "../context/AuthContext";
import {CurrencyContext} from "../context/CurrencyContext";

export default function MealsPage() {
    const {t} = useTranslation("translation", {keyPrefix: "common"});
    const {sideBarVisible} = useContext(SideBarContext);
    const {owner, workerHotel} = useContext(HotelContext);
    const {loggedUser} = useContext(AuthContext);
    const {currency} = useContext(CurrencyContext);
    const [hotelId, setHotelId] = useState();
    const [hotel, setHotel] = useState();
    const [meal, setMeal] = useState({...defaultMeal, currency: currency});
    const [mealId, setMealId] = useState();
    const [mealOptions, setMealOptions] = useState(mealTypes.map((type) => ({label: t(type), value: type})));

    useEffect(() => {
        if(workerHotel){
            setMeal((prev) => ({...prev, hotelId: workerHotel.id}));
            workerHotel.meals.length > 0 && setMealOptions(() => mealTypes.filter((meal) => !workerHotel.meals.find((savedMeal) => savedMeal.type === meal)).map((type) => ({
                label: t(type),
                value: type
            })))
            workerHotel.meals.sort((a, b) => a.id - b.id);
            setHotelId(()=>workerHotel.id);
            setHotel(()=>workerHotel);
        }
    }, [workerHotel]);

    useEffect(() => {
        if (owner && hotelId) {
            let hotel = owner.hotels.find((hotel) => hotel.id === hotelId);
            setHotel(() => hotel);
            setMeal((prev) => ({...prev, hotelId: hotelId}));
            hotel.meals.length > 0 && setMealOptions(() => mealTypes.filter((meal) => !hotel.meals.find((savedMeal) => savedMeal.type === meal)).map((type) => ({
                label: t(type),
                value: type
            })))
            hotel.meals.sort((a, b) => a.id - b.id);
        }
    }, [owner, hotelId, hotel]);

    useEffect(() => {
        if (mealId && hotel) {
            const meal = hotel.meals.find((meal) => meal.id === mealId);
            mealOptions.push({label: t(meal.type), value: meal.type});
            setMeal(() => ({...meal, hotelId: hotelId}));
        }
    }, [mealId]);

    useEffect(() => {
        if (meal.type === null) {
            setMealId(null)
            setMeal(() => ({...defaultMeal, hotelId: hotelId}))
            hotel.meals.length > 0 && setMealOptions(() => mealTypes.filter((meal) => !hotel.meals.find((savedMeal) => savedMeal.type === meal)).map((type) => ({
                label: t(type),
                value: type
            })))
        }
    }, [meal.type]);

    const {mutate} = useMutation({
        mutationFn: saveMeal,
        onSuccess:  () => {
            toast.success(<CustomToastContent content={[t("successUpdate")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    const {mutate: deleteMeal} = useMutation({
        mutationFn: deleteMealById,
        onSuccess: () => {
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
            queryClient.resetQueries({queryKey: ["get owner", loggedUser.email]});
            queryClient.resetQueries({queryKey: ["get worker", loggedUser.email]});
        }
    });

    function save(event) {
        event.preventDefault();
        mutate(meal)
    }

    return (
        (owner || workerHotel) && <div className={`d-flex page ${sideBarVisible && 'sidebar-active'} w-100`}>
            <SideBar>
                <Navigation/>
            </SideBar>
            <div className='content-page flex-column justify-content-start align-items-start w-100'>
                <Header title={t("Meals")}/>
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
                                        options={mealOptions}
                                        label={t("Meal")} name={"type"} setObjectValue={setMeal}
                                        defaultValue={meal.type} isClearable={true}/></div>
                                    <CommonInputText name={"price"} label={t("price")} setObjectValue={setMeal}
                                                     type={"number"} value={meal.price}/>
                                    <div className={"w-45"}><CustomSelect
                                        options={currencyOptions.map((currency) => ({label: t(currency.label), value: currency.value, image:currency.image}))}
                                        label={t("Currency")} name={"currency"} setObjectValue={setMeal} disabled={true} hideIndicator={true}
                                        defaultValue={meal.currency} isClearable={true}/></div>
                                    <div className={"d-flex justify-content-end"}><Button className={"main-button mt-4"}
                                                                                          type={"submit"}>{t("save")}</Button>
                                    </div>
                                </Form>
                            </div>
                            <div className={"w-100"}>
                                {hotel && hotel.meals.length > 0 &&
                                    <CustomTable
                                        darkHeader={false}
                                        viewComponent={setMealId}
                                        tableData={hotel.meals}
                                        columns={{
                                            headings: ["MealType", "Price", "Delete"],
                                            items: hotel.meals.map(({
                                                                             type,
                                                                             price,
                                                                             currency
                                                                         }) => [t(type), price + " " + currency])
                                        }}
                                        onDelete={deleteMeal}
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