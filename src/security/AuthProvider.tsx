import { createContext, useState } from "react"; // create context can be used to share state across components
import { useContext } from "react";
import { authProvider, type LoginRequest, type LoginResponse, type User } from "../services/authFacade"; // import the User type from the authFacade service

// an interface to define the shape of the context value
interface AuthContextType {
    username: string | null;
    login: (user: User) => Promise<LoginResponse>;
    logout: () => void;
    isLoggedIn: () => boolean;
    isLoggedInAs: (role: string[]) => boolean;
}

// create a context with a default value of null is used to indicate that the context will be provided later
const AuthContext = createContext<AuthContextType>(null!);

// allows fx the App component as a child of this component
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialUserName = localStorage.getItem("username") || null; // get the initial authentication status from localStorage
    const [username, setUserName] = useState<string | null>(initialUserName); // state to track if the user is authenticated

    const login = async (user_: LoginRequest) => {
        return authProvider.signIn(user_)
            .then((user) => {
                setUserName(user.username); // set the userName state to the username from the response
                localStorage.setItem("username", user.username); // store the username in localStorage
                localStorage.setItem("token", user.token); // store the token in localStorage
                localStorage.setItem("roles", JSON.stringify(user.roles)); // store the roles in local
                return user; // return the user object
            });
    }

    const logout = () => {
        setUserName(null); // clear the userName state
        // clear the localStorage to remove any stored authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
    }

    function isLoggedIn() {
        return username != null; // check if the user is authenticated
    }

    function isLoggedInAs(role: string[]) {
        const roles: Array<string> = JSON.parse(localStorage.getItem("roles") || "[]"); // get the roles from localStorage, default to an empty array if not found
        return roles?.some((r) => role.includes(r)) || false; // return true if the user has at least one of the roles passed in, otherwise false
    }

    const value = { username, login, logout, isLoggedIn, isLoggedInAs };

    // AuthContext has a provider because it is a context, and it provides the value to its children. 
    // So this is were 'value' is passed down to all components that are children of AuthProvider
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext); // a custom hook to access the AuthContext value
}