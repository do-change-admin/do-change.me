"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { Button, Group } from "@mantine/core";
import PdfDownloader from "./downloader";
import { useRouter } from "next/navigation";
import { FaBackspace } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

export default function ReportPage() {
    const [reportHtml, setReportHtml] = useState<string | null>(null);
    const router = useRouter()
    const source = sessionStorage.getItem("source")

    useEffect(() => {
        const html = sessionStorage.getItem("report");
        if (html) setReportHtml(html);
    }, []);


    if (!reportHtml) return <p>Loading report...</p>;

    return (
        <div>
            <Group justify="space-between" p='1rem 2rem'>
                <Button leftSection={<FaArrowLeft />} radius={'lg'} variant="light" onClick={() => { router.back() }}>Go back</Button>
                {source === 'stable' ? <></> : <PdfDownloader markup={reportHtml!} />}
            </Group>

            {source === 'stable' ?
                <iframe
                    style={{ width: "100%", minHeight: "100vh" }}
                    srcDoc={reportHtml}
                    title="Carfax Report"
                /> : <div className={styles.container} dangerouslySetInnerHTML={{ __html: reportHtml! }} />
            }
        </div>
    );
}
