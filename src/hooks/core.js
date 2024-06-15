import restInterceptor from "./RestInterceptor";
import moment from "moment-timezone";

export function getHotelListing(searchText, pageNumber, language) {
    return restInterceptor.get("core-service/search/listing", {
        params: {
            searchText: searchText,
            page: pageNumber,
        },
        headers: {
            language: language,
        },
    });
}

export function getNotAvailableDates(hotelId, typeId, fromDate, toDate) {
    return restInterceptor.get("core-service/search/getNotAvailableDates", {
        params: {
            hotelId: hotelId,
            typeId: typeId,
            fromDate: fromDate,
            toDate: toDate,
        },
    });
}

export function getFreeRoomsForDate({hotelId, fromDate, toDate, typeId}) {
    return restInterceptor.get("core-service/search/getFreeRoomsForDateByTypeId", {
        headers: {
            hotelId: hotelId,
            typeId: typeId
        },
        params: {
            fromDate: fromDate,
            toDate: toDate
        },
    });
}

export function createReservationByWorker(userId, reservationInfo) {
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

    return restInterceptor.post("core-service/reservation/createReservation",
        {
            hotelId: reservationInfo.hotelId,
            typeId: reservationInfo.typeId,
            mealId: reservationInfo.mealId,
            roomId: reservationInfo.roomId,
            peopleCount: reservationInfo.peopleCount,
            checkIn: checkIn,
            checkOut: checkOut,
            nights: reservationInfo.nights,
            price: reservationInfo.price,
            currency: reservationInfo.currency,
        }
        ,{
            headers: {
                userId: userId,
            },
        });
}

export function getReservations(userId, reservationsFilter, pageNumber, size) {
    return restInterceptor.get("core-service/reservation/getReservations", {
        headers: {
            userId: userId,
        },
        params: {
            ...reservationsFilter,
            page: pageNumber,
            size: size,
        },
    });
}

export function cancelReservation(reservationId) {
    return restInterceptor.put("core-service/reservation/cancelReservation", {},{
        headers: {
            reservationId: reservationId,
        },
    });
}

export function giveRating(rating) {
    return restInterceptor.post("core-service/rating/rateHotel", {
        hotelId: rating.hotelId,
        rating: rating.rate,
        comment: rating.comment,
    },{
        headers: {
            reservationId: rating.reservationId,
        },
    });
}