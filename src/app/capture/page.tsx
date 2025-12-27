'use client';

import { Box, Button, Card, Group, Image, Stack, Text } from '@mantine/core';
import { useRef, useState } from 'react';
import { FiCamera, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Webcam from 'react-webcam';
import { downloadAllImages } from '@/client/components/_admin/CarEditor/utils';
import { usePictureBackgroundRemoving } from '@/client/features/pictures/remove-background/remove-picture-background.feature.api';
import { useFilesUploading } from '@/client/shared/queries';

function base64ToFile(base64: string, filename: string, mimeType = 'image/png') {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    const byteString = atob(cleanBase64);
    const byteArray = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    return new File([byteArray], filename, { type: mimeType });
}

// import { useRemoveBg } from '@/app/capture/useRemoveBg';

// Шаги фотографирования
const STEPS = [
    'Front',
    'Front Left Angle',
    'Left Side',
    'Rear Left Angle',
    'Rear',
    'Rear Right Angle',
    'Right Side',
    'Front Right Angle'
];

export default function VehicleCameraMask() {
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [started, setStarted] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const isLandscape = true;

    const { mutateAsync: upload } = useFilesUploading();
    const { mutateAsync: removeBg } = usePictureBackgroundRemoving();
    //закомментировал, потому что он падал нахрен, потом разберёмся
    // const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    // useLayoutEffect(() => {
    //     const handleResize = () => {
    //         setIsLandscape(window.innerWidth > window.innerHeight);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    const capture = () => {
        if (!webcamRef.current) return;

        const image = webcamRef.current.getScreenshot();

        if (!image) return;
        setFiles((x) => x.concat(base64ToFile(image, `${STEPS[step]}.png`)));

        setStep((prev) => prev + 1);
    };

    const retakeAll = () => {
        setPhotos([]);
        setStep(0);
    };
    const downloadAll = async () => {
        const { uploadedFileIds } = await upload(files);
        const { imagesWithoutBackground } = await removeBg({ body: { pictureIds: uploadedFileIds } });
        await downloadAllImages(imagesWithoutBackground, STEPS);
    };

    if (!started) {
        return (
            <Stack align="center" justify="center" style={{ width: '100vw', height: '100vh' }}>
                <Button
                    color="var(--cl-fio)"
                    leftSection={<FiCamera size={24} />}
                    onClick={() => setStarted(true)}
                    radius="lg"
                    size="xl"
                >
                    Start Camera
                </Button>
            </Stack>
        );
    }

    if (step === 8) {
        return (
            <Box style={{ width: '100vw', height: '70%', position: 'relative' }}>
                {/* Первая фотография как затемнённый фон */}
                {photos[0] && (
                    <Box
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${photos[0]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(90%) blur(20px)',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 0
                        }}
                    />
                )}

                <Stack
                    align="center"
                    gap="md"
                    justify="center"
                    style={{ width: '100%', position: 'relative', zIndex: 1, height: '100%', paddingTop: 300 }}
                >
                    <Text c="white" size="xl">
                        All photos
                    </Text>

                    <Group>
                        <Button
                            color={'var(--cl-secondary)'}
                            leftSection={<FiDownload size={20} />}
                            onClick={downloadAll}
                            radius="lg"
                        >
                            Download All
                        </Button>
                        <Button
                            color={'var(--cl-secondary)'}
                            leftSection={<FiRefreshCw size={20} />}
                            onClick={retakeAll}
                            radius="lg"
                            variant="outline"
                        >
                            Retake
                        </Button>
                    </Group>

                    <Group gap="sm" justify="center" style={{ marginTop: 20 }}>
                        {photos.map((img, i) => (
                            <Card key={i} p={0} radius="lg">
                                <Image alt={STEPS[i]} height={110} radius="lg" src={img} width={150} />
                            </Card>
                        ))}
                    </Group>
                </Stack>
            </Box>
        );
    }

    // Камера
    return (
        <Box style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: '99999999999' }}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
                videoConstraints={{ facingMode: 'environment' }}
            />

            {/* Центральная рамка */}
            <Box
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '80%',
                    height: '70%',
                    border: '3px dashed lime',
                    borderRadius: 12,
                    pointerEvents: 'none'
                }}
            />

            {/* Кнопка внизу по центру */}
            <Group
                style={{
                    position: 'absolute',
                    bottom: isLandscape ? '45%' : '1rem',
                    width: '100%',
                    justifyContent: isLandscape ? 'end' : 'center',
                    right: '1rem'
                }}
            >
                <Button color="var(--cl-primary)" loading={false} onClick={capture} radius="xl" size="lg">
                    <FiCamera size={24} />
                </Button>
            </Group>

            {/* Информация о шаге */}
            <Box
                style={{
                    position: 'absolute',
                    top: 10,
                    width: '100%',
                    textAlign: 'center',
                    color: '#fff'
                }}
            >
                <Text size="lg">{STEPS[step]}</Text>
                {JSON.stringify(photos)}
                <Text opacity={0.8} size="sm">
                    Step {step + 1} / {STEPS.length}
                </Text>
            </Box>
        </Box>
    );
}
