'use client'

import { motion } from "framer-motion";
import styles from "./HowItWorksSection.module.css";
import { FaUserPlus, FaClipboardList, FaKey, FaChartLine, FaClock, FaStar, FaTools, FaRocket } from "react-icons/fa";

const steps = [
    {
        icon: <FaUserPlus />,
        title: "Quick Registration",
        description: "Create your professional account in under 2 minutes and unlock the full potential of our automotive marketplace.",
        metaIcon: <FaClock />,
        metaText: "2 minutes setup",
        gradient: "gradient1"
    },
    {
        icon: <FaClipboardList />,
        title: "Select Your Plan",
        description: "Choose from flexible pricing plans designed for dealers, auctioneers, and individual sellers of all sizes.",
        metaIcon: <FaStar />,
        metaText: "Flexible options",
        gradient: "gradient1"
    },
    {
        icon: <FaKey />,
        title: "Get access",
        description: "Get access to auctions if you want to participate in them. All other tools are available immediately after registration.",
        metaIcon: <FaTools />,
        metaText: "Professional suite",
        gradient: "gradient2"
    },
    {
        icon: <FaChartLine />,
        title: "Scale Your Business",
        description: "Transform your passion into profit with our comprehensive automotive business platform and expert support.",
        metaIcon: <FaRocket />,
        metaText: "Growth focused",
        gradient: "gradient2"
    }
];

export const HowItWorksSection = () =>  {
    return (
        <section id="how-it-works" className={styles.section}>
            <div className={styles.background}>
                {/* Тут можно добавить абстрактные иконки как фон */}
            </div>

            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>How It Works</h2>
                    <p>Start your automotive business journey in four simple steps</p>
                </motion.div>

                <div className={styles.grid}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.card} ${styles[step.gradient]}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <div className={styles.iconWrapper}>{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            <div className={styles.meta}>
                                {step.metaIcon}
                                <span>{step.metaText}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className={styles.cta}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <button>
                        <FaRocket className={styles.buttonIcon} />
                        Launch Your Success Story
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
