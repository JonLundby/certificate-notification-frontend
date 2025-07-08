import "./table.css";
import { type Certificate } from "../../../services/apiFacade";
import { useState } from "react";

export default function CertificateTable({ certificates }: { certificates: Certificate[] }) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    return (
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Date not before</th>
                    <th>Date not after</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {certificates.map((certificate) => (
                    <>
                        <tr key={certificate.id}>
                            <td>{certificate.type}</td>
                            <td>
                                {certificate.subject.split(",").map((part, idx) => (
                                    <span key={idx}>
                                        {part.trim()}
                                        <br />
                                    </span>
                                ))}
                            </td>
                            <td>{new Date(certificate.dateNotBefore).toLocaleDateString()}</td>
                            <td>{new Date(certificate.dateNotAfter).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => setSelectedCert(certificate)}>Details</button>
                            </td>
                            <td>
                                <button onClick={() => setExpandedId(expandedId === certificate.id ? null : certificate.id)}>
                                    {expandedId === certificate.id ? "Collapse ⏶" : "Expand URI ⏷"}
                                </button>
                            </td>
                        </tr>
                        {expandedId === certificate.id && (
                            <tr>
                                <td colSpan={5}>
                                    <ul>
                                        {certificate.uris.map((uri) => (
                                            <li key={uri.id}>{uri.uri}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
            </tbody>
        </table>
    );
}
