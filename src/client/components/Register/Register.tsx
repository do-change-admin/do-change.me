'use client';

import { Image } from '@mantine/core';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import type React from 'react';
import { useState } from 'react';
import Alert from '@/client/components/Alert/Alert';
import type { AppError } from '@/lib-deprecated/errors';
import { handleApiError } from '@/lib-deprecated/handleApiError';
import { EMailAddress } from '@/utils/entities/email-address';
import styles from './Register.module.css';

// import {GoogleButton} from "@/components/GoogleButton/GoogleButton";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });

    if (!res.ok) {
        const errorData = (await res.json()) as AppError;
        throw errorData;
    }

    return (await res.json()) as T;
}

export const Register = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const passwordsMatch = password === confirmPassword;
    const isEmailValid = EMailAddress.schema.safeParse(email).success;
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    const isPasswordValid = passwordRegex.test(password);

    const isFormValid =
        firstName.trim() &&
        lastName.trim() &&
        isEmailValid &&
        password.trim() &&
        isPasswordValid &&
        confirmPassword.trim() &&
        passwordsMatch &&
        agree;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiFetch<{ message: string }>('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: EMailAddress.create(email).model,
                    password: password.trim(),
                    firstName,
                    lastName
                })
            });

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });

            if (result?.ok) {
                window.location.reload();
                return;
            }

            if (!result || !result.ok) {
                throw result?.error || 'Error while logging in';
            }

            // router.push("/auth/check-email")
        } catch (err) {
            if ((err as AppError).error) {
                const message = handleApiError(err as AppError);
                setAlertMessage(message);
                setAlertType('error');
                setAlertVisible(true);
            } else {
                setAlertMessage('Network error');
                setAlertType('error');
                setAlertVisible(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
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

            <div className={styles.authContainer}>
                <div className={styles.formWrapper}>
                    <div className={styles.formCard}>
                        <div className={styles.welcomeSection}>
                            <Image alt="DoChange logo" className={styles.logo} h={40} src="/logo/logo.png" w="auto" />
                            <h2>Create Account</h2>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div>
                                <label>First Name</label>
                                <input
                                    data-testid={'first-name'}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    type="text"
                                    value={firstName}
                                />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    type="text"
                                    value={lastName}
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    type="email"
                                    value={email}
                                />
                                {email.length > 0 && !isEmailValid && (
                                    <span className={styles.validationError}>Please enter a valid email</span>
                                )}
                            </div>

                            <div>
                                <label>Password</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                />
                                {password.length > 0 && !isPasswordValid && (
                                    <span className={styles.validationError}>
                                        Password must be at least 8 characters and contain an uppercase letter
                                    </span>
                                )}
                            </div>

                            <div>
                                <label>Confirm</label>
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm"
                                    type="password"
                                    value={confirmPassword}
                                />
                                {!passwordsMatch && (
                                    <span className={styles.validationError}>Passwords do not match</span>
                                )}
                            </div>

                            <div className={styles.terms}>
                                <input
                                    checked={agree}
                                    className={styles.checkbox}
                                    onChange={(e) => setAgree(e.target.checked)}
                                    type="checkbox"
                                />
                                <span>
                                    I agree to{' '}
                                    <Link
                                        className={styles.link}
                                        href="/legal"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        Terms and Privacy
                                    </Link>
                                </span>
                            </div>

                            <button
                                className={styles.registerButton}
                                disabled={!isFormValid || isLoading}
                                type="submit"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <div />
                            <span>or</span>
                            <div />
                        </div>

                        {/* <div className={styles.socialButtons}>
                            <GoogleButton text="Continue with Google" />
                        </div> */}

                        <div className={styles.signinLink}>
                            <p>
                                Have an account?{' '}
                                <Link className={styles.link} href="/auth/login">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
