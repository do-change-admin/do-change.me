"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { Button } from "@mantine/core";
import PdfDownloader from "./downloader";
import { useRouter } from "next/navigation";

export default function ReportPage() {
    const [reportHtml, setReportHtml] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        const html = sessionStorage.getItem("report");
        if (html) setReportHtml(html);
    }, []);

    if (!reportHtml) return <p>Loading report...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
                <PdfDownloader markup={reportHtml!} />
                <Button variant="light" onClick={() => { router.back() }}>Go back</Button>
            </div>

            <div className={styles.container} dangerouslySetInnerHTML={{ __html: reportHtml! }} />
        </div>
    );
}
