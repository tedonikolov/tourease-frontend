import restInterceptor from "./RestInterceptor";

export function getConfigurations(){
    return restInterceptor.get("configuration-service/admin/getAllConfigurations");
}

export function saveConfigurations(configs){
    return restInterceptor.post("configuration-service/admin/save", configs);
}