'use client';

import {ActionIcon, Box, Button, Card, Group, Image, Stack, Text, Title} from '@mantine/core';
import { useRef, useState } from 'react';
import { FiCamera, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Webcam from 'react-webcam';
import { downloadAllImages } from '@/client/components/_admin/CarEditor/utils';
import { usePictureBackgroundRemoving } from '@/client/features/pictures/remove-background/remove-picture-background.feature.api';
import { useFilesUploading } from '@/client/shared/queries';
import styles from './page.module.css'

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
    '',
    'Front Right Angle',
    'Front',
    'Front Left Angle',
    'Left Side',
    'Rear Left Angle',
    'Rear',
    'Rear Right Angle',
    'Right Side',
];

export type CarMask = 'sedan' | 'suv' | 'truck';

export default function VehicleCameraMask() {
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [started, setStarted] = useState(false);
    const [photoLinks, setPhotoLinks] = useState<string[]>([]);
    const [selectedMask, setSelectedMask] = useState<CarMask>("sedan");
    const masks: { type: CarMask; label: string; image: string }[] = [
        { type: 'sedan', label: 'Sedan', image: '/frames/sedan/1.png' },
        { type: 'suv', label: 'SUV', image: '/frames/suv/1.png' },
        { type: 'truck', label: 'Truck', image: '/frames/truck/1.png' },
    ];

    const isLandscape = true;

    const { mutateAsync: upload, isPending: isUploadPending } = useFilesUploading();
    const { mutateAsync: removeBg, isPending: isRemoveBgPending } = usePictureBackgroundRemoving();

    const capture = async () => {
        if (!webcamRef.current) return;

        const video = webcamRef.current.video;
        if (!video) return;

        // Создаём canvas с разрешением видео
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Рисуем видео на canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Экспортируем как base64 высокого качества
        const image = canvas.toDataURL('image/png', 1); // 1 = максимальное качество

        const { uploadedFileIds } = await upload([base64ToFile(image, `${STEPS[step]}.png`)]);
        const { imagesWithoutBackground } = await removeBg({ body: { pictureIds: uploadedFileIds } });

        setPhotoLinks((prev) => prev.concat(imagesWithoutBackground));
        setStep((prev) => prev + 1);
    };


    const retakeAll = () => {
        setPhotos([]);
        setStep(0);
        setStarted(false);
        setPhotoLinks([]);
    };
    const downloadAll = async () => {
        await downloadAllImages(photoLinks, STEPS);
    };

    if (!started) {
        return (
            <Stack align="center" justify="center" style={{ width: '100vw', height: '400px' }}>
                <Stack gap="xs" p="xs" justify="center">
                    <Title ta="center" size="lg" fw={500} c='var(--cl-fio)'>
                        Choose car mask
                    </Title>
                    <Group gap="xs">
                        {masks.map(({ type, label, image }) => {
                            const isActive = selectedMask === type;
                            return (
                                <Card
                                    key={type}
                                    shadow="sm"
                                    padding="sm"
                                    radius="lg"
                                    className={`${styles.card} ${isActive ? styles.active : ''}`}
                                    onClick={() => setSelectedMask(type)}
                                    style={{
                                        border: isActive ? '2px solid var(--cl-fio)' : '1px solid #ccc',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Card.Section>
                                        <Image src={image} alt={label} height={80} fit="contain" />
                                    </Card.Section>
                                    <Text size="sm" fw={500} mt="xs">
                                        {label}
                                    </Text>
                                </Card>
                            );
                        })}
                    </Group>
                </Stack>
                <Button
                    color="var(--cl-fio)"
                    leftSection={<FiCamera size={24} />}
                    onClick={() => {
                        setStarted(true)
                        setStep(1)
                    }}
                    radius="lg"
                    size="xl"
                >
                    Start
                </Button>
            </Stack>
        );
    }

    if (step === 9) {
        return (
            <Box style={{ width: '100vw', height: '100vh', position: 'relative', justifyContent: 'center', alignItems: 'center'}}>

                {photoLinks[0] && (
                    <Box
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${photoLinks[0]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(99%) blur(5px)',
                            position: 'absolute',
                            top: -200,
                            left: 0,
                            zIndex: 0
                        }}
                    />
                )}

                <Stack
                    align="center"
                    gap="md"
                    justify="center"
                    mt={300}
                    style={{ width: '100%', position: 'relative', zIndex: 1, height: '100%'}}
                >
                    <Text size="xl" c="var(--cl-fio)">
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

                    <Group gap="sm" justify="center" style={{ marginTop: 20, marginBottom: 500 }}>
                        {photoLinks.map((img, i) => (
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

            <Image opacity={0.6} pos="absolute" top={0} left={0} src={`/frames/${selectedMask}/${step}.png`} w="100vw" h="100vh"/>

            {/* Кнопка внизу по центру */}
            <Group
                style={{
                    position: 'absolute',
                    bottom: isLandscape ? '45%' : '1rem',
                    width: '100%',
                    justifyContent: isLandscape ? 'end' : 'center',
                    right: '0.5rem'
                }}
            >
                <Button color="var(--cl-fio)" loading={isUploadPending || isRemoveBgPending} onClick={capture} radius="lg" size="md">
                    <FiCamera size={24} />
                </Button>
            </Group>

            <Group
                style={{
                    position: 'absolute',
                    top: 5,
                    width: '100%',
                    right: '0.5rem',
                    zIndex: 22
                }}
            >
                <Button pos="absolute" radius="lg" variant="outline"  right={8} top={8} color="var(--cl-primary)" onClick={() => {
                    setStarted(false)
                    setPhotos([])
                    setStep(0)
                }}>X</Button>
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
                <Text opacity={0.8} size="sm">
                    Step {step} / {STEPS.length-1}
                </Text>
            </Box>
        </Box>
    );
}
