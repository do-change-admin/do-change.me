'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';
import { useScannerState } from '@/client/states/scanner.state';
import { VIN } from '@/value-objects/vin.value-object';
import { useRecognize } from './query';
import styles from './Scanner.module.css';

export const Scanner = () => {
    const { open, stop, setResult } = useScannerState(
        useShallow(({ open, stop, setResult }) => ({ open, stop, setResult }))
    );
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanning, setScanning] = useState(false);

    const recognize = useRecognize();

    // запуск камеры при открытии
    useEffect(() => {
        if (!open) return;
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setScanning(true);
        };
        startCamera();
    }, [open]);

    // авто-сканирование
    useEffect(() => {
        if (!scanning || !open) return;
        const interval = setInterval(() => captureAndSend(), 2000);
        return () => clearInterval(interval);
    }, [scanning, open]);

    const captureAndSend = async () => {
        if (!videoRef.current || !canvasRef.current || recognize.isPending) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 640;
        canvas.height = 480;
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            try {
                const data = await recognize.mutateAsync(blob);
                if (
                    data?.status === 'SUCCESS' &&
                    data?.vin_captured &&
                    VIN.schema.safeParse(data?.vin_captured).success
                ) {
                    setResult(data?.vin_captured);
                    setScanning(false);
                    router.push(`/?vin=${encodeURIComponent(data?.vin_captured)}`);
                    stopCamera();
                    stop();
                }
            } catch (e) {
                console.error('Ошибка:', e);
            }
        }, 'image/jpeg');
    };

    const stopCamera = () => {
        const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((t) => {
            t.stop();
        });
    };

    if (!open) return null;

    return (
        <div className={styles.wrapper}>
            {/** biome-ignore lint/a11y/useMediaCaption: supress */}
            <video autoPlay className={styles.webcam} playsInline ref={videoRef} />
            <div className={styles.vinFrame}>
                <span className={styles.vinLabel}>Align VIN here</span>
            </div>
            <canvas className={styles.canvas} ref={canvasRef} />
            <button
                className={styles.closeButton}
                onClick={() => {
                    setScanning(false);
                    stop();
                    stopCamera();
                }}
                type="button"
            >
                <IoClose size={24} />
            </button>
            <div className={styles.vinFrame}></div>
            {recognize.isPending && <div className={styles.loading}>⏳</div>}
        </div>
    );
};
