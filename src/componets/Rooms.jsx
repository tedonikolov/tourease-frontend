import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHammer, faHandSparkles} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {changeRoomStatus} from "../hooks/hotel";
import {queryClient} from "../hooks/RestInterceptor";

export default function Rooms({rooms, filter}) {
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
                >
                    {room.status === 'MAINTENANCE' &&
                        <div className="card-body"><FontAwesomeIcon icon={faHammer} className='red m-0'/></div>}
                    {room.status === 'CLEANING' &&
                        <div className="card-body"><FontAwesomeIcon icon={faHandSparkles} className='purple'/></div>}
                    <div className="card-header">{room.name}</div>
                </div>
            ))}
        </div>
    )
}