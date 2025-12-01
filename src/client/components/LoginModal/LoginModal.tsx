'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Alert from '@/client/components/Alert/Alert';
import styles from './LoginModal.module.css';

interface ModalProps {
    message: string;
    onClose: () => void;
    showEmailInput?: boolean;
    buttonText?: string;
    mode?: 'password' | 'email'; // режим кнопки
}

export const LoginModal: React.FC<ModalProps> = ({ message, onClose, showEmailInput = false, buttonText = 'Send', mode = 'email' }) => {
    const [emailInput, setEmailInput] = useState('');
    const [statusMessage, setStatusMessage] = useState(message);
    const [sentSuccessfully, setSentSuccessfully] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        setStatusMessage(message);
    }, [message]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailInput);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleButtonClick = async () => {
        if (!emailInput || !isEmailValid) return;

        setAlertVisible(false);
        setAlertMessage(null);

        try {
            const url = mode === 'password' ? '/api/password/request' : '/api/email/verify';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput })
            });

            if (!res.ok) {
                let errorMessage = 'Something went wrong';
                try {
                    const data = await res.json();
                    errorMessage = data?.message || errorMessage;
                } catch {}
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setStatusMessage(data.message || 'Request sent successfully!');
            setSentSuccessfully(true);

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setAlertMessage(err?.message || 'Something went wrong, please try again');
            setTimeout(() => setAlertVisible(true), 0);
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button aria-label="Close modal" className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>

                <div className={styles.content}>
                    {alertMessage && <Alert message={alertMessage} type="error" visible={alertVisible} />}
                    <p className={styles.message}>{statusMessage}</p>

                    {showEmailInput && !sentSuccessfully && (
                        <>
                            <input
                                className={styles.emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Enter your email"
                                type="email"
                                value={emailInput}
                            />
                            {!isEmailValid && emailInput.length > 0 && (
                                <p className={styles.errorText}>Please enter a valid email address</p>
                            )}
                            <button className={styles.actionButton} disabled={!emailInput || !isEmailValid} onClick={handleButtonClick}>
                                {buttonText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
