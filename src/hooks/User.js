import interceptor from "./RestInterceptor";

export const getLoggedUser = async (email) => {
    return interceptor.get(
        '/user-service/user/getLoggedUser/' + email
    );
};

export const sendLogout = async () => {
    return interceptor.get(
        '/logout',
    );
};

export const createProfile = async (userInfo) => {
    return interceptor.post(
        '/user-service/user/registration',
        {
            email: userInfo.email,
            password: userInfo.password,
            userType: userInfo.userType
        },
    );
};
