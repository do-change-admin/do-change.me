'use client'

import { useRef } from "react";
import { Button } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import { useParams } from "next/navigation";

export type Props = {
    markup: string;
};

export default function PdfDownloader({ markup }: Props) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { vin } = useParams();

    const handleDownload = async () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // Безопасно вставляем HTML в iframe
        doc.open();
        doc.write('<!DOCTYPE html><html><head><style>body{margin:0;padding:0;}</style></head><body></body></html>');
        doc.close();
        doc.body.innerHTML = markup;

        // Ждем, пока браузер отрисует контент
        setTimeout(async () => {
            const body = iframe.contentDocument?.body;
            if (!body) return;

            const html2pdf = (await import('html2pdf.js')).default;

            html2pdf()
                .set({
                    margin: 0,
                    filename: String(vin),
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
                })
                .from(body)
                .save();
        }, 200);
    };

    return (
        <>
            <Button leftSection={<FaDownload />} radius="lg" onClick={handleDownload}>
                PDF
            </Button>
            <iframe
                ref={iframeRef}
                style={{ display: "none" }}
                title="pdf-generator"
            />
        </>
    );
}
