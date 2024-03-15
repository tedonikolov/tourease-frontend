import {createContext, useEffect, useState} from "react";
import {getLoggedUser} from "../hooks/User";
import {Admin, Hotel, Regular, Transport} from "../utils/Role";
import {useQuery} from "@tanstack/react-query";
import {queryClient} from "../hooks/RestInterceptor";
import {getOwnerByEmail} from "../hooks/hotel";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const [permission, setPermission] = useState('');
    const [loggedUser, setLoggedUser] = useState(null);
    const [navigatePage, setNavigatePage] = useState('');

    const getUserData = () => {
        setLoggedUser(user);
        setPermission(user.userType);
        switch (user.userType) {
            case Regular: {
                setNavigatePage('/regular/profile');
                break;
            }
            case Hotel: {
                setNavigatePage('/hotel/profile');
                break;
            }
            case Transport: {
                setNavigatePage('');
                break;
            }
            case Admin: {
                setNavigatePage('/logs');
                break;
            }
        }
    };

    const clearUserData = () => {
        setToken(() => '');
        setUsername(() => '');
        setPermission(['']);
        setLoggedUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        queryClient.removeQueries({queryKey: ["get logged user", username]})
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

    const {data: user, isError, isSuccess} = useQuery({
            queryKey: ["get logged user", username],
            queryFn: () => getLoggedUser(username),
            enabled: username !== null && token !== null && username !== "" && token !== "",
            retry: false,
            staleTime: 5000
        }
    )

    const {data: owner, isLoading: ownerLoading} = useQuery({
            queryKey: ["get owner", username],
            queryFn: () => getOwnerByEmail(user.email),
            enabled: isSuccess && user.userType===Hotel,
            retry: false,
            staleTime: 5000
        }
    )

    useEffect(() => {
        if (isError) {
            logout();
        }
    }, [isError]);

    useEffect(() => {
        if (isSuccess) {
            getUserData();
        }
    }, [isSuccess]);

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
            setToken(() => token);
            setUsername(() => userInfo.username);
        } else {
            clearUserData();
            throw userResponse.status;
        }
    };

    const hasPermission = (per) => {
        return per.some((value) => permission === value);
    };

    return (
        <AuthContext.Provider
            value={{
                loggedUser,
                owner,
                ownerLoading,
                setLoggedUser,
                token,
                login,
                logout,
                setToken,
                permission,
                setPermission,
                hasPermission,
                mainPage: navigatePage
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
