import CustomTable from "./CustomTable";
import React, {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import NoDataComponent from "./NoDataComponent";
import CustomerInfo from "./CustomerInfo";
import {Accordion, Modal} from "react-bootstrap";
import {defaultCustomer} from "../utils/defaultValues";
import {useMutation} from "@tanstack/react-query";
import {deletePaymentById} from "../hooks/hotel";
import PaymentInfo from "./PaymentInfo";
import {queryClient} from "../hooks/RestInterceptor";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import {AuthContext} from "../context/AuthContext";
import {Manager} from "../utils/Role";
import {CurrencyContext} from "../context/CurrencyContext";

export default function RoomInfo({data, newCustomer, setNewCustomer, filter, paidPayments, unPaidPayments}) {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const {loggedUser, permission} = useContext(AuthContext);
    const {currency:userCurrency, changePrice} = useContext(CurrencyContext);
    const reservation = data ? data.reservation : null;
    const worker = data ? data.worker : null;
    const [customer, setCustomer] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [payment, setPayment] = useState(null);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (customerId) {
            setCustomer(() => reservation.customers.find((customer) => customer.id === customerId));
        }
    }, [customerId]);

    useEffect(() => {
        if (paymentId) {
            setPayment(() => payments.find((payment) => payment.id === paymentId));
        }
    }, [paymentId]);

    useEffect(() => {
        if (newCustomer) {
            setCustomerId(() => 0);
            setCustomer(defaultCustomer);
        }
    }, [newCustomer]);

    function isDisabled() {
        return reservation.status === "FINISHED";
    }

    const {mutate: deletePayment} = useMutation({
        mutationFn: (paymentId) => deletePaymentById(paymentId, loggedUser.id),
        onSuccess: () => {
            queryClient.resetQueries({queryKey: ["get unpaid payments", data.reservation.customers]});
            setPaymentId(() => null);
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
        }
    })

    useEffect(() => {
        if (unPaidPayments && paidPayments) {
            setPayments(() => [...unPaidPayments, ...paidPayments]);
        }
    }, [paidPayments, unPaidPayments]);

    return (
        <div className={"w-100 mt-3"}>
            {data ? <div>
                    {reservation && reservation.customers && reservation.customers.length > 0 ? <CustomTable
                            darkHeader={false}
                            viewComponent={setCustomerId}
                            disabled={isDisabled}
                            tableData={reservation.customers}
                            tableColor={reservation.status === "CONFIRMED" ? "table-success" : reservation.status === "ENDING" ? unPaidPayments && unPaidPayments.length===0 ? "table-warning" : "table-danger" : "table-info"}
                            columns={{
                                headings: ["ReservationNumber",  "Name", "CheckIn", "CheckOut", "MealType", "Status", "Worker"],
                                items: reservation.customers.map(({
                                                                      fullName
                                                                  }) =>
                                    [reservation.reservationNumber, fullName, dayjs(reservation.checkIn).format("DD-MM-YYYY"),
                                        dayjs(reservation.checkOut).format("DD-MM-YYYY"),
                                        t(reservation.meal.type), t(reservation.status), worker !=undefined ? worker.fullName.split(" ")[0] : "TourEase"])
                            }}
                        />
                        :
                        <div><NoDataComponent sentence={"No reservations"}/></div>}
                    {reservation && reservation.customers && reservation.customers.length > 0 && <Accordion>
                        <Accordion.Item key={1} className='w-100 py-0' eventKey={""}>
                            <Accordion.Header>
                                <div className='d-flex justify-content-between'>
                                    <h4>{t("Unpaid payments")}</h4>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {unPaidPayments && unPaidPayments.length > 0 ? <CustomTable
                                        darkHeader={false}
                                        viewComponent={setPaymentId}
                                        tableData={unPaidPayments}
                                        columns={{
                                            headings: ["Name", "PaidFor", "OriginalPrice", "HotelPrice", permission===Manager && "Delete"],
                                            items: unPaidPayments.map(({
                                                                           customer, price, currency, paidFor
                                                                       }) =>
                                                [customer.fullName, t(paidFor), price + " " + currency,  changePrice({currency: currency, price: price}, userCurrency) + " " + userCurrency])
                                        }}
                                        onDelete={permission===Manager && deletePayment}
                                    />
                                    :
                                    <div><NoDataComponent sentence={"No payments"}/></div>}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>}
                {reservation && reservation.customers && reservation.customers.length > 0 && <Accordion>
                        <Accordion.Item key={2} className='w-100 py-0' eventKey={""}>
                            <Accordion.Header>
                                <div className='d-flex justify-content-between'>
                                    <h4>{t("Paid payments")}</h4>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {paidPayments && paidPayments.length > 0 ? <CustomTable
                                        darkHeader={false}
                                        viewComponent={setPaymentId}
                                        tableData={paidPayments}
                                        columns={{
                                            headings: ["Name", "PaidFor", "PaymentType", "Price", "PaymentDate", "Worker"],
                                            items: paidPayments.map(({
                                                                         paymentDate, customer, price, currency, paidFor, worker, paymentType
                                                                     }) =>
                                                [customer.fullName, t(paidFor), t(paymentType), changePrice({currency: currency, price: price}, userCurrency) + " " + userCurrency, dayjs(paymentDate).format("YYYY-MM-DD"), worker.fullName.split(" ")[0]])
                                        }}
                                    />
                                    :
                                    <div><NoDataComponent sentence={"No payments"}/></div>}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>}
                    <Modal show={customerId !== null} onHide={() => {
                        setCustomerId(null);
                        setNewCustomer(false);
                        setCustomer(defaultCustomer)
                    }} size={"lg"}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("Customer")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CustomerInfo reservationId={reservation ? reservation.id : 0} customer={customer}
                                          filter={filter} setCustomerId={setCustomerId}/>
                        </Modal.Body>
                    </Modal>
                    <Modal show={paymentId !== null} onHide={() => {
                        setPaymentId(null);
                    }} size={"lg"}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("Payment")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PaymentInfo payment={payment} customers={data && data.reservation && data.reservation.customers}
                                         setPaymentId={setPaymentId} reservationNumber={data && data.reservation && data.reservation.reservationNumber}/>
                        </Modal.Body>
                    </Modal>
                </div>
                :
                <div/>
            }
        </div>
    )
}