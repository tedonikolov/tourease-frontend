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