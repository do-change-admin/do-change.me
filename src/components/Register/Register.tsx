"use client";

import styles from "./Register.module.css";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert/Alert";
import { AppError } from "@/lib/errors";
import { apiFetch } from "@/lib/apiFetch";
import { handleApiError } from "@/lib/handleApiError";
import {GoogleButton} from "@/components/GoogleButton/GoogleButton";

export const Register = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agree, setAgree] = useState(false);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("success");

    const passwordsMatch = password === confirmPassword;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
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

    const handleClick = () => router.push("/");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiFetch<{ message: string }>("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                }),
            });

            router.push("/auth/check-email")

        } catch (err) {
            if ((err as AppError).error) {
                const message = handleApiError(err as AppError);
                setAlertMessage(message);
                setAlertType("error");
                setAlertVisible(true);
            } else {
                setAlertMessage("Network error");
                setAlertType("error");
                setAlertVisible(true);
            }
        }
    };

    return (
      <div className={styles.wrapper}>
          {alertVisible && alertMessage && (
            <Alert
              message={alertMessage}
              type={alertType}
              visible={alertVisible}
              onClose={() => {
                  setAlertVisible(false);
                  setAlertMessage(null);
              }}
            />
          )}

          <div className={styles.authContainer}>
              <div className={styles.formWrapper}>
                  <div className={styles.formCard}>
                      <div className={styles.welcomeSection}>
                          <h2>Create Account</h2>
                      </div>

                      <form className={styles.form} onSubmit={handleSubmit}>
                          <div>
                              <label>First Name</label>
                              <input
                                type="text"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                          </div>
                          <div>
                              <label>Last Name</label>
                              <input
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                          </div>
                          <div>
                              <label>Email</label>
                              <input
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              {email.length > 0 && !isEmailValid && (
                                <span className={styles.validationError}>
                                      Please enter a valid email
                                    </span>
                              )}
                          </div>

                          <div>
                              <label>Password</label>
                              <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                type="password"
                                placeholder="Confirm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              {!passwordsMatch && (
                                <span className={styles.validationError}>
                                      Passwords do not match
                                    </span>
                              )}
                          </div>

                          <div className={styles.terms}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                              />
                              <span>
                                    I agree to{" "}
                                  <span className={styles.link}>Terms</span> and{" "}
                                  <span className={styles.link}>Privacy</span>
                                  </span>
                          </div>

                          <button
                            type="submit"
                            className={styles.registerButton}
                            disabled={!isFormValid}
                          >
                              Create Account
                          </button>
                      </form>

                      <div className={styles.divider}>
                          <div />
                          <span>or</span>
                          <div />
                      </div>

                      <div className={styles.socialButtons}>
                          <GoogleButton text="Continue with Google" />
                      </div>

                      <div className={styles.signinLink}>
                          <p>
                              Have an account?{" "}
                              <Link href="/auth/login" className={styles.link}>
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
