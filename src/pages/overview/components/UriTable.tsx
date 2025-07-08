import "./table.css";
import { type URI } from "../../../services/apiFacade";

export default function CertificateTable({uris}: { uris: URI[] }) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {uris.map((uri) => (
                        <tr key={uri.id}>
                            <td>{uri.uri}</td>
                            <td>
                                <button onClick={() => alert(`Implement delete functionality to remove:\nURI ID: ${uri.id}`)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}