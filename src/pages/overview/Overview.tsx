import "./overview.css";
import { useState, useEffect } from "react";
import CertificateTable from "./components/CertificateTable";
import UriTable from "./components/UriTable";
import { fetchCertificates, fetchURIs, type Certificate, type URI } from "../../services/apiFacade";

export default function Overview() {
    const [selectedTab, setSelectedTab] = useState<"certificates" | "uris">("certificates");
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [uris, setUris] = useState<URI[]>([]);


    useEffect(() => {
        fetchCertificates()
            .then((certificates) => {
                console.log("Fetched certificates:", certificates);
                setCertificates(certificates);
            })
            .catch((error) => {
                console.error("Error fetching certificates:", error);
            });
        fetchURIs()
            .then((uris) => {
                console.log("Fetched URIs:", uris);
                setUris(uris);
            })
            .catch((error) => {
                console.error("Error fetching URIs:", error);
            });
    }, []);

    return (
        <div className="overview-page-container">
            <div className="tab-buttons">
                <button className="tab-button" onClick={() => setSelectedTab("certificates")}>
                    Certificates
                </button>
                <button className="tab-button" onClick={() => setSelectedTab("uris")}>
                    URIs
                </button>
            </div>

            {selectedTab === "certificates" ? <CertificateTable certificates={certificates} /> : <UriTable uris={uris} />}
            <br />
        </div>
    );
}
