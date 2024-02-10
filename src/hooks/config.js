import restInterceptor from "./RestInterceptor";

export function getCountries (){
    return restInterceptor.get("/configuration-service/country/all");
}