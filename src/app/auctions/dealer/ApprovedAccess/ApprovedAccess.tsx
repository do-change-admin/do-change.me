"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaGavel, FaShieldAlt, FaClock } from "react-icons/fa";
import styles from "./ApprovedAccess.module.css";
import {useProfile} from "@/hooks";
import {Avatar} from "@mantine/core";

export const ApprovedAccess = () => {
    const {data: profileData} = useProfile()
    return (
        <main id="auction-access-main" className={styles.main}>
            <div id="access-card" className={styles.card}>
                {/* Статус */}
                <div id="status-section" className={styles.statusSection}>
                    <h1 className={styles.title}>Auction Access</h1>
                    <p className={styles.subtitle}>Your Auction Access has been successfully approved</p>
                    <div className={styles.separator}></div>
                </div>

                {/* QR + Профиль */}
                <div id="access-details" className={styles.details}>
                    {/* QR */}
                    <div id="qr-section" className={styles.qrSection}>
                        <div className={styles.qrBox}>
                            <Avatar src={profileData?.auctionAccessQRLink} className={styles.qrPlaceholder}/>
                        </div>
                        <h3 className={styles.qrTitle}>Scan QR Code</h3>
                    </div>

                    {/* Профиль */}
                    <div id="profile-section" className={styles.profileSection}>
                        <div className={styles.profileImageWrapper}>
                            <Avatar
                                className={styles.profileImage}
                                src={profileData?.photoLink}
                                alt="professional auction house attendee portrait"
                            />
                        </div>
                        <div className={styles.profileCard}>
                            <h3>Auction Access Number</h3>
                            <div className={styles.profileNumber}>{profileData?.auctionAccessNumber}</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
