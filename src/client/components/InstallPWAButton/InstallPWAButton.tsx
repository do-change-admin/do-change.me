'use client'
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Button } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import { useProfile } from '@/client/hooks';

// Объявляем тип для события beforeinstallprompt, чтобы TS не ругался
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPWAButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const { data: profileData } = useProfile();

    const isAdmin = process.env.ADMIN_EMAILS?.split(',')?.includes(profileData?.email ?? "") ?? false


    useEffect(() => {
        // Определяем iOS
        const ua = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(ua));

        // Сохраняем событие beforeinstallprompt для Android/Chrome
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler as EventListener);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler as EventListener);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            alert(
                'Для установки на iOS: нажмите «Поделиться» в Safari и выберите «На экран «Домой»».'
            );
            return;
        }

        if (!deferredPrompt) return;

        // Показываем нативный диалог установки
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === 'accepted') {
            console.log('PWA installation accepted');
        } else {
            console.log('PWA installation dismissed');
        }

        setDeferredPrompt(null);
    };

    if (!isAdmin) {
        return <></>
    }


    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
                fullWidth
                onClick={handleInstallClick}
                leftSection={<FaDownload size={18} />}
                size="md"
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
    );
};

export default InstallPWAButton;
