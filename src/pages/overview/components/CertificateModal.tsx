import "./certificateModal.css";
import { type Certificate, type Note } from "../../../services/apiFacade";
import { useState } from "react";
import { addNoteToCertificate } from "../../../services/apiFacade";


const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

export default function CertificateModal({ certificate, onClose, onAddNote }: { certificate: Certificate; onClose: () => void; onAddNote: (certificateId: number, note: Note) => void }) {
    const [newNoteText, setNewNoteText] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [notes, setNotes] = useState<Note[]>(certificate.notes);

    const handleAddNote = async () => {
        try {
            console.log("adding note to certificate:", certificate.id, "with text:", newNoteText);
            const newNote = await addNoteToCertificate(certificate.id, newNoteText);
            console.log("New note returned from backend:", newNote);
            onAddNote(certificate.id, newNote); // Update parent state
            setNotes((prevNotes) => [...prevNotes, newNote]); // Update local state
            setNewNoteText("");
            setIsAddingNote(false);
        } catch (err) {
            console.error("Failed to add note:", err);
        }
    };

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
                            certificate.issuerSerialNumberId.indexOf("#") + 1,
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
                    {!isAddingNote && (
                        <p>
                            <strong>Notes:</strong>
                            <button className="new-note-btn" onClick={() => setIsAddingNote(true)}>
                                New note
                            </button>
                        </p>
                    )}
                    {isAddingNote && (
                        <div className="new-note-form">
                            <textarea
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                placeholder="Write your note here..."
                            />
                            <div className="new-note-btns">
                                <button onClick={handleAddNote}>Add note</button>
                                <button onClick={() => setIsAddingNote(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                    
                    <ul>
                        {[...notes]
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
