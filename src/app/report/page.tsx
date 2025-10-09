"use client";

import { useEffect, useState } from "react";
import styles from  './page.module.css';

export default function ReportPage() {
    const [reportHtml, setReportHtml] = useState<string | null>(null);

    useEffect(() => {
        const html = sessionStorage.getItem("report");
        if (html) setReportHtml(html);
    }, []);

    if (!reportHtml) return <p>Loading report...</p>;

    return (
        <div className={styles.container} dangerouslySetInnerHTML={{ __html: reportHtml! }} />
    );
}
