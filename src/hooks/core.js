import restInterceptor from "./RestInterceptor";

export function getHotelListing(searchText, pageNumber) {
    return restInterceptor.get("core-service/search/listing", {
        params: {
            searchText: searchText,
            page: pageNumber,
        },
    });
}