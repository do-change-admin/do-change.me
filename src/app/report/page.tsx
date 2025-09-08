"use client";

import { useEffect, useState } from "react";

export default function ReportPage() {
    const [reportHtml, setReportHtml] = useState<string | null>(null);

    useEffect(() => {
        const html = sessionStorage.getItem("report");
        if (html) setReportHtml(html);
    }, []);

    if (!reportHtml) return <p>Loading report...</p>;

    return (
        <iframe
            style={{ width: "100%", minHeight: "100vh" }}
            srcDoc={reportHtml}
            title="Carfax Report"
        />
    );
}
