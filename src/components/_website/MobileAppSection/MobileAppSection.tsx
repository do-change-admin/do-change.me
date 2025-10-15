'use client'

import { motion } from "framer-motion";
import styles from './MobileAppSection.module.css';
import MobileLogo from './mobile.png'
import {
    FaMobileAlt,
    FaCog,
    FaKeyboard,
    FaSearch,
    FaQrcode,
    FaApple,
    FaGooglePlay,
    FaList
} from 'react-icons/fa';
import Image from "next/image";

export const MobileAppSection = ()=> {
    return (
        <section id="mob-section" className={styles.mobileSection}>

            <div className={styles.container}>
                {/* HeaderWeb */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.title}>Take App Anywhere</h2>
                    <p className={styles.subtitle}>Full-featured mobile app for buying and selling on the go</p>
                </motion.div>

                {/* Grid Layout */}
                <div className={styles.grid}>
                    {/* Left Features */}
                    <div className={styles.featureColumn}>
                        {[
                            {
                                number: "1",
                                icon: <FaCog size={20} color="#fff" />,
                                title: "Settings & Profile",
                                text: "Manage your account preferences, notification settings, and personal information in one place."
                            },
                            {
                                number: "2",
                                icon: <FaKeyboard size={20} color="#fff" />,
                                title: "VIN Decoder",
                                text: "Scan VIN number for quick vehicle lookups and history reports.."
                            },
                            {
                                number: "3",
                                icon: <FaSearch size={20} color="#fff" />,
                                title: "History Reports",
                                text: "Easily access and review all your past vehicle reports in one place."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className={styles.featureCard}
                                whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.featureNumber}>{item.number}</div>
                                <div className={styles.featureHeader}>
                                    <div className={styles.featureIcon}>{item.icon}</div>
                                    <h3 className={styles.featureTitle}>{item.title}</h3>
                                </div>
                                <p className={styles.featureText}>{item.text}</p>
                                <div className={styles.featureDivider}></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center Phone */}
                    <motion.div
                        className={styles.phoneWrapper}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <div className={styles.phoneOuter}>
                            <div className={styles.phoneInner}>
                                <div className={styles.phoneScreen}>
                                    <Image src={MobileLogo} alt="mob" width={290} height={580}/>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Features */}
                    <div className={styles.featureColumn}>
                        {[
                            {
                                number: "4",
                                icon: <FaQrcode size={20} color="#fff" />,
                                title: "Scanner Button",
                                text: "Large, prominent scanner button in the footer for quick VIN barcode scanning access."
                            },
                            {
                                number: "5",
                                icon: <FaList size={20} color="#fff" />,
                                title: "Main Content",
                                text: "Vehicle listings and search results displayed in the main content area with pricing information."
                            },
                            {
                                number: "6",
                                icon: <FaMobileAlt size={20} color="#fff" />,
                                title: "Mobile Optimized",
                                text: "Fully responsive design optimized for all mobile devices with touch-friendly interfaces."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className={styles.featureCard}
                                whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.featureNumber}>{item.number}</div>
                                <div className={styles.featureHeader}>
                                    <div className={styles.featureIcon}>{item.icon}</div>
                                    <h3 className={styles.featureTitle}>{item.title}</h3>
                                </div>
                                <p className={styles.featureText}>{item.text}</p>
                                <div className={styles.featureDivider}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Download Buttons */}
                <motion.div
                    className={styles.downloadButtons}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <button className={styles.downloadButton}>
                        <FaApple size={24} />
                        <div className={styles.downloadText}>App Store</div>
                    </button>
                    <button className={styles.downloadButton}>
                        <FaGooglePlay size={24} />
                        <div className={styles.downloadText}>Google Play</div>
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
