import "./App.css";
import Layout from "./Layout";
import { Route, Routes } from "react-router-dom";
import Login from "./security/Login";
import Overview from "./pages/overview/Overview";
import UriUpload from "./pages/upload_URI/UriUpload";
import CertificateUpload from "./pages/upload_client_certificate/CertificateUpload";
import { useAuth } from "./security/AuthProvider";
import RequireAuth from "./security/RequireAuth";
import Logout from "./security/Logout";
import { Navigate } from "react-router-dom";

export default function App() {
    const auth = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected routes inside Layout */}
            <Route
                element={
                    <RequireAuth roles={["admin", "user"]}>
                        <Layout />
                    </RequireAuth>
                }
            >
                <Route path="/overview" element={<Overview />} />
                <Route path="/uploaduri" element={<UriUpload />} />
                <Route path="/uploadcertificate" element={<CertificateUpload />} />
            </Route>

            {/* Redirect unknown paths */}
            <Route path="*" element={auth.isLoggedIn() ? <Navigate to="/overview" /> : <Navigate to="/login" />} />
        </Routes>
    );
}
