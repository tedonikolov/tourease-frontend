import {AuthContext} from "../context/AuthContext";
import {useContext} from "react";

export default function RequiredPermissions ({ requiredPermissions, children, forbiddenAccess, isOpen }) {
    const { hasPermission, loggedUser } = useContext(AuthContext);
    if (loggedUser===null && isOpen) return <>{children}</>;
    if (!isOpen && forbiddenAccess && hasPermission(forbiddenAccess)) return <></>;
    return !isOpen && hasPermission(requiredPermissions) ? <>{children}</> : <></>;
};