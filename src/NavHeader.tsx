import { NavLink } from "react-router-dom";

export default function NavHeader() {

    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/login" end>
                        Login
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/overview" end>
                        Overview
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/upload" end>
                        Upload URIs or client certificate
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}