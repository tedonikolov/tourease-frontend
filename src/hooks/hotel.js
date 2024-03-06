import restInterceptor from "./RestInterceptor";

export function getOwnerByEmail(email){
    return restInterceptor.get("hotel-service/owner/getOwnerByEmail/"+email);
}

export function saveOwnerInfo(owner){
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

export function saveHotelInfo(hotel){
    return restInterceptor.post("hotel-service/hotel/saveHotel", {
        id: hotel.id,
        name: hotel.name,
        stars: hotel.stars,
        location:{
            id:hotel.location.id,
            latitude:hotel.location.latitude,
            longitude:hotel.location.longitude,
            address:hotel.location.address,
            city:hotel.location.city,
            country:hotel.location.country
        },
        ownerId: hotel.owner.id,
    });
}