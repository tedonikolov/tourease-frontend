import {AuthContext} from "../context/AuthContext";
import {useContext} from "react";

export default function RequiredPermissions ({ requiredPermissions, children, forbiddenAccess }) {
    const { hasPermission } = useContext(AuthContext);
    if (forbiddenAccess && hasPermission(forbiddenAccess)) return <></>;
    return hasPermission(requiredPermissions) ? <>{children}</> : <></>;
};