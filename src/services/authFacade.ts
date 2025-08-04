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
    signIn(user_: LoginRequest): Promise<LoginResponse> {
        return new Promise((resolve, reject) => {
            // !!! IMPORTANT: This is a mock implementation. Replace with actual API call...
            // ...user_ should be validated against a real backend service. !!!
            if (user_.username === "admin" && user_.password === "1234") {
                const fakeResponse: LoginResponse = {
                    username: "admin",
                    token: "fake-jwt-token",
                    roles: ["admin", "user"],
                };
                resolve(fakeResponse);
            } else {
                reject(new Error("Invalid credentials"));
            }
        });
    },
};

export type { LoginResponse, LoginRequest };
export { authProvider };
