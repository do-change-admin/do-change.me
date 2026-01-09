'use client'
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { IoShareOutline } from "react-icons/io5";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPWAButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [iosModalOpened, setIosModalOpened] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return; // SSR check

        // Detect iOS
        const ua = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(ua));

        // Save beforeinstallprompt event for Android/Chrome
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler as EventListener);

        const checkShowButton = () => {
            const isMobile = window.innerWidth < 700;
            const isHome = window.location.pathname.toLowerCase().includes('/home');
            const isInPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

            setShowButton(!isInPWA);
        };

        checkShowButton();
        window.addEventListener('resize', checkShowButton);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler as EventListener);
            window.removeEventListener('resize', checkShowButton);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // Show Mantine modal instead of alert
            setIosModalOpened(true);
            return;
        }

        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === 'accepted') {
            console.log('PWA installation accepted');
        } else {
            console.log('PWA installation dismissed');
        }

        setDeferredPrompt(null);
    };

    if (!showButton) {
        return <></>
    }


    return (
        <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                    fullWidth
                    onClick={handleInstallClick}
                    leftSection={<FaDownload size={18} />}
                    size="md"
                    radius={0}
                    m={0}
                    style={{
                        background: 'linear-gradient(90deg, #6366f1, #3b82f6)',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Install App
                </Button>
            </motion.div>

            <Modal
                opened={iosModalOpened}
                onClose={() => setIosModalOpened(false)}
                title="Install the App on iOS"
                centered
                radius="md"
            >
                <Stack gap="md">
                    <Text size="sm">
                        To install this app on your iPhone or iPad:
                    </Text>
                    <Group gap="sm" align="center">
                        <IoShareOutline size={24} color="#6366f1" />
                        <Text size="sm" fw={500}>
                            Tap the <strong>“Share”</strong> button in Safari
                        </Text>
                    </Group>
                    <Group gap="sm" align="center">
                        <CiSquarePlus size={24} color="#3b82f6" />
                        <Text size="sm" fw={500}>
                            Select <strong>“Add to Home Screen”</strong>
                        </Text>
                    </Group>
                    <Text size="xs" color="dimmed">
                        After this, the app will appear on your home screen like a regular mobile app.
                    </Text>
                </Stack>
            </Modal>

        </>
    );
};
