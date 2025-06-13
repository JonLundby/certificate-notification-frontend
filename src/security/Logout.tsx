import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.logout();
        navigate("/login", { replace: true });
    }, [ auth, navigate ]);

    return null;
}
