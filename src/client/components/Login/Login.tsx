'use client';

import { Image, LoadingOverlay } from '@mantine/core';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { type FormEvent, useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import Alert from '@/client/components/Alert/Alert';
// import { GoogleButton } from "@/components/GoogleButton/GoogleButton";
import { type AppError, isBusinessError } from '@/lib-deprecated/errors';
import { handleApiError } from '@/lib-deprecated/handleApiError';
import { EMailAddress } from '@/utils/entities/email-address';
import { LoginModal } from '../LoginModal/LoginModal';
import styles from './Login.module.css';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMode, setModalMode] = useState<'password' | 'email'>('email');
    const [buttonText, setButtonText] = useState('');

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'error' | 'success'>('error');

    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const verified = searchParams.get('verified');

    const router = useRouter();

    useEffect(() => {
        if (error === 'INVALID_TOKEN') {
            setModalMessage('The link is invalid. You can resend the email to confirm your email address.');
            setModalMode('email');
            setButtonText('Resend email');
            setModalVisible(true);
            return;
        }
        if (error === 'TOKEN_EXPIRED') {
            setModalMessage('The link has expired. You can resend the email to confirm your email address.');
            setModalMode('email');
            setButtonText('Resend email');
            setModalVisible(true);
            return;
        }
        if (verified === '1') {
            setAlertMessage('Your email has been confirmed! You can log in now.');
            setAlertType('success');
            setAlertVisible(true);
            return;
        }
    }, [error, verified]);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const result = await signIn('credentials', {
            email: EMailAddress.create(email).model,
            password: password.trim(),
            redirect: false
        });

        if (result?.ok) {
            setLoading(false);
            router.refresh();
            return;
        }

        if (result?.error) {
            setLoading(false);
            try {
                const parsedError: AppError = JSON.parse(result.error);

                if (isBusinessError(parsedError)) {
                    const { code } = parsedError.error;
                    if (code === 'EMAIL_NOT_VERIFIED') {
                        setModalMessage(
                            'Your email is not verified. Please check your inbox or you can request a new confirmation email.'
                        );
                        setModalMode('email');
                        setButtonText('Resend email');
                        setModalVisible(true);
                        return;
                    }
                }

                setAlertMessage(handleApiError(parsedError));
                setAlertVisible(true);
            } catch {
                setAlertMessage('Something went wrong');
                setAlertVisible(true);
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <LoadingOverlay visible={loading} />
            {alertVisible && alertMessage && (
                <Alert
                    message={alertMessage}
                    onClose={() => {
                        setAlertVisible(false);
                        setAlertMessage(null);
                    }}
                    type={alertType}
                    visible={alertVisible}
                />
            )}

            {modalVisible && (
                <LoginModal
                    buttonText={buttonText}
                    message={modalMessage}
                    mode={modalMode}
                    onClose={() => {
                        setModalVisible(false);
                        setModalMessage('');
                    }}
                    showEmailInput={true}
                />
            )}

            <div className={styles.authContainer}>
                <div className={styles.formWrapper}>
                    <div className={styles.formCard}>
                        <div className={styles.welcomeSection}>
                            <Image alt="DoChange logo" className={styles.logo} h={40} src="/logo/logo.png" w="auto" />
                            <h2 className={styles.title}>Login</h2>
                            <p className={styles.subtitle}>Sign in to access your dashboard</p>
                        </div>

                        <form className={styles.loginForm} data-testid="login-form" onSubmit={handleSubmit}>
                            <div>
                                <label className={styles.label} data-testid="email-address-label">
                                    Email Address
                                </label>
                                <input
                                    className={styles.input}
                                    data-testid="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    type="email"
                                    value={email}
                                />
                            </div>

                            <div>
                                <label className={styles.label} data-testid="password-label">
                                    Password
                                </label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        className={`${styles.input} ${styles.passwordInput}`}
                                        data-testid="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                    />
                                    <button
                                        aria-label="Toggle password visibility"
                                        className={styles.eyeButton}
                                        onClick={togglePassword}
                                        type="button"
                                    >
                                        <FaEye className={showPassword ? styles.eyeIconActive : styles.eyeIcon} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.options}>
                                <span
                                    className={styles.forgotPassword}
                                    onClick={() => {
                                        setModalMessage('Enter your email and we’ll send you a reset link.');
                                        setModalMode('password');
                                        setButtonText('Send reset link');
                                        setModalVisible(true);
                                    }}
                                >
                                    Forgot password?
                                </span>
                            </div>

                            <button className={styles.submitButton} type="submit">
                                Sign In
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <div className={styles.line}></div>
                            <span className={styles.orText}>or</span>
                            <div className={styles.line}></div>
                        </div>

                        <div className={styles.signupLink}>
                            <p>
                                Don't have an account?{' '}
                                <Link className={styles.signupText} data-testid={'sign-up'} href="/auth/register">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
