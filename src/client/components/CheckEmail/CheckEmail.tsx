"use client";

import React from "react";
import { MdEmail } from "react-icons/md";
import styles from "./CheckEmail.module.css";

interface CheckEmailProps {
  email?: string;
}

export const CheckEmail: React.FC<CheckEmailProps> = ({ email }) => {
  return (
    <div className={styles.checkEmailWrapper}>
      <div className={styles.checkEmailCard}>
        <MdEmail className={styles.checkEmailIcon} />
        <h2 className={styles.checkEmailTitle}>Check Your Email</h2>
        <p className={styles.checkEmailText}>
          We sent a confirmation email{email ? ` to ${email}` : ""}. Please check your inbox and click the link to verify your account.
        </p>
      </div>
    </div>
  );
};
