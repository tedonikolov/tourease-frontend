import restInterceptor from "./RestInterceptor";
import moment from "moment-timezone";

export function getOwnerByEmail(email) {
    return restInterceptor.get("hotel-service/owner/getOwnerByEmail/" + email);
}

export function getWorkerByEmail(email){
    return restInterceptor.get("hotel-service/hotel/worker/getWorker/" + email);
}

export function saveOwnerInfo(owner) {
    return restInterceptor.post("hotel-service/owner/save", {
        id: owner.id,
        fullName: owner.fullName,
        companyName: owner.companyName,
        companyAddress: owner.companyName,
        phone: owner.phone,
        country: owner.country,
        city: owner.city,
        eik: owner.eik
    });
}

export function saveHotelInfo(hotel) {
    return restInterceptor.post("hotel-service/hotel/saveHotel", {
        id: hotel.id,
        name: hotel.name,
        stars: hotel.stars,
        location: {
            id: hotel.location.id,
            latitude: hotel.location.latitude,
            longitude: hotel.location.longitude,
            address: hotel.location.address,
            city: hotel.location.city,
            country: hotel.location.country
        },
        ownerId: hotel.owner.id,
    });
}

export function insertImage({image, hotelId}) {
    return restInterceptor.post("hotel-service/hotel/image", {
        image: image,
        hotelId: hotelId
    }, {
        headers: {
            "Content-type": "multipart/form-data",
        },
    });
}

export function getImages(hotelId) {
    return restInterceptor.get("hotel-service/hotel/image/getForHotel/" + hotelId);
}

export function deleteImage(imageId) {
    return restInterceptor.delete("hotel-service/hotel/image/" + imageId);
}

export function saveFacility(facility) {
    return restInterceptor.post("hotel-service/hotel/facility/save", {
        id: facility.id,
        name: facility.name,
        paid: facility.paid,
        price: facility.price,
        currency: facility.currency,
        hotelId: facility.hotelId
    });
}

export function deleteFacilityById(id) {
    return restInterceptor.delete("hotel-service/hotel/facility/" + id);
}

export function saveMeal(meal) {
    return restInterceptor.post("hotel-service/hotel/meal/save", {
        id: meal.id,
        type: meal.type,
        price: meal.price,
        currency: meal.currency,
        hotelId: meal.hotelId
    });
}

export function deleteMealById(id) {
    return restInterceptor.delete("hotel-service/hotel/meal/" + id);
}

export function saveBed(bed) {
    return restInterceptor.post("hotel-service/hotel/bed/save", {
        id: bed.id,
        name: bed.name,
        people: bed.people,
        price: bed.price,
        currency: bed.currency,
        hotelId: bed.hotelId
    });
}

export function deleteBedById(id) {
    return restInterceptor.delete("hotel-service/hotel/bed/" + id);
}

export function saveType(type) {
    return restInterceptor.post("hotel-service/hotel/type/save", {
        id: type.id,
        name: type.name,
        price: type.price,
        currency: type.currency,
        beds: type.beds.map(bed=>bed),
        hotelId: type.hotelId
    });
}

export function deleteTypeById(id) {
    return restInterceptor.delete("hotel-service/hotel/type/" + id);
}

export function saveRoom(room) {
    return restInterceptor.post("hotel-service/hotel/room/save", {
        id: room.id,
        name: room.name,
        types: room.types,
        hotelId: room.hotelId
    });
}

export function deleteRoomById(id) {
    return restInterceptor.delete("hotel-service/hotel/room/" + id);
}

export function saveWorker(worker) {
    return restInterceptor.post("hotel-service/hotel/worker/save", worker);
}

export function deleteWorkerById(id) {
    return restInterceptor.delete("hotel-service/hotel/worker/" + id);
}

export function reassignWorkerById(id) {
    return restInterceptor.put("hotel-service/hotel/worker/" + id);
}

export function getAllReservationsViewByHotel({hotelId,date}) {
    return restInterceptor.get("hotel-service/reservation/worker/getAllReservationsViewByHotel", {
        headers: {
            hotelId: hotelId,
        },
        params: {
            date: date
        },
    });
}

export function changeRoomStatus(roomId) {
    return restInterceptor.put("hotel-service/hotel/room/changeStatus/"+roomId);
}

export function getRoomById(roomId) {
    return restInterceptor.get("hotel-service/hotel/room/getRoomById", {
        headers: {
            id: roomId,
        },
    });
}

export function getReservationForRoom({roomId, date}) {
    return restInterceptor.get("hotel-service/hotel/room/getReservationForRoom", {
        headers: {
            id: roomId,
        },
        params: {
            date: date
        },
    });
}

export function getCustomerByPassportId(passportId) {
    return restInterceptor.get("hotel-service/hotel/customer/getCustomerByPassportId/"+passportId);
}

export function addCustomerToReservation(reservationId, customer) {
    return restInterceptor.post("hotel-service/reservation/worker/addCustomer", customer,{
        headers: {
            reservationId: reservationId,
        },
    });
}

export function getTypesForRoom(roomId) {
    return restInterceptor.get("hotel-service/hotel/type/getTypesByRoomId",{
        headers: {
            roomId: roomId,
        },
    });
}

export function getTypesForRoomByPeopleCount(hotelId, peopleCount) {
    return restInterceptor.get("hotel-service/hotel/type/getTypesForPeopleCount",{
        params: {
            peopleCount: peopleCount
        },
        headers: {
            hotelId: hotelId,
        }
    });
}

