import {createContext, useEffect, useState} from "react";
import {getLoggedUser} from "../hooks/User";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const username = sessionStorage.getItem('username');
    const [permission, setPermission] = useState('');
    const [loggedUser, setLoggedUser] = useState(null);
    const [navigatePage, setNavigatePage] = useState('');

    const getUserData = async (username) => {
        const user = await getLoggedUser(username);
        setLoggedUser(user);
        setPermission(user.userType);
    };

    useEffect(() => {
        username && token && getUserData(username);
    }, []);

    const login = async (userInfo) => {


        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        });
        const token = userResponse.headers.get('Authorization');

        if (token) {
            setToken(token);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('username', userInfo.username);
            await getUserData(userInfo.username);
            return userResponse.status;
        } else {
            clearUserData();
            return userResponse.status;
        }
    };

    const clearUserData = ()=> {
        setToken('');
        setPermission(['']);
        setLoggedUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
    }

    const logout = () => {
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        clearUserData();
        setNavigatePage('');
    };

    return (
        <AuthContext.Provider
            value={{
                loggedUser,
                token,
                login,
                logout,
                setToken,
                permission,
                setPermission,
                mainPage:navigatePage
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
