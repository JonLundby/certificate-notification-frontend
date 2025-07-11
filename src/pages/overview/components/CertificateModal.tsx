import "./certificateModal.css";
import { type Certificate, type Note } from "../../../services/apiFacade";
import { useState, useEffect } from "react";
import { addNoteToCertificate, updateCertificateEditableFields, updateEditedNote, deleteNote } from "../../../services/apiFacade";

const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

export default function CertificateModal({
    certificate,
    onClose,
    onAddNote,
    onUpdateCertificate,
    onDeleteNote,
}: {
    certificate: Certificate;
    onClose: () => void;
    onAddNote: (certificateId: number, note: Note) => void;
    onUpdateCertificate: (updatedCert: Certificate) => void;
    onDeleteNote: (noteId: number) => void;
}) {
    const [newNoteText, setNewNoteText] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [notes, setNotes] = useState<Note[]>(certificate.notes);
    const [isUpdatingEditableFields, setIsUpdatingEditableFields] = useState(false);
    const [editableFields, setEditableFields] = useState({
        certificateLocation: certificate.certificateLocation || "",
        passwordLocation: certificate.passwordLocation || "",
        privateKeyLocation: certificate.privateKeyLocation || "",
    });
    const [currentlyEditingNoteId, setCurrentlyEditingNoteId] = useState<number | null>(null);
    const [noteDraftText, setNoteDraftText] = useState(""); // for the currently edited note

    // When the component mounts, we set the editable fields to the current values of the certificate
    useEffect(() => {
        setEditableFields({
            certificateLocation: certificate.certificateLocation || "",
            passwordLocation: certificate.passwordLocation || "",
            privateKeyLocation: certificate.privateKeyLocation || "",
        });
    }, [certificate]);

    const handleAddNote = async () => {
        try {
            const newNote = await addNoteToCertificate(certificate.id, newNoteText);
            onAddNote(certificate.id, newNote); // Update parent state
            setNotes((prevNotes) => [...prevNotes, newNote]); // Update local state
            setNewNoteText("");
            setIsAddingNote(false);
        } catch (err) {
            console.error("Failed to add note:", err);
        }
    };

    // When the user clicks update, the editable fields are sent to the backend
    const handleUpdateCertificateEditableFields = async () => {
        if (!isUpdatingEditableFields) {
            setIsUpdatingEditableFields(true);
        } else {
            const updatedCertificate = await updateCertificateEditableFields(certificate.id, {
                certificateLocation: editableFields.certificateLocation,
                passwordLocation: editableFields.passwordLocation,
                privateKeyLocation: editableFields.privateKeyLocation,
            });
            onUpdateCertificate(updatedCertificate); // Update parent state in Overview.tsx
            setIsUpdatingEditableFields(false);
        }
    };

    // When the user clicks cancel, the editable fields which are used in the input fields are reset to the original values
    const handleCancelUpdateEditableFields = () => {
        setEditableFields({
            certificateLocation: certificate.certificateLocation || "",
            passwordLocation: certificate.passwordLocation || "",
            privateKeyLocation: certificate.privateKeyLocation || "",
        });
        setIsUpdatingEditableFields(false);
    };

    const handleSaveNote = async (noteId: number) => {
        try {
            const updatedNote = await updateEditedNote(noteId, noteDraftText);
            setNotes((prevNotes) => prevNotes.map((note) => (note.id === noteId ? updatedNote : note)));
            setCurrentlyEditingNoteId(null);
        } catch (err) {
            console.error("Failed to update note:", err);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        try {
            await deleteNote(noteId);
            onDeleteNote(noteId); // Update parent state in Overview.tsx
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
            if (currentlyEditingNoteId === noteId) {
                setCurrentlyEditingNoteId(null);
                setNoteDraftText("");
            }
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    }   

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
                        <strong>Certificate location: </strong>
                        {!isUpdatingEditableFields ? (
                            certificate.certificateLocation || "N/A"
                        ) : (
                            <input
                                placeholder="type new location..."
                                value={editableFields.certificateLocation}
                                onChange={(e) => setEditableFields({ ...editableFields, certificateLocation: e.target.value })}
                            ></input>
                        )}
                    </p>
                    <p>
                        <strong>Password location: </strong>
                        {!isUpdatingEditableFields ? (
                            certificate.passwordLocation || "N/A"
                        ) : (
                            <input
                                placeholder="type new location..."
                                value={editableFields.passwordLocation}
                                onChange={(e) => setEditableFields({ ...editableFields, passwordLocation: e.target.value })}
                            ></input>
                        )}
                    </p>
                    <p>
                        <strong>Private key location: </strong>
                        {!isUpdatingEditableFields ? (
                            certificate.privateKeyLocation || "N/A"
                        ) : (
                            <input
                                placeholder="type new location..."
                                value={editableFields.privateKeyLocation}
                                onChange={(e) => setEditableFields({ ...editableFields, privateKeyLocation: e.target.value })}
                            ></input>
                        )}
                    </p>
                    <button onClick={handleUpdateCertificateEditableFields}>
                        {!isUpdatingEditableFields ? "Update locations" : "Save"}
                    </button>
                    {isUpdatingEditableFields && <button onClick={handleCancelUpdateEditableFields}>Cancel</button>}
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
                                    -{" "}
                                    {currentlyEditingNoteId === note.id ? (
                                        <>
                                            <textarea className="edit-note-text-area" value={noteDraftText} onChange={(e) => setNoteDraftText(e.target.value)} />
                                            <br />
                                            <button onClick={() => handleSaveNote(note.id)}>Save</button>
                                            <button onClick={() => setCurrentlyEditingNoteId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                                {note.text}
                                                <br />
                                            <button
                                                onClick={() => {
                                                    setCurrentlyEditingNoteId(note.id);
                                                    setNoteDraftText(note.text);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                                        </>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>
                <button onClick={onClose}>close</button>
            </div>
        </div>
    );
}
