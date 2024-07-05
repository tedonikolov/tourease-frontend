import restInterceptor from "./RestInterceptor";

export function getHotelListing(searchText, pageNumber, currency) {
    return restInterceptor.get("core-service/search/listing", {
        params: {
            searchText: searchText,
            page: pageNumber,
        },
        headers: {
            currency: currency,
        },
    });
}

export function getNotAvailableDates(typeId) {
    return restInterceptor.get("core-service/search/getNotAvailableDates", {
        params: {
            typeId: typeId,
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

export function createReservation(userId, reservationInfo) {
    return restInterceptor.post("core-service/reservation/createReservation",
        {
            hotelId: reservationInfo.hotelId,
            typeId: reservationInfo.typeId,
            mealId: reservationInfo.mealId,
            roomId: reservationInfo.roomId,
            peopleCount: reservationInfo.peopleCount,
            checkIn: reservationInfo.checkIn,
            checkOut: reservationInfo.checkOut,
            nights: reservationInfo.nights,
            price: reservationInfo.price,
            mealPrice: reservationInfo.priceForMeal,
            nightPrice: reservationInfo.pricePerNight,
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