import "./CertificateUpload.css";
import { useState, useRef, useEffect } from "react";
import { uploadCertificate } from "../../services/apiFacade";

export default function CertificateUpload() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    useEffect(() => {
        setInfoMessage("Please select a certificate file to upload (e.g., .crt or .pem format).");
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCertificateFile(file);
            setInfoMessage(`Selected file: ${file.name}`);
        }
    }
    
    const handleUpload = async () => {
        if (!certificateFile) {
            return;
        }
        
        setIsUploading(true);

        try {
            await uploadCertificate(certificateFile);
            setCertificateFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setInfoMessage("Certificate uploaded successfully!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setInfoMessage(err.message);
                console.log("Upload error:", err.message);
            } else {
                setInfoMessage("An unexpected error occurred while uploading the certificate.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="certificate-upload-container">
            {infoMessage && <p className="info-message">{infoMessage}</p>}

            <input className="certificate-upload-input" type="file" accept=".crt,.pem" ref={fileInputRef} onChange={handleFileChange} />
            <button className="certificate-upload-button" onClick={handleUpload}>
                {!isUploading ? "Upload Certificate" : "Uploading..."}
            </button>
        </div>
    );
}
