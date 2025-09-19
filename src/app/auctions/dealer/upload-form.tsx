'use client';

import { useState } from 'react';

export type UploadFormProps = {
    variant: "license" | "agreement"
}

export default function UploadForm({ variant }: UploadFormProps) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        const res = await fetch('/api/auction-access-requests/files?variant=' + variant, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setFileUrl(data.url);
    };

    return (
        <form onSubmit={handleUpload}>
            <input accept='.png,.jpg,.jpeg,.pdf' type="file" name="file" required />
            <button type="submit">Upload</button>

            {fileUrl && (
                <div>
                    <p>File was uploaded:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {fileUrl}
                    </a>
                </div>
            )}
        </form>
    );
}
