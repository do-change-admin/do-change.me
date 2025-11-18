"use client";

import { useEffect, useState } from "react";
import { Button, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

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
            <Group justify="space-between" p='1rem 2rem'>
                <Button leftSection={<FaArrowLeft />} radius={'lg'} variant="light" onClick={() => { router.back() }}>Go back</Button>
            </Group>

            <iframe
                style={{ width: "100%", minHeight: "100vh" }}
                srcDoc={reportHtml}
                title="Carfax Report"
            />
        </div>
    );
}
