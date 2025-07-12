import "./CertificateUpload.css";
import { useState, useRef } from "react";
import { uploadCertificate } from "../../services/apiFacade";

export default function CertificateUpload() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCertificateFile(file);
            setError(null); // Clear any previous error

        }
    }

    const handleUpload = async () => {
        if (!certificateFile) {
            setError("Please select a certificate file to upload.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            await uploadCertificate(certificateFile);
            setCertificateFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Failed to upload certificate. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="certificate-upload-container">
            
            {!error && !isUploading && !certificateFile && <p className="certificate-upload-instructions">Select a certificate file to upload.</p>}
            
            {error && <p className="Failed to upload certificate">{error}</p>}
            
            <input className="certificate-upload-input" type="file" accept=".crt,.pem" ref={fileInputRef} onChange={handleFileChange} />
            <button className="certificate-upload-button" onClick={handleUpload}>
                {!isUploading ? "Upload Certificate" : "Uploading..."}
            </button>
        </div>
    );
}
