import {Button, Form} from "react-bootstrap";
import CommonInputText from "./CommonInputText";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import {currencyOptions} from "../utils/options";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {paidFor, paymentTypes} from "../utils/enums";
import {useMutation} from "@tanstack/react-query";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import {createPayment, markPaymentAsPaid} from "../hooks/hotel";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {HotelContext} from "../context/HotelContext";
import {CurrencyContext} from "../context/CurrencyContext";

export default function PaymentInfo({payment, customers, setPaymentId, setShowPayment, reservationNumber}) {
    const [t] = useTranslation("translation", {keyPrefix: "common"});
    const {loggedUser} = useContext(AuthContext);
    const {workerHotel} = useContext(HotelContext);
    const {currency, handleRate, currencies} = useContext(CurrencyContext);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [facility, setFacility] = useState(null);
    const [oldCurrency, setOldCurrency] = useState(null);

    useEffect(() => {
        if (payment && payment.id === 0) {
            setPaymentInfo(() => {
                    return {
                        ...payment,
                        currency: currency,
                        hotelId: workerHotel.id,
                    }
                }
            );
        }
        if(payment) {
            setPaymentInfo(() => {return{...payment, currency: currency, hotelId: workerHotel.id}});
        }
    }, [payment]);

    useEffect(() => {
        if (currencies && payment) {
            currencies.filter((rate) => rate.currency === payment.currency).map(({currency}) => {
                setOldCurrency(() => {
                    return {currency: currency, price: payment.price}
                });
            })
        }
    }, [currencies, payment]);

    function changePrice(rate) {
        setPaymentInfo((prev) => {
            return {
                ...prev,
                price: parseFloat((oldCurrency.price / rate).toFixed(2)),
            }
        })
    }

    useEffect(() => {
        if (currencies && paymentInfo && oldCurrency) {
            changePrice(handleRate(oldCurrency, paymentInfo.currency));
        }
    }, [currencies, oldCurrency, paymentInfo && paymentInfo.currency]);

    const {mutate: markAsPaid} = useMutation({
        mutationFn: () => markPaymentAsPaid(paymentInfo, loggedUser.id),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get unpaid payments", customers]});
            queryClient.resetQueries({queryKey: ["get paid payments", customers]});
            setPaymentId(() => null);
            toast.success(<CustomToastContent content={[t("successPaid")]}/>);
        }
    })

    const {mutate: newPayment} = useMutation({
        mutationFn: () => createPayment(paymentInfo, loggedUser.id, reservationNumber),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get unpaid payments", customers]});
            queryClient.resetQueries({queryKey: ["get paid payments", customers]});
            setShowPayment(() => false);
            toast.success(<CustomToastContent
                content={[paymentInfo.paymentType ? t("successPaid") : t("successBill")]}/>);
        }
    })

    useEffect(() => {
        if (paymentInfo && paymentInfo.facilityId) {
            const facility = workerHotel.facilities.find((facility) => facility.id === paymentInfo.facilityId);
            setFacility(() => facility);
            setPaymentInfo((prev) => {
                return {
                    ...prev,
                    price: facility.price,
                    currency: facility.currency
                }
            })
            currencies.filter((rate) => rate.currency === facility.currency).map(({currency}) => {
                setOldCurrency(() => {
                    return {currency: currency, price: facility.price}
                });
            })
        }
    }, [paymentInfo && paymentInfo.facilityId]);

    useEffect(() => {
        if (oldCurrency && paymentInfo.price !== oldCurrency.price && oldCurrency.currency !== paymentInfo.currency) {
            paymentInfo && setOldCurrency(() => {
                return {currency: paymentInfo.currency, price: paymentInfo.price}
            });
        }
    }, [paymentInfo && paymentInfo.price]);

    function pay(event) {
        paymentInfo.id === 0 ? newPayment() : markAsPaid();
        event.preventDefault();
    }

    function handlePriceChange(event) {
        setPaymentInfo((prevState) => ({
            ...prevState,
            price: event.target.value,
        }))
        setOldCurrency(() => {return {currency:paymentInfo.currency,price: event.target.value}});
    }

    return (
        paymentInfo && <div className={'w-60'}>
            <Form id={'payment'} onSubmit={pay}>
                {paymentInfo.paymentDate && <CustomDatePicker label={t('paymentDate')}
                                                              selectedDate={paymentInfo.paymentDate}
                                                              name={'paymentDate'}
                                                              setValue={setPaymentInfo}
                                                              disabled={true}/>}
                {paymentInfo.id === 0 &&
                    <div className={"w-45 px-2"}><CustomSelect options={customers.map((customer) => {
                        return {value: customer.id, label: customer.fullName}
                    })} defaultValue={paymentInfo.customerId} setObjectValue={setPaymentInfo}
                                                               label={t('Customer')} name={'customerId'}/></div>}
                <div className={"d-flex"}>
                    <div className={"w-60"}><CustomSelect options={paymentTypes.map((type) => {
                        return {value: type, label: t(type)}
                    })} defaultValue={paymentInfo.paymentType} setObjectValue={setPaymentInfo}
                                                          required={paymentInfo.id !== 0}
                                                          disabled={paymentInfo.paid} label={t('paymentType')}
                                                          name={'paymentType'}/></div>
                    <div className={"w-45 px-2"}><CustomSelect options={paidFor.map((paidFor) => {
                        return {value: paidFor, label: t(paidFor)}
                    })} defaultValue={paymentInfo.paidFor} setObjectValue={setPaymentInfo}
                                                               disabled={paymentInfo.id !== 0} label={t('paidFor')}
                                                               name={'paidFor'}/></div>
                </div>
                {paymentInfo.paidFor === "FACILITY" && paymentInfo.id === 0 &&
                    <div className={"w-60"}><CustomSelect options={workerHotel.facilities.map((facility) => {
                        return {value: facility.id, label: t(facility.name)}
                    })} defaultValue={facility && facility.id} setObjectValue={setPaymentInfo} required={false}
                                                          label={t('Facility')} name={'facilityId'}/></div>}
                <CommonInputText name={"price"} label={t("price")} handleInput={handlePriceChange}
                                 type={"number"} value={paymentInfo.price} disabled={paymentInfo.id !== 0}/>
                <div className={"w-45"}><CustomSelect
                    options={currencyOptions.map((currency) => ({
                        label: t(currency.label),
                        value: currency.value,
                        image: currency.image
                    }))}
                    label={t("Currency")} name={"currency"}
                    setObjectValue={setPaymentInfo}
                    defaultValue={paymentInfo.currency}/></div>
                <Button disabled={paymentInfo.paid} className={"register-button"} type={"submit"}>
                    {paymentInfo.id === 0 && !paymentInfo.paymentType ? t("New bill") : t("mark pay")}
                </Button>
            </Form>
        </div>
    )
}