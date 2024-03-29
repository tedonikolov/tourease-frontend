import restInterceptor from "./RestInterceptor";

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