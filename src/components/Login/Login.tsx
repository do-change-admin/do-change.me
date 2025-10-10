"use client";

import React, { FormEvent, useEffect, useState } from "react";
import styles from "./Login.module.css";
import {
  FaEye,
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { LoginModal } from "../LoginModal/LoginModal";
import Alert from "@/components/Alert/Alert";
// import { GoogleButton } from "@/components/GoogleButton/GoogleButton";
import { AppError, isBusinessError } from "@/lib/errors";
import { handleApiError } from "@/lib/handleApiError";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMode, setModalMode] = useState<"password" | "email">("email");
  const [buttonText, setButtonText] = useState("");

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const verified = searchParams.get("verified");

  const router = useRouter();

  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      setModalMessage(
        "The link is invalid. You can resend the email to confirm your email address."
      );
      setModalMode("email");
      setButtonText("Resend email");
      setModalVisible(true);
      return;
    }
    if (error === "TOKEN_EXPIRED") {
      setModalMessage(
        "The link has expired. You can resend the email to confirm your email address."
      );
      setModalMode("email");
      setButtonText("Resend email");
      setModalVisible(true);
      return;
    }
    if (verified === "1") {
      setAlertMessage("Your email has been confirmed! You can log in now.");
      setAlertType("success");
      setAlertVisible(true);
      return;
    }
  }, [error, verified]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
      return;
    }

    if (result?.error) {
      try {
        const parsedError: AppError = JSON.parse(result.error);

        if (isBusinessError(parsedError)) {
          const { code } = parsedError.error;
          if (code === "EMAIL_NOT_VERIFIED") {
            setModalMessage(
              "Your email is not verified. Please check your inbox or you can request a new confirmation email."
            );
            setModalMode("email");
            setButtonText("Resend email");
            setModalVisible(true);
            return;
          }
        }

        setAlertMessage(handleApiError(parsedError));
        setAlertVisible(true);
      } catch {
        setAlertMessage("Something went wrong");
        setAlertVisible(true);
      }
    }
  };

  const handleClickLogo = () => router.push("/");

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

      {modalVisible && (
        <LoginModal
          message={modalMessage}
          onClose={() => {
            setModalVisible(false);
            setModalMessage("");
          }}
          showEmailInput={true}
          buttonText={buttonText}
          mode={modalMode}
        />
      )}

      <div className={styles.authContainer}>
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <div className={styles.welcomeSection}>
              <h2 className={styles.title}>Login</h2>
              <p className={styles.subtitle}>
                Sign in to access your dashboard
              </p>
            </div>

            <form data-testid='login-form' className={styles.loginForm} onSubmit={handleSubmit}>
              <div>
                <label className={styles.label} data-testid='email-address-label'>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  data-testid='email'
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className={styles.label} data-testid='password-label'>Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input + " " + styles.passwordInput}
                    value={password}
                    data-testid='password'
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={togglePassword}
                    aria-label="Toggle password visibility"
                  >
                    <FaEye
                      className={
                        showPassword
                          ? styles.eyeIconActive
                          : styles.eyeIcon
                      }
                    />
                  </button>
                </div>
              </div>

              {/* <div className={styles.options}>
                <label className={styles.rememberMeLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span className={styles.rememberMeText}>Remember me</span>
                </label>
                <span
                  className={styles.forgotPassword}
                  onClick={() => {
                    setModalMessage(
                      "Enter your email and we’ll send you a reset link."
                    );
                    setModalMode("password");
                    setButtonText("Send reset link");
                    setModalVisible(true);
                  }}
                >
                  Forgot password?
                </span>
              </div>
 */}
              <button type="submit" className={styles.submitButton}>
                Sign In
              </button>
            </form>

            <div className={styles.divider}>
              <div className={styles.line}></div>
              <span className={styles.orText}>or</span>
              <div className={styles.line}></div>
            </div>

            {/* <div className={styles.socialLogin}>
              <GoogleButton text="Continue with Google" />
            </div> */}

            <div className={styles.signupLink}>
              <p>
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className={styles.signupText}
                  data-testid={"sign-up"}
                >
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
