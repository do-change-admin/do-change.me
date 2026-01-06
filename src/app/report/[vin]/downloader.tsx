'use client';

import { Button } from '@mantine/core';
import { useRef } from 'react';
import { FaDownload } from 'react-icons/fa';

export type Props = {
    markup: string;
};

export default function PdfDownloader({}: Props) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const download = () => {
        const iframe = document.getElementById('print-area');

        // @ts-expect-error types
        iframe!.contentWindow!.focus();
        // @ts-expect-error types
        iframe!.contentWindow!.print();
    };

    return (
        <>
            <Button leftSection={<FaDownload />} onClick={download} radius="lg">
                PDF
            </Button>
            <iframe ref={iframeRef} style={{ display: 'none' }} title="pdf-generator" />
        </>
    );
}
