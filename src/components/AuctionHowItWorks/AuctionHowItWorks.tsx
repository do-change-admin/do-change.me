"use client";

import { motion } from "framer-motion";
import { FaFileAlt, FaPhone, FaUserCheck, FaCar } from "react-icons/fa";
import styles from "./AuctionHowItWorks.module.css";

const steps = [
    {
        id: 1,
        title: "Application",
        description: "Here you will fill in preliminary information about yourself to get started with the process.",
        icon: <FaFileAlt className={styles.icon} />,
        colorClass: styles.stepIconBlue,
    },
    {
        id: 2,
        title: "Scheduled Call",
        description: "A short call with our manager (can be a phone call, a thumb call, or a quick video call).",
        icon: <FaPhone className={styles.icon} />,
        colorClass: styles.stepIconGreen,
    },
    {
        id: 3,
        title: "Auction Access Registration",
        description: "After the call, you will need to register in Auction Access and upload the required documents for verification.",
        icon: <FaUserCheck className={styles.icon} />,
        colorClass: styles.stepIconPurple,
    },
    {
        id: 4,
        title: "Get Auction Access",
        description: "You receive Auction Access, can buy cars, and do what you love while earning money from it.",
        icon: <FaCar className={styles.icon} />,
        colorClass: styles.stepIconYellow,
    },
];

export const AuctionHowItWorks = () => {
    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    How It <span className={styles.highlight}>Works</span>
                </h2>
                <p className={styles.subtitle}>
                    Get started with our simple 4-step process to gain auction access and start earning money from car trading.
                </p>
            </div>

            <div className={styles.steps}>
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        className={styles.card}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <div className={styles.stepNumber}>{step.id}</div>
                        <div className={`${styles.iconWrapper} ${step.colorClass}`}>
                            {step.icon}
                        </div>
                        <h3 className={styles.cardTitle}>{step.title}</h3>
                        <p className={styles.cardDescription}>{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
