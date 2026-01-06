'use client';

import { Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import PdfDownloader from './downloader';
import styles from './page.module.css';

export default function ReportPage() {
    const [reportHtml, setReportHtml] = useState<string | null>(null);
    const router = useRouter();
    const source = 'stable';

    useEffect(() => {
        const html = sessionStorage.getItem('report');
        if (html) setReportHtml(html);
    }, []);

    if (!reportHtml) return <p>Loading report...</p>;

    return (
        <div>
            <Group justify="space-between" p="1rem 2rem">
                <Button
                    leftSection={<FaArrowLeft />}
                    onClick={() => {
                        router.back();
                    }}
                    radius={'lg'}
                    variant="light"
                >
                    Go back
                </Button>
                <PdfDownloader markup={reportHtml!} />
            </Group>

            {source === 'stable' ? (
                <iframe
                    id="print-area"
                    srcDoc={reportHtml}
                    style={{ width: '100%', minHeight: '100vh' }}
                    title="Carfax Report"
                />
            ) : (
                <div className={styles.container} dangerouslySetInnerHTML={{ __html: reportHtml! }} />
            )}
        </div>
    );
}
