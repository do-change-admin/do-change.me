"use client";

import React, { useState, useEffect } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import styles from "./ResetPassword.module.css";
import Alert from "@/components/Alert/Alert";

export const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    if (!token) {
      setAlertMessage("You have followed an invalid link, please try again");
      setAlertType("error");
      setAlertVisible(true);

      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [token, router]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setValidationError("Passwords do not match");
    } else {
      setValidationError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (validationError) return;

    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlertMessage(data?.error?.message || "Something went wrong");
        setAlertType("error");
        setAlertVisible(true);
        return;
      }

      setAlertMessage("Password has been reset successfully!");
      setAlertType("success");
      setAlertVisible(true);

      setTimeout(() => {
        router.push("/settings/subscriptions");
      }, 2000);

    } catch (err) {
      setAlertMessage("Network error");
      setAlertType("error");
      setAlertVisible(true);
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Alert
        message={alertMessage || ''}
        type={alertType}
        visible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          setAlertMessage(null);
        }}
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
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!token}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!token}
              />
              {validationError && (
                <div className={styles.errorMessage}>{validationError}</div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!password || !confirmPassword || !!validationError || !token}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
