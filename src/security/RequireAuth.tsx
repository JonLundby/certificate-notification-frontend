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

    if (!auth.isLoggedIn()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !auth.isLoggedInAs(roles)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
