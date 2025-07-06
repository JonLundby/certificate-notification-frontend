import CertificateTable from "../components/CertificateTable";
import UriTable from "../components/UriTable";
import "./overview.css";
import { useState } from "react";

export default function Overview() {
    const [selectedTab, setSelectedTab] = useState<"certificates" | "uris">("certificates");
    
    
    return (
        <div>
            <h1>Overview Page</h1>
            <div className="tab-buttons">
                <button onClick={() => setSelectedTab("certificates") }>Certificates</button>
                <button onClick={() => setSelectedTab("uris") }>URIs</button>
            </div>

            {selectedTab === "certificates" ? (
                <CertificateTable />
            ) : (
                <UriTable />
            )}
            
        </div>
    );
}
