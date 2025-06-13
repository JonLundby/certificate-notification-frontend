import { NavLink } from "react-router-dom";
import { useAuth } from "./security/AuthProvider";

export default function NavHeader() {
    const auth = useAuth();

    return (
        <nav>
            {!auth.isLoggedIn() ? (
                <ul>
                    <li>
                        <NavLink to="/login" end>
                            Login
                        </NavLink>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <NavLink to="/overview" end>
                            Overview
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/uploaduri" end>
                            Upload URI
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/uploadcertificate" end>
                            Upload Certificate
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/logout" end>
                            Logout
                        </NavLink>
                    </li>
                </ul>
            )}
        </nav>
    );
}