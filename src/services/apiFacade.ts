const CERTIFICATES_URL = "http://localhost:8080/certificates";
const URIS_URL = "http://localhost:8080/uris";

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

export { fetchCertificates, fetchURIs };
