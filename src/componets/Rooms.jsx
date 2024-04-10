import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHammer, faHandSparkles} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {changeRoomStatus} from "../hooks/hotel";
import {queryClient} from "../hooks/RestInterceptor";
import {HotelContext} from "../context/HotelContext";
import {Navigate} from "react-router-dom";

export default function Rooms({rooms, filter}) {
    const {roomId, setRoomId, date, setDate} = useContext(HotelContext)
    const [roomName, setRoomName] = useState(null)
    const [id, setId] = useState(null)
    const divRef = useRef(null);

    const {mutate} = useMutation({
        mutationFn: changeRoomStatus,
        onSuccess: () => queryClient.resetQueries(["get all reservations view by hotel", filter])
    })

    useEffect(() => {
        if (divRef.current) {
            divRef.current.focus();
        }
    }, [rooms]);

    useEffect(() => {
        setRoomId(null);
        setDate(null);
    }, []);

    return (
        <div className={"d-flex flex-wrap mx-auto"}
             tabIndex={0}
             onKeyDown={(e) => e.key === 'F2' && id != null && mutate(id)}
             ref={divRef}
        >
            {rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => (
                <div key={room.id}
                     className={`roomCard text-white 
                     ${room.reservationStatus === 'FREE' ? 'info' : room.reservationStatus === 'ACCOMMODATED' ? 'warning' : room.reservationStatus === 'ENDING' || room.reservationStatus === 'FINISHED' ? 'danger' : 'success'}`}
                     onMouseOver={() => setId(room.id)}
                     onMouseOut={() => setId(null)}
                     onClick={() => { setRoomId(room.id); setDate(filter.date); setRoomName(()=>room.name)}}
                >
                    {room.status === 'MAINTENANCE' &&
                        <div className="card-body"><FontAwesomeIcon icon={faHammer} className='red m-0'/></div>}
                    {room.status === 'CLEANING' &&
                        <div className="card-body"><FontAwesomeIcon icon={faHandSparkles} className='purple'/></div>}
                    <div className="card-header">{room.name}</div>
                </div>
            ))}
            {roomId && roomName && date && <Navigate to={"/hotel/room/"+roomName}/>}
        </div>
    )
}