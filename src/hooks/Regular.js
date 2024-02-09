import restInterceptor from "./RestInterceptor";

export function sendRegularProfile (email, regular){
    return restInterceptor.post("/user-service/regular/save",
        {
            email: email,
            ...regular
        }
    )
}