import "./uriUpload.css";
import { useState } from "react";

export default function UriUpload() {
    const [uriText, setUriText] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

    const handleUpload = async () => {
        setStatus("uploading");
        try {
            const response = await fetch("http://localhost:8080/uris", {
                method: "POST",
                headers: { "content-type": "text/plain" },
                body: uriText,
            });
            if (!response.ok) {
                throw new Error(`Upload failed! status: ${response.status}`);
            }
            setStatus("success");
        } catch (error) {
            console.error("Error uploading URIs:", error);
            setStatus("error");
        }
    }


    return (
        <div className="uri-upload-container">
            <p>Enter a list of URI that you want to upload</p>
            <p>( each uri must be line separated! )</p>
            <br />

            <textarea
                rows={10}
                cols={10}
                placeholder={`https://example.com\nldaps://another.com\nimaps://a-third.com`}
                value={uriText}
                onChange={(e) => setUriText(e.target.value)}
            />
            <button onClick={handleUpload}>{status === "uploading" ? "Uploading..." : "Upload"}</button>

            {status === "success" && <p style={{ color: "lightgreen" }}>Upload successful!</p>}
            {status === "error" && <p style={{ color: "red" }}>Upload failed.</p>}
        </div>
    );
}