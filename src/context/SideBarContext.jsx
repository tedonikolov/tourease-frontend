import {createContext, useState} from "react";

export const SideBarContext = createContext();

export default function SideBarProvider ({ children }) {
    const isVisible = window.innerWidth > 1400;
    const [sideBarVisible, setSideBarVisible] = useState(isVisible);

    return (
        <SideBarContext.Provider value={{ sideBarVisible, setSideBarVisible }}>{children}</SideBarContext.Provider>
    );
};
