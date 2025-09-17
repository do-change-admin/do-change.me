"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaGavel, FaShieldAlt, FaClock } from "react-icons/fa";
import styles from "./ApprovedAccess.module.css";

export const AuctionAccess = () => {
    return (
        <main id="auction-access-main" className={styles.main}>
            <div id="access-card" className={styles.card}>
                {/* Статус */}
                <div id="status-section" className={styles.statusSection}>
                    <h1 className={styles.title}>Arrived</h1>
                    <p className={styles.subtitle}>Your access has been provided</p>
                    <div className={styles.separator}></div>
                </div>

                {/* QR + Профиль */}
                <div id="access-details" className={styles.details}>
                    {/* QR */}
                    <div id="qr-section" className={styles.qrSection}>
                        <div className={styles.qrBox}>
                            <div className={styles.qrPlaceholder}>QR</div>
                        </div>
                        <h3 className={styles.qrTitle}>Scan QR Code</h3>
                    </div>

                    {/* Профиль */}
                    <div id="profile-section" className={styles.profileSection}>
                        <div className={styles.profileImageWrapper}>
                            <img
                                className={styles.profileImage}
                                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c83e0917e7-2d3a2ed1e0fa28ee4e41.png"
                                alt="professional auction house attendee portrait"
                            />
                        </div>
                        <div className={styles.profileCard}>
                            <h3>Auction Access Number</h3>
                            <div className={styles.profileNumber}>#AA-2024-7853</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
