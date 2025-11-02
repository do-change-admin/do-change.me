"use client";

import { FaShieldAlt, FaHeadset, FaClock } from "react-icons/fa";
import styles from "./PricingSection.module.css";
import { Plans } from "@/client/components";

export const PricingSection = () => {
    return (
        <section id="pricing" className={styles.section}>
            <div className={styles.container}>
                {/* HeaderWeb */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Choose Your Plan</h2>
                    <p className={styles.subtitle}>
                        All the tools you need to buy smarter, check faster, and sell quicker — with flexible pricing built for car dealers and resellers.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className={styles.cards}>
                    <Plans isHome />
                </div>

                {/* FooterWeb */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        All plans include secure payment processing and 24/7 customer support
                    </p>
                    <div className={styles.footerIcons}>
                        <FooterIcon icon={<FaShieldAlt className={styles.secure} />} text="Secure & Encrypted" />
                        <FooterIcon icon={<FaHeadset className={styles.support} />} text="24/7 Support" />
                        <FooterIcon icon={<FaClock className={styles.instant} />} text="Instant Access" />
                    </div>
                </div>
            </div>
        </section>
    );
}


function FooterIcon({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className={styles.footerItem}>
            {icon}
            <span>{text}</span>
        </div>
    );
}
