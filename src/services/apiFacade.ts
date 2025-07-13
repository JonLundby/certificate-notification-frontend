const CERTIFICATES_URL = "http://localhost:8080/certificates";
const URIS_URL = "http://localhost:8080/uris";
const SCAN_URL = "http://localhost:8080/uris/scan";
const NOTES_URL = "http://localhost:8080/notes";

export interface Certificate {
    id: number;
    issuerSerialNumberId: string;
    type: string;
    subject: string;
    dateNotBefore: string;
    dateNotAfter: string;
    notifiedAt60Days: string | null;
    notifiedAt30Days: string | null;
    notifiedAt14Days: string | null;
    certificateLocation: string | null;
    passwordLocation: string | null;
    privateKeyLocation: string | null;
    uris: URI[];
    notes: Note[];
}

export interface URI {
    id: number;
    uri: string;
    certificateId: number;
}

export interface Note {
    id: number;
    localDateTimeStamp: string;
    text: string;
    certificateId: number;
}

async function fetchCertificates(): Promise<Certificate[]> {
    const response = await fetch(CERTIFICATES_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch certificates: ${response.statusText}`);
    }
    return response.json();
}

async function fetchURIs(): Promise<URI[]> {
    const response = await fetch(`${URIS_URL}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch URIs: ${response.statusText}`);
    }
    return response.json();
}

async function uploadURI(uriText: string): Promise<void> {
    const response = await fetch(URIS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: uriText,
    });
    if (!response.ok) {
        throw new Error(`Failed to upload URIs: ${response.statusText}`);
    }
}

async function scanUrisAndFetchCertificates(): Promise<Certificate[]> {
    const response = await fetch(SCAN_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to scan URIs: ${response.statusText}`);
    }

    // Optionally wait a moment if backend is async
    // await new Promise(res => setTimeout(res, 1000));

    return fetchCertificates();
}

async function addNoteToCertificate(certificateId: number, noteText: string): Promise<Note> {
    const response = await fetch(`${CERTIFICATES_URL}/${certificateId}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: noteText }),
    });
    if (!response.ok) {
        throw new Error(`Failed to add note: ${response.statusText}`);
    }
    return response.json();
}

async function updateCertificateEditableFields(
    certificateId: number,
    locations: {
        certificateLocation?: string;
        passwordLocation?: string;
        privateKeyLocation?: string;
    }
): Promise<Certificate> {
    const response = await fetch(`${CERTIFICATES_URL}/${certificateId}/editable-properties`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(locations),
    });
    if (!response.ok) {
        throw new Error(`Failed to update certificate locations: ${response.statusText}`);
    }
    return response.json();
}

async function updateEditedNote(noteId: number, noteText: string): Promise<Note> {
    const response = await fetch(`${NOTES_URL}/${noteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: noteText }),
    });
    if (!response.ok) {
        throw new Error(`Failed to update note: ${response.statusText}`);
    }
    return response.json();
}

async function deleteNote(noteId: number): Promise<void> {
    const response = await fetch(`${NOTES_URL}/${noteId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.statusText}`);
    }
}

async function uploadCertificate(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${CERTIFICATES_URL}/upload/client`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        if (response.status === 409) {
            throw new Error("Certificate already exists. Please check the certificate overview.");
        } else {
            throw new Error(`Failed to upload certificate: ${response.statusText}`);
        }
    }
    
    return response.json();
}

export {
    fetchCertificates,
    fetchURIs,
    uploadURI,
    scanUrisAndFetchCertificates,
    addNoteToCertificate,
    updateCertificateEditableFields,
    updateEditedNote,
    deleteNote,
    uploadCertificate
};
