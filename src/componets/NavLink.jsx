import { Image, Nav } from 'react-bootstrap';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useContext} from "react";
import {SideBarContext} from "../context/SideBarContext";

export default function NavLink ({ path, label, image, icon }){
    const screenWidth = window.innerWidth;
    const { setSideBarVisible } = useContext(SideBarContext);

    return (
        <Nav.Link
            as={Link}
            to={path}
            data-toggle='pill'
            onClick={() => {
                if (screenWidth < 1024) {
                    setSideBarVisible(false);
                }
            }}
        >
            {image ? (
                <div className={"text-center"}><Image fluid width={100} src={image}></Image></div>
            ) : (
                <div className='d-flex px-2 my-1 link color-main align-items-center'>
                    {icon && <FontAwesomeIcon icon={icon} className='fa-fw' />}
                    <p className='m-0 fs-5 px-2 '>{label}</p>
                </div>
            )}
        </Nav.Link>
    );
};