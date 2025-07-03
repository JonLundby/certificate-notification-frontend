// import { API_URL } from "../settings";
// import { makeOptions, handleHttpErrors } from "./fetchUtils";
// const LOGIN_URL = API_URL + "/api/auth/login";

export type User = { username: string; password: string; roles?: string[] };

interface LoginResponse {
    username: string;
    token: string;
    roles: Array<string>;
}

interface LoginRequest {
    username: string;
    password: string;
}

const authProvider = {
    isAuthenticated: false,
    signIn(user_: LoginRequest): Promise<LoginResponse> { // user_ is of type LoginRequest and prom
        // const options = makeOptions("POST", user_);
        // return fetch(LOGIN_URL, options).then(handleHttpErrors);
        return new Promise((resolve, reject) => {
            // You can add validation logic here if needed
            if (user_.username === "admin" && user_.password === "1234") {
                const fakeResponse: LoginResponse = {
                    username: "admin",
                    token: "fake-jwt-token",
                    roles: ["admin", "user"],
                };
                localStorage.setItem("roles", JSON.stringify(fakeResponse.roles)); // Store roles
                resolve(fakeResponse);
            } else {
                reject(new Error("Invalid credentials"));
            }
        });
    },
};

export type { LoginResponse, LoginRequest };
export { authProvider };
