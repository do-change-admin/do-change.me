"use client";

import { motion } from "framer-motion";
import { FaFileAlt, FaPhone, FaUserCheck, FaCar } from "react-icons/fa";
import styles from "./AuctionHowItWorks.module.css";
import { useTranslations } from "next-intl";

export const AuctionHowItWorks = () => {
    const t = useTranslations("AuctionHowItWorks");

    const steps = [
        {
            id: 1,
            title: t("steps.0.title"),
            description: t("steps.0.description"),
            icon: <FaFileAlt className={styles.icon} />,
            colorClass: styles.stepIconBlue,
        },
        {
            id: 2,
            title: t("steps.1.title"),
            description: t("steps.1.description"),
            icon: <FaPhone className={styles.icon} />,
            colorClass: styles.stepIconGreen,
        },
        {
            id: 3,
            title: t("steps.2.title"),
            description: t("steps.2.description"),
            icon: <FaUserCheck className={styles.icon} />,
            colorClass: styles.stepIconPurple,
        },
        {
            id: 4,
            title: t("steps.3.title"),
            description: t("steps.3.description"),
            icon: <FaCar className={styles.icon} />,
            colorClass: styles.stepIconYellow,
        },
    ];

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {t("header.title").split(" ").map((word, i) =>
                        i === 1 ? <span key={i} className={styles.highlight}>{word} </span> : word + " "
                    )}
                </h2>
                <p className={styles.subtitle}>{t("header.subtitle")}</p>
            </div>

            <div className={styles.steps}>
                {steps.map((step) => (
                    <motion.div
                        key={step.id}
                        className={styles.card}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <div className={styles.stepNumber}>{step.id}</div>
                        <div className={`${styles.iconWrapper} ${step.colorClass}`}>{step.icon}</div>
                        <h3 className={styles.cardTitle}>{step.title}</h3>
                        <p className={styles.cardDescription}>{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