export function getTakenDaysForRoom(roomId) {
    return restInterceptor.get("hotel-service/hotel/room/getTakenDaysForRoom",{
        headers: {
            id: roomId,
        },
    });
}

export function markCheckOut(reservationId) {
    return restInterceptor.put("hotel-service/reservation/worker/checkOutReservation",null,{
        headers: {
            reservationId: reservationId,
        },
    });
}

export function createReservationByWorker(workerId, reservationInfo, roomId) {
    let currentTime = moment();
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let offset = moment.tz(new Date(), timeZone).utcOffset();

    let checkOut = moment.tz(reservationInfo.checkOut, timeZone).add(offset,"minutes")
    checkOut.set({
        hour: "12",
        minute: "00",
        second: "00"
    });
    checkOut = checkOut.format("YYYY-MM-DDTHH:mm:ssZ");

    let checkIn = moment.tz(reservationInfo.checkIn, timeZone).add(offset,"minutes");
    checkIn.set({
        hour: currentTime.get('hour'),
        minute: currentTime.get('minute'),
        second: currentTime.get('second')
    });
    checkIn = checkIn.format("YYYY-MM-DDTHH:mm:ssZ");

    return restInterceptor.post("hotel-service/reservation/worker/createReservation",
        {
            customer:{
                fullName: reservationInfo.fullName,
                phoneNumber: reservationInfo.phoneNumber,
                passportId: reservationInfo.passportId,
                country: reservationInfo.country,
                birthDate: reservationInfo.birthDate,
                creationDate: reservationInfo.creationDate,
                expirationDate: reservationInfo.expirationDate,
                gender: reservationInfo.gender
            },
            roomId: roomId,
            typeId: reservationInfo.typeId,
            mealId: reservationInfo.mealId,
            peopleCount: reservationInfo.peopleCount,
            checkIn: checkIn,
            checkOut: checkOut,
            nights: reservationInfo.nights,
            price: reservationInfo.price,
            currency: reservationInfo.currency,
        }
        ,{
        headers: {
            userId: workerId,
        },
    });
}

export function updateReservation(workerId, reservationInfo) {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let checkOut = moment.tz(reservationInfo.checkOut, timeZone);
    checkOut.set({
        hour: "12",
        minute: "00",
        second: "00"
    });
    checkOut = checkOut.format("YYYY-MM-DDTHH:mm:ssZ");

    let checkIn = moment.tz(reservationInfo.checkIn, timeZone).format("YYYY-MM-DDTHH:mm:ssZ");

    return restInterceptor.put("hotel-service/reservation/worker/updateReservation", {
        id: reservationInfo.id,
        roomId: reservationInfo.room ? reservationInfo.room.id : null,
        typeId: reservationInfo.typeId,
        mealId: reservationInfo.mealId,
        peopleCount: reservationInfo.peopleCount,
        customers: reservationInfo.customers.map((customer) => customer.id),
        checkIn: checkIn,
        checkOut: checkOut,
        nights: reservationInfo.nights,
        price: reservationInfo.price,
        currency: reservationInfo.currency,
    }, {
        headers: {
            workerId: workerId,
        },
    });
}

export function getAllPaymentsByCustomersForHotel(customers, hotelId, isPaid) {
    return restInterceptor.get("hotel-service/hotel/payment/worker/getAllPaymentsByCustomersForHotel",
        {
            params: {
                isPaid: isPaid
            },
            headers: {
                customers: customers,
                hotelId: hotelId,
            },
        });
}

export function createPayment(payment, workerId) {
    return restInterceptor.post("hotel-service/hotel/payment/worker/createPayment",payment,{
        headers: {
            workerId: workerId,
        },
    });
}

export function markPaymentAsPaid(payment, workerId) {
    return restInterceptor.put("hotel-service/hotel/payment/worker/markPaymentAsPaid",payment,{
        headers: {
            workerId: workerId,
        },
    });
}

export function deletePaymentById(paymentId,workerId) {
    return restInterceptor.delete("hotel-service/hotel/payment/worker/deletePaymentById/"+paymentId,{
        headers: {
            workerId: workerId,
        },
    });
}

export function getFreeRoomCountByDatesForHotel({hotelId, fromDate, toDate}) {
    return restInterceptor.get("hotel-service/hotel/room/getFreeRoomCountByDatesForHotel", {
        headers: {
            hotelId: hotelId,
        },
        params: {
            fromDate: fromDate,
            toDate: toDate
        },
    });
}

export function getConfirmReservationsForHotel({hotelId, date, status}) {
    return restInterceptor.get("hotel-service/reservation/worker/getAllReservationsForDate", {
        headers: {
            hotelId: hotelId,
        },
        params: {
            date: date,
            status: status
        },
    });
}

export function getFreeRoomsForDate({hotelId, date, typeId}) {
    return restInterceptor.get("hotel-service/hotel/room/getFreeRoomsForDateByTypeId", {
        headers: {
            hotelId: hotelId,
            typeId: typeId
        },
        params: {
            date: date
        },
    });
}

export function cancelReservation(reservationId) {
    return restInterceptor.put("hotel-service/reservation/worker/cancelReservation",null,{
        headers: {
            reservationId: reservationId,
        },
    });
}

export function confirmReservation(reservationId) {
    return restInterceptor.put("hotel-service/reservation/worker/confirmReservation",null,{
        headers: {
            reservationId: reservationId,
        },
    });
}