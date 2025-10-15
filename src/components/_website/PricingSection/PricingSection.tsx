"use client";

import { motion } from "framer-motion";
import { FaCheck, FaStar, FaShieldAlt, FaHeadset, FaClock } from "react-icons/fa";
import styles from "./PricingSection.module.css";

export const PricingSection= () => {
    return (
        <section id="pricing-section" className={styles.section}>
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
                    {/* Basic */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.planTitle}>Basic</h3>
                            <div className={styles.priceRow}>
                                <span className={styles.oldPrice}>$70</span>
                                <span className={styles.price}>$50</span>
                            </div>
                            <div className={styles.badgeSave}>Save $20</div>
                        </div>

                        <div className={styles.features}>
                            <Feature text="Market Value" badge="Unlimited"/>
                            <Feature text="Smart VIN Scanner" badge="Unlimited"/>
                            <Feature text="Salvage check" badge="Unlimited"/>
                            <Feature text="Auction Access" badge="Beta" />
                            <div className={styles.reportWrapper}>
                                <Feature text="25 CarFax or AutoCheck reports"/>
                                <div className={styles.additional}>Additional reports – $0.80 each</div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.basicBtn}
                        >
                            Get Started
                        </motion.button>
                    </div>

                    {/* Professional */}
                    <div className={`${styles.card} ${styles.professional}`}>
                        <div className={styles.popularBadge}>Most Popular</div>

                        <div className={styles.cardHeader}>
                            <h3 className={styles.planTitle}>Professional</h3>
                            <div className={styles.priceRow}>
                                <span className={styles.oldPrice}>$80</span>
                                <span className={styles.price}>$75</span>
                            </div>
                            <div className={styles.badgeSave}>Save $5</div>
                        </div>

                        <div className={styles.features}>
                            <Feature text="Market Value" badge="Unlimited"/>
                            <Feature text="Smart VIN Scanner" badge="Unlimited"/>
                            <Feature text="Salvage check" badge="Unlimited"/>
                            <Feature text="Auction Access" badge="Beta" />
                            <div className={styles.reportWrapper}>
                                <Feature text="40 CarFax or AutoCheck reports" />
                                <div className={styles.additional}>Additional reports – $0.75 each</div>
                            </div>

                            <div className={styles.subFeatures}>
                                <div className={styles.subTitle}>Professional Features:</div>
                                <SubFeature text="Listing on all major marketplaces" />
                                <SubFeature text="Our marketplace listing" />
                                <SubFeature text="AI image processing & video" />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.professionalBtn}
                        >
                            Get Started
                        </motion.button>
                    </div>

                    {/* Enterprise */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.planTitle}>Enterprise</h3>
                            <div className={styles.priceRow}>
                                <span className={styles.oldPrice}>$200</span>
                                <span className={styles.price}>$99</span>
                            </div>
                            <div className={styles.badgeSave}>Save $100</div>
                        </div>

                        <div className={styles.features}>
                            <Feature text="Auction Access" badge="Beta" />
                            <Feature text="Market Value" badge="Unlimited"/>
                            <Feature text="Smart VIN Scanner" badge="Unlimited"/>
                            <Feature text="Salvage check" badge="Unlimited"/>
                            <Feature text="Auction Access" badge="Beta" />
                            <div className={styles.reportWrapper}>
                                <Feature text="70 CarFax or AutoCheck reports" />
                                <div className={styles.additional}>Additional reports – $0.70 each</div>
                            </div>

                            <div className={styles.subFeatures}>
                                <div className={styles.subTitle}>Enterprise Features:</div>
                                <SubFeature text="Listing on all major marketplaces" />
                                <SubFeature text="Our marketplace listing" />
                                <SubFeature text="AI image processing & video" />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.enterpriseBtn}
                        >
                            Get Started
                        </motion.button>
                    </div>
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

/* --- Reusable Components --- */
function Feature({ text, badge }: { text: string; badge?: string }) {
    return (
        <div className={styles.feature}>
            <FaCheck className={styles.check} />
            <span>{text}</span>
            {badge && <span className={styles.badge}>{badge}</span>}
        </div>
    );
}

function SubFeature({ text }: { text: string }) {
    return (
        <div className={styles.subFeature}>
            <FaStar className={styles.star} />
            <span>{text}</span>
        </div>
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
