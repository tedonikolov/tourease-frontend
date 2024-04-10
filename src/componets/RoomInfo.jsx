import CustomTable from "./CustomTable";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import NoDataComponent from "./NoDataComponent";
import CustomerInfo from "./CustomerInfo";
import {Modal} from "react-bootstrap";
import {defaultCustomer} from "../utils/defaultValues";

export default function RoomInfo({data, newCustomer, setNewCustomer, filter}) {
    const [t] = useTranslation("translation", {keyPrefix: 'common'});
    const reservation = data ? data.reservation : null;
    const worker = data ? data.worker : null;
    const [customer, setCustomer] = useState(null);
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        if (customerId) {
            setCustomer(() => reservation.customers.find((customer) => customer.id === customerId));
        }
    }, [customerId]);

    useEffect(() => {
        if (newCustomer) {
            setCustomerId(() => 0);
            setCustomer(defaultCustomer);
        }
    }, [newCustomer]);

    function isDisabled() {
        return reservation.status === "FINISHED";
    }

    return (
        <div className={"w-100 mt-3"}>
            {data ? <div>
                    {reservation && reservation.customers && reservation.customers.length > 0 ? <CustomTable
                            darkHeader={false}
                            viewComponent={setCustomerId}
                            disabled={isDisabled}
                            tableData={reservation.customers}
                            tableColor={reservation.status === "CONFIRMED" ? "table-success" : reservation.status === "ENDING" ? reservation.paid ? "table-warning" : "table-danger" : "table-info"}
                            columns={{
                                headings: ["ReservationNumber", "CreationDate", "Name", "CheckIn", "CheckOut", "Status", "Price", "Paid", "Worker"],
                                items: reservation.customers.map(({
                                                                      fullName
                                                                  }) =>
                                    [reservation.reservationNumber, dayjs(reservation.creationDate).format("DD-MM-YYYY"),
                                        fullName, dayjs(reservation.checkIn).format("DD-MM-YYYY"),
                                        dayjs(reservation.checkOut).format("DD-MM-YYYY"), t(reservation.status),
                                        reservation.price + " " + reservation.currency, reservation.paid, worker.fullName.split(" ")[0]])
                            }}
                        />
                        :
                        <div><NoDataComponent sentence={"No reservations"}/></div>}
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
                </div>
                :
                <div/>
            }
        </div>
    )
}