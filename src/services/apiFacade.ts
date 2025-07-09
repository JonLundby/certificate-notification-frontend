const CERTIFICATES_URL = "http://localhost:8080/certificates";
const URIS_URL = "http://localhost:8080/uris";
const SCAN_URL = "http://localhost:8080/uris/scan";

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

export { fetchCertificates, fetchURIs, scanUrisAndFetchCertificates };
