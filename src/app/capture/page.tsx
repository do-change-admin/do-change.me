"use client";

import React, {useRef, useState, useCallback, useEffect} from "react";
import Webcam from "react-webcam";
import { Button, Text, Stack, Group, Box, Card, Image } from "@mantine/core";
import {FiCamera, FiDownload, FiRefreshCw} from "react-icons/fi";
import {useRemoveBg} from "@/app/capture/useRemoveBg";

// Шаги фотографирования
const STEPS = [
    "Front",
    "Front Left Angle",
    "Left Side",
    "Rear Left Angle",
    "Rear",
    "Rear Right Angle",
    "Right Side",
    "Front Right Angle",
];

export default function VehicleCameraMask() {
    const {mutate : mutateRemoveBg, isPending} = useRemoveBg()
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [started, setStarted] = useState(false);
    const [firstPhoto, setFirstPhoto] = useState<string | null>(null);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const capture =  () => {
        if (!webcamRef.current) return;

        const image = webcamRef.current.getScreenshot();
        if (!image) return;

         mutateRemoveBg(
            { url: image },
            {
                onSuccess(url) {
                    console.log(url)
                    setStep((prev) => prev + 1);
                    setPhotos((prev) => {
                        const newPhotos = [...prev];
                        newPhotos[step] = url;
                        return newPhotos;
                    });
                },
            }
        );
    };

    const retakeCurrent = () => setStep((prev) => Math.min(prev, photos.length - 1));
    const retakeAll = () => {
        setPhotos([]);
        setStep(0);
        setFirstPhoto(null);
    };
    const downloadAll = () => {
        photos.forEach((img, index) => {
            const a = document.createElement("a");
            a.href = img;
            a.download = `vehicle_${STEPS[index]}.jpeg`;
            a.click();
        });
    };

    if (!started) {
        return (
            <Stack align="center" justify="center" style={{ width: "100vw", height: "100vh" }}>
                <Button
                    radius="lg"
                    color="var(--cl-fio)"
                    size="xl"
                    leftSection={<FiCamera size={24} />}
                    onClick={() => setStarted(true)}
                >
                    Start Camera
                </Button>
            </Stack>
        );
    }

    if (step === 8) {
        return (
            <Box style={{ width: "100vw", height: "70%", position: "relative" }}>
                {/* Первая фотография как затемнённый фон */}
                {photos[0] && (
                    <Box
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${photos[0]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "brightness(90%) blur(20px)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 0,
                        }}
                    />
                )}

                <Stack align="center" justify="center" gap="md" style={{ width: "100%", position: "relative", zIndex: 1, height: "100%", paddingTop: 300 }}>
                    <Text size="xl" color="white">All photos</Text>

                    <Group>
                        <Button leftSection={ <FiDownload size={20} />} radius="lg" color={'var(--cl-secondary)'} onClick={downloadAll}>Download All</Button>
                        <Button leftSection={<FiRefreshCw size={20} />} radius="lg"  color={'var(--cl-secondary)'} onClick={retakeAll} variant="outline">
                            Retake
                        </Button>
                    </Group>

                    <Group justify="center" gap="sm" style={{ marginTop: 20 }}>
                        {photos.map((img, i) => (
                            <Card radius="lg" key={i} p={0}>
                                <Image radius="lg" width={150} height={110} src={img} alt={STEPS[i]} />
                            </Card>
                        ))}
                    </Group>
                </Stack>
            </Box>
        );
    }

    // Камера
    return (
        <Box style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: "99999999999" }}>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                videoConstraints={{ facingMode: "environment" }}
                style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
            />

            {/* Центральная рамка */}
            <Box
                style={{
                    position: "absolute",
                    top: "15%",
                    left: "10%",
                    width: "80%",
                    height: "70%",
                    border: "3px dashed lime",
                    borderRadius: 12,
                    pointerEvents: "none",
                }}
            />

            {/* Кнопка внизу по центру */}
            <Group style={{
                position: "absolute",
                bottom: isLandscape ? "45%" : "1rem",
                width: "100%",
                justifyContent: isLandscape ? "end" : "center",
                right: "1rem"
            }}>
                <Button loading={isPending} size="lg" radius="xl" onClick={capture} color="var(--cl-primary)" >
                    <FiCamera size={24} />
                </Button>
            </Group>

            {/* Информация о шаге */}
            <Box
                style={{
                    position: "absolute",
                    top: 10,
                    width: "100%",
                    textAlign: "center",
                    color: "#fff",
                }}
            >
                <Text size="lg">{STEPS[step]}</Text>
                <Text size="sm" opacity={0.8}>
                    Step {step + 1} / {STEPS.length}
                </Text>
            </Box>
        </Box>
    );
}
