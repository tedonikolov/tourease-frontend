import {createContext, useContext, useEffect, useState} from "react";
import {Hotel, Manager, Receptionist} from "../utils/Role";
import {useQuery} from "@tanstack/react-query";
import {getOwnerByEmail, getWorkerByEmail} from "../hooks/hotel";
import {AuthContext} from "./AuthContext";

export const HotelContext = createContext();

export const HotelProvider = ({children}) => {
    const [owner, setOwner] = useState(null);
    const [workerHotel, setWorkerHotel] = useState(null);
    const {loggedUser} = useContext(AuthContext)
    const {data: ownerData } = useQuery({
            queryKey: ["get owner", loggedUser && loggedUser.email],
            queryFn: () => getOwnerByEmail(loggedUser.email),
            enabled: loggedUser!=null && loggedUser.userType===Hotel,
            retry: false,
            staleTime: 5000
        }
    )

    const {data: workerData } = useQuery({
            queryKey: ["get worker", loggedUser && loggedUser.email],
            queryFn: () => getWorkerByEmail(loggedUser.email),
            enabled: loggedUser!=null && (loggedUser.userType===Manager || loggedUser.userType===Receptionist),
            retry: false,
            staleTime: 5000
        }
    )

    useEffect(() => {
        if (ownerData) {
            setOwner(()=>ownerData);
            setWorkerHotel(()=>null)
        }
        if (workerData){
            setWorkerHotel(()=>workerData.hotel);
            setOwner(()=>null)
        }
    }, [ownerData, workerData]);

    return (
        <HotelContext.Provider
            value={{
                owner,
                workerHotel,
            }}
        >
            {children}
        </HotelContext.Provider>
    );
};