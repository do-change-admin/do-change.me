import React from "react";
import styles from "./FeaturesSection.module.css";
import {FaDownload, FaFileAlt, FaQrcode} from "react-icons/fa";

export const FeaturesSection = () => {
    return (
        <section id="features" className={styles.featuresSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Why Choose LotSpace?</h2>
                    <p className={styles.subtitle}>
                        Powerful features that make vehicle inspection effortless
                    </p>
                </div>

                <div className={styles.grid}>
                    {/* Feature 1 */}
                    <div className={styles.featureCard} id="feature-1">
                        <div className={styles.iconWrapper}>
                            <FaQrcode className={styles.icon} />
                        </div>
                        <h3 className={styles.featureTitle}>Instant VIN Scanning</h3>
                        <p className={styles.featureDescription}>
                            Simply point your camera at any VIN number and get instant results. No typing required.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className={styles.featureCard} id="feature-2">
                        <div className={styles.iconWrapper}>
                            <FaFileAlt className={styles.icon} />
                        </div>
                        <h3 className={styles.featureTitle}>Comprehensive Reports</h3>
                        <p className={styles.featureDescription}>
                            Get detailed vehicle history, specifications, recalls, and market value in seconds.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className={styles.featureCard} id="feature-3">
                        <div className={styles.iconWrapper}>
                            <FaDownload className={styles.icon} />
                        </div>
                        <h3 className={styles.featureTitle}>Downloadable PDFs</h3>
                        <p className={styles.featureDescription}>
                            Save and share professional reports with customers, insurance, or for your records.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
