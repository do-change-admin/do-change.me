'use client'
import React, { useEffect, useState } from 'react';

// Объявляем тип для события beforeinstallprompt, чтобы TS не ругался
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPWAButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);

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

    // Показываем кнопку только на iOS или когда есть deferredPrompt (Android/Chrome)
    if (!isIOS && !deferredPrompt) return null;

    return (
        <button onClick={handleInstallClick}>
            Установить приложение
        </button>
    );
};

export default InstallPWAButton;
