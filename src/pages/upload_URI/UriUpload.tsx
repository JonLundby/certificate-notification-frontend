import "./uriUpload.css";
import { useState } from "react";
import { uploadURI } from "../../services/apiFacade";

export default function UriUpload() {
    const [uriText, setUriText] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

    const handleUpload = async () => {
        setStatus("uploading");
        try {
            await uploadURI(uriText);
            setStatus("success");
            setUriText(""); // Clear the input after successful upload
        } catch (error) {
            console.error("Upload failed:", error);
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