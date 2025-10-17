'use client'

import { useRef } from "react";
import { Button } from "@mantine/core";

export type Props = {
    markup: string
}

export default function PdfDownloader({ markup }: Props) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleDownload = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(markup);
        doc.close();

        iframe.onload = () => {
            const html2pdf = require('html2pdf.js')
            const body = iframe.contentDocument?.body;
            if (!body) return;

            html2pdf()
                .set({
                    margin: 0.5,
                    filename: "downloaded-document.pdf",
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
                })
                .from(body)
                .save();
        };
    };

    return (
        <>
            <Button onClick={handleDownload}>📄 Download PDF</Button>
            <iframe
                ref={iframeRef}
                style={{ display: "none" }}
                title="pdf-generator"
            />
        </>
    );
}
