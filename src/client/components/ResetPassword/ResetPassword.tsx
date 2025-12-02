'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import Alert from '@/client/components/Alert/Alert';
import styles from './ResetPassword.module.css';

export const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>('');
    const [alertType, setAlertType] = useState<'error' | 'success'>('error');
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        if (!token) {
            setAlertMessage('You have followed an invalid link, please try again');
            setAlertType('error');
            setAlertVisible(true);

            const timer = setTimeout(() => {
                router.push('/auth/login');
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [token, router]);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setValidationError('Passwords do not match');
        } else {
            setValidationError('');
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) return;

        if (validationError) return;

        try {
            const res = await fetch('/api/password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setAlertMessage(data?.error?.message || 'Something went wrong');
                setAlertType('error');
                setAlertVisible(true);
                return;
            }

            setAlertMessage('Password has been reset successfully!');
            setAlertType('success');
            setAlertVisible(true);

            setTimeout(() => {
                router.push('/settings/subscriptions');
            }, 2000);
        } catch (err) {
            setAlertMessage('Network error');
            setAlertType('error');
            setAlertVisible(true);
            console.error(err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Alert
                message={alertMessage || ''}
                onClose={() => {
                    setAlertVisible(false);
                    setAlertMessage(null);
                }}
                type={alertType}
                visible={alertVisible}
            />

            <div className={styles.formWrapper}>
                <div className={styles.formCard}>
                    <div className={styles.headerSection}>
                        <h2>Reset Password</h2>
                        <p>Please enter your new password twice</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password">New Password</label>
                            <input
                                disabled={!token}
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                type="password"
                                value={password}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                disabled={!token}
                                id="confirmPassword"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                type="password"
                                value={confirmPassword}
                            />
                            {validationError && <div className={styles.errorMessage}>{validationError}</div>}
                        </div>

                        <button
                            className={styles.submitButton}
                            disabled={!password || !confirmPassword || !!validationError || !token}
                            type="submit"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
