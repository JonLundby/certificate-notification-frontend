import "./certificateModal.css";
import { type Certificate } from "../../../services/apiFacade";

const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

export default function CertificateModal({ certificate, onClose }: { certificate: Certificate; onClose: () => void }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h1 className="modal-title">certificate details</h1>
                <div className="modal-details">
                    <p>
                        <strong>Type:</strong> {certificate.type === "Both" ? "Server & Client" : certificate.type}
                    </p>
                    <p>
                        <strong>Subject:</strong>{" "}
                        {certificate.subject.split(",").map((part, index) => (
                            <span key={index} className="subject-part">
                                {part.trim()}
                                <br />
                            </span>
                        ))}
                    </p>
                    <p>
                        <strong>Issuer:</strong>{" "}
                        {certificate.issuerSerialNumberId
                            .substring(0, certificate.issuerSerialNumberId.indexOf("#"))
                            .split(",")
                            .map((part, index) => (
                                <span key={index} className="subject-part">
                                    {part.trim()}
                                    <br />
                                </span>
                            ))}
                    </p>
                    <p>
                        <strong>Serial number:</strong>{" "}
                        {certificate.issuerSerialNumberId.substring(
                            certificate.issuerSerialNumberId.indexOf("#"),
                            certificate.issuerSerialNumberId.length
                        )}
                    </p>
                    <br />
                    <p>
                        <strong>Certificate location:</strong> {certificate.certificateLocation || "N/A"}
                    </p>
                    <p>
                        <strong>Password location:</strong> {certificate.passwordLocation || "N/A"}
                    </p>
                    <p>
                        <strong>Private key location:</strong> {certificate.privateKeyLocation || "N/A"}
                    </p>
                </div>
                <div className="modal-date-details">
                    <p>
                        <strong>Date not before:</strong> {new Date(certificate.dateNotBefore).toLocaleTimeString("da-DK", dateOptions)}
                    </p>
                    <p>
                        <strong>Date not after:</strong> {new Date(certificate.dateNotAfter).toLocaleTimeString("da-DK", dateOptions)}
                    </p>
                    <p>
                        <strong>Notified at 60 days:</strong> {certificate.notifiedAt60Days || "N/A"}
                    </p>
                    <p>
                        <strong>Notified at 30 days:</strong> {certificate.notifiedAt30Days || "N/A"}
                    </p>
                    <p>
                        <strong>Notified at 14 days:</strong> {certificate.notifiedAt14Days || "N/A"}
                    </p>
                    <br />
                    <p>
                        <strong>URIs:</strong>
                    </p>
                    <ul>
                        {certificate.uris.map((uri) => (
                            <li key={uri.id}>{uri.uri}</li>
                        ))}
                    </ul>
                </div>
                <div className="modal-notes">
                    <br />
                    <p>
                        <strong>Notes:</strong>
                    </p>
                    <ul>
                        {[...certificate.notes]
                            .sort((a, b) => new Date(b.localDateTimeStamp).getTime() - new Date(a.localDateTimeStamp).getTime())
                            .map((note) => (
                                <li key={note.id}>
                                    <i>
                                        {new Date(note.localDateTimeStamp).toLocaleTimeString("da-DK", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}{" "}
                                    </i>
                                    - {note.text}
                                </li>
                            ))}
                    </ul>
                </div>
                <button onClick={onClose}>close</button>
            </div>
        </div>
    );
}
