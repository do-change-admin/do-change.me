'use client'

import { motion } from "framer-motion";
import styles from './MobileAppSection.module.css';
import {
    FaSearch,
    FaQrcode,
    FaApple,
    FaGooglePlay,
    FaList,
    FaUserCog, FaCarSide, FaGavel
} from 'react-icons/fa';
import {Image} from "@mantine/core";
import {InstallPWAButton} from "@/client/components";
import React from "react";

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
                                icon: <FaSearch size={20} color="#fff" />,
                                title: "Market Value Check",
                                text: "Get the most accurate and up-to-date market value for any vehicle with unlimited and convenient access."
                            },
                            {
                                number: "2",
                                icon: <FaQrcode size={20} color="#fff" />,
                                title: "VIN & Plate Scanner",
                                text: "Easily scan VIN numbers or license plates to instantly retrieve vehicle details and market valuation."
                            },
                            {
                                number: "3",
                                icon: <FaList size={20} color="#fff" />,
                                title: "Vehicle History Reports",
                                text: "Access detailed vehicle history reports including ownership, accidents, mileage records, and more."
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
                                    <Image src='/images/mobile.png' alt="mob"/>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Features */}
                    <div className={styles.featureColumn}>
                        {[
                            {
                                number: "4",
                                icon: <FaUserCog size={20} color="#fff" />,
                                title: "Profile Management",
                                text: "Easily manage your personal profile, preferences, and account settings in one place."
                            },
                            {
                                number: "5",
                                icon: <FaCarSide size={20} color="#fff" />,
                                title: "Sell Your Car",
                                text: "Create listings and sell your vehicles directly through your account dashboard."
                            },
                            {
                                number: "6",
                                icon: <FaGavel size={20} color="#fff" />,
                                title: "Auction Access",
                                text: "Get access to auctions and explore a wide range of available vehicles."
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
                    <InstallPWAButton />
                </motion.div>
            </div>
        </section>
    )
}
