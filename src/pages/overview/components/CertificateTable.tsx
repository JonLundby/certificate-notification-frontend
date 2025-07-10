import "./table.css";
import React from "react";
import { type Certificate, type Note } from "../../../services/apiFacade";
import { useState, useEffect } from "react";
import CertificateModal from "./CertificateModal";

const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

export default function CertificateTable({
    certificates,
    onAddNote,
    onUpdateCertificate,
}: {
    certificates: Certificate[];
    onAddNote: (certificateId: number, note: Note) => void;
    onUpdateCertificate: (updatedCert: Certificate) => void;
}) {
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    // Update selectedCert when certificates change 
    useEffect(() => {
        // If selectedCert is not null then the modal is open and the certificate shown in the modal is updated
        if (selectedCert) {
            const updated = certificates.find((c) => c.id === selectedCert.id); // Find the updated certificate
            if (updated) setSelectedCert(updated); // Update selectedCert if it exists in the new certificates list
        }
    }, [certificates, selectedCert]);

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Subject</th>
                        <th>Date not before</th>
                        <th>Date not after</th>
                        <th>URIs</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map((certificate) => (
                        <React.Fragment key={certificate.id}>
                            <tr className={expandedIds.has(certificate.id) ? "no-border-bottom" : ""}>
                                <td>{certificate.type}</td>
                                <td>
                                    {certificate.subject.split(",").map((part, index) => (
                                        <span key={index}>
                                            {part.trim()}
                                            <br />
                                        </span>
                                    ))}
                                </td>
                                <td>{new Date(certificate.dateNotBefore).toLocaleDateString("da-DK", dateOptions)}</td>
                                <td>
                                    {new Date(certificate.dateNotAfter).toLocaleDateString("da-DK", dateOptions)}
                                    {/* calculating if the certificate is expiring within 60 days */}
                                    {/* ADJUST TO DESIRABLE TIMEFRAME FX: 7 * 24 *... FOR A 7 DAY WARNING*/}
                                    {new Date(certificate.dateNotAfter).getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000 && (
                                        <span> ⚠️</span>
                                    )}
                                </td>
                                <td>{certificate.uris.length}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedCert(certificate);
                                        }}
                                    >
                                        Details
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => toggleExpand(certificate.id)}>
                                        {expandedIds.has(certificate.id) ? "Collapse ⏶" : "Expand ⏷"}
                                    </button>
                                </td>
                            </tr>
                            {expandedIds.has(certificate.id) && (
                                <tr className="tr-expanded">
                                    <td colSpan={5}>
                                        <ul>
                                            {certificate.uris.map((uri) => (
                                                <li key={uri.id}>{uri.uri}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    {/* Empty cell for alignment */}
                                    <td></td>
                                    {/* Empty cell for alignment */}
                                    <td></td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {selectedCert && (
                <CertificateModal
                    key={selectedCert.id} // Ensure modal updates when certificate changes
                    certificate={selectedCert}
                    onClose={() => {
                        setSelectedCert(null);
                    }}
                    onAddNote={onAddNote}
                    onUpdateCertificate={onUpdateCertificate}
                />
            )}
        </>
    );
}
