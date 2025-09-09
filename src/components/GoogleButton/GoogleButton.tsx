"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import styles from "./GoogleButton.module.css";

interface GoogleButtonProps {
  text?: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ text = "Google" }) => {
  const handleGoogleAuth = async () => {
    await signIn("google");
  };

  return (
    <button className={styles.googleBtn} onClick={handleGoogleAuth}>
      <FaGoogle className={styles.googleIcon} />
      <span>{text}</span>
    </button>
  );
};
