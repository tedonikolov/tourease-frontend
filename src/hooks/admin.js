import restInterceptor from "./RestInterceptor";

export function getLogs(chronologyFilter) {
    return restInterceptor.post("/logger-service/admin/getAll", {
        email: chronologyFilter.email,
        type: chronologyFilter.type,
        createdAfter: chronologyFilter.createdAfter !== null ? chronologyFilter.createdAfter + "T00:00:00+00:00" : '',
        createdBefore: chronologyFilter.createdBefore !== null ? chronologyFilter.createdBefore + "T00:00:00+00:00" : ''
    })
}

export function getChronologyTypes() {
    return restInterceptor.get("/logger-service/admin/getTypes")
}