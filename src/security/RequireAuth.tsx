import { useAuth } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode
    roles?: string[];
};
export default function RequireAuth({ children, roles }: Props) {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.isLoggedIn()) { // Check if user is logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !auth.isLoggedInAs(roles)) { // Check if user has the required roles
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 'else' case: user is logged in and has the required roles
    // Render the children components
    return children;
}
