import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import {SideBarContext} from "../context/SideBarContext";

export default function SideBar ({ children }) {
    const { sideBarVisible,setSideBarVisible } = useContext(SideBarContext);
    const screenWidth = window.innerWidth;

    return (
        <div className={`${screenWidth > 1024 && sideBarVisible && 'sidebar-overlay'}`}>
            <div className={`position-fixed sidebar flex-column vh-100 background-dark`}>
                <div className='d-flex justify-content-end'>
                    <Button
                        onClick={() => setSideBarVisible(false)}
                        className='position-relative end-0 z-5 mt-1 mx-2 border-0 menu-button'
                    >
                        <FontAwesomeIcon icon={faTimes} size='2x' color='#00ff48'></FontAwesomeIcon>
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
};