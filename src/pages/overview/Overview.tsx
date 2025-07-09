import "./overview.css";
import { useState, useEffect } from "react";
import CertificateTable from "./components/CertificateTable";
import UriTable from "./components/UriTable";
import { fetchCertificates, fetchURIs, scanUrisAndFetchCertificates, type Certificate, type URI } from "../../services/apiFacade";

export default function Overview() {
    const [selectedTab, setSelectedTab] = useState<"certificates" | "uris">("certificates");
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [uris, setUris] = useState<URI[]>([]);
    const [isScanning, setIsScanning] = useState(false);


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

    const handleScanUris = async () => {
        setIsScanning(true);
        try {
            const updatedCertificates = await scanUrisAndFetchCertificates();
            setCertificates(updatedCertificates);
        } catch (err) {
            console.error("Error scanning URIs:", err);
        } finally {
            setIsScanning(false);
        }
    };


    return (
        <div className="overview-page-container">
            <button onClick={handleScanUris} disabled={isScanning}>
                {isScanning ? "Scanning URIs..." : "Scan all URI"}
            </button>
            <br />

            <div className="tab-buttons">
                <button className="tab-button" onClick={() => setSelectedTab("certificates")} disabled={isScanning}>
                    Certificates
                </button>
                <button className="tab-button" onClick={() => setSelectedTab("uris")} disabled={isScanning}>
                    URIs
                </button>
            </div>

            {selectedTab === "certificates" ? <CertificateTable certificates={certificates} /> : <UriTable uris={uris} />}
            <br />
        </div>
    );
}
