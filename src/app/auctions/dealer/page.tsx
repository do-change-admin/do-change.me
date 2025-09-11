'use client'

import { motion } from "framer-motion";
import { FaCrown, FaShieldAlt, FaClock, FaStar, FaKey } from "react-icons/fa";
import styles from "./page.module.css";
import {useRouter} from "next/navigation";

export default function AuctionAccessPage() {
    const router = useRouter();

    const handleClick = () => {
        router.push("dealer/form");
    };

    return (
        <main className={styles.main}>
            <motion.div
                className={styles.ctaSection}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.button
                    className={styles.getAccessBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                >
                    <FaKey className={styles.buttonIcon} />
                    Get Access
                </motion.button>

                <div className={styles.featuresAroundButton}>
                    {/* Top */}
                    <div className={`${styles.feature} ${styles.top}`}>
                        <div className={`${styles.iconWrapper} ${styles.topBg}`}>
                            <FaCrown className={styles.iconColorTop} />
                        </div>
                        <h3 className={styles.featureTitle}>Premium Items</h3>
                        <p className={styles.featureDesc}>Luxury collection</p>
                    </div>

                    {/* Right */}
                    <div className={`${styles.feature} ${styles.right}`}>
                        <div className={`${styles.iconWrapper} ${styles.rightBg}`}>
                            <FaShieldAlt className={styles.iconColorRight} />
                        </div>
                        <h3 className={styles.featureTitle}>Secure Bidding</h3>
                        <p className={styles.featureDesc}>Protected transactions</p>
                    </div>

                    {/* Bottom */}
                    <div className={`${styles.feature} ${styles.bottom}`}>
                        <div className={`${styles.iconWrapper} ${styles.bottomBg}`}>
                            <FaClock className={styles.iconColorBottom} />
                        </div>
                        <h3 className={styles.featureTitle}>Live Auctions</h3>
                        <p className={styles.featureDesc}>Real-time bidding</p>
                    </div>

                    {/* Left */}
                    <div className={`${styles.feature} ${styles.left}`}>
                        <div className={`${styles.iconWrapper} ${styles.leftBg}`}>
                            <FaStar className={styles.iconColorLeft} />
                        </div>
                        <h3 className={styles.featureTitle}>Expert Verified</h3>
                        <p className={styles.featureDesc}>Authenticated items</p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
