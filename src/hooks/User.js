import interceptor from "./RestInterceptor";

export const getLoggedUser = async (email) => {
    return interceptor.get(
        '/user-service/user/getLoggedUser/'+email
    );
};

export const sendLogout = async () => {
    return interceptor.get(
        '/logout',
    );
};

export const createProfile = async (username, password) => {
    return interceptor.post(
        '/sc-api/admin/createProfile',
        {username: username, password: password},
    );
};
