"use client";
import exportToPdf from "./ExportToPdf";

const RequestDetails = ({ request }) => {
    console.log(request);

    return (
        <>
            <h1>
                Request Details
            </h1>
            <ul>
                {Object.entries(request).map(([key, value]) => (
                    <li>
                        <strong>{key ?? ''}: </strong>
                        {value ?? ''}
                    </li>
                ))}
            </ul>
            <button onClick={() => exportToPdf(request)}>EXPORTAR PARA PDF</button>
        </>
    );
}
export default RequestDetails;