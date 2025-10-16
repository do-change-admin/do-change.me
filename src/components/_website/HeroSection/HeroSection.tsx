'use client'

import styles from './HeroSection.module.css';
import {
    FaStar,
    FaChartLine,
    FaShieldAlt,
    FaHeadset,
    FaFileAlt,
    FaGavel,
    FaExclamationTriangle,
    FaRocket,
    FaInfoCircle,
    FaCar,
    FaDatabase,
    FaBarcode
} from 'react-icons/fa';
import heroImage from './img.png';
import { motion } from 'framer-motion';
import {useRouter} from "next/navigation";

const features = [
    { icon: <FaChartLine />, title: 'Market Value', subtitle: 'Unlimited Access' },
    { icon: <FaBarcode />, title: 'VIN Scanner', subtitle: 'Quick & Accurate' },
    { icon: <FaHeadset />, title: '24/7 Support', subtitle: 'Always Available' },
    { icon: <FaFileAlt />, title: 'Vehicle History Reports', subtitle: '' },
    { icon: <FaGavel />, title: 'Auction Access', subtitle: 'Professional Tools' },
    { icon: <FaExclamationTriangle />, title: 'Total Loss Check', subtitle: '' },
];

export const HeroSection = ()=> {
    const router = useRouter();
    const handleClick = () => router.push('/auth/login');

    return (
        <section id="hero-section" className={styles.heroSection}>
            <div className={styles.backgroundGradient}></div>
            <div className={styles.overlayGradient}></div>

            <div className={styles.contentWrapper}>
                <div className={styles.grid}>
                    {/* Hero Content */}
                    <div className={styles.heroContent}>
                        <div className={styles.topInfo}>
                            {/*<div className={styles.trustedBadge}>*/}
                            {/*    <FaStar className={styles.starIcon} />*/}
                            {/*    <span>Trusted by Professionals</span>*/}
                            {/*</div>*/}
                            <h1 className={styles.heroTitle}>
                                Complete Vehicle{' '}
                                <span className={styles.gradientText}>Data Intelligence</span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                Access unlimited vehicle pricing and history reports with our comprehensive data tools - <strong> no dealer license required.</strong> Make informed decisions with real-time market intelligence.
                            </p>
                        </div>

                        {/* Features */}
                        <div className={styles.featuresGrid}>
                            {features.map((f, i) => (
                                <div key={i} className={styles.featureCard}>
                                    <div className={styles.featureIcon}>
                                        {f.icon}
                                    </div>
                                    <div>
                                        <p className={styles.featureTitle}>{f.title}</p>
                                        <p className={styles.featureSubtitle}>{f.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className={styles.ctaButtons}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className={styles.getPlanButton}
                                onClick={handleClick}
                            >
                                <FaRocket className={styles.buttonIcon} />
                                Get Plan
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className={styles.learnMoreButton}
                                onClick={handleClick}
                            >
                                <FaInfoCircle className={styles.buttonIcon} />
                                Learn More
                            </motion.button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className={styles.heroVisual}>
                        <motion.div
                            className={styles.floating}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <img
                                className={styles.heroImage}
                                src={heroImage.src}
                                alt=""
                            />
                        </motion.div>

                        <motion.div
                            className={`${styles.floatingIcon} ${styles.carIcon}`}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        >
                            <FaCar />
                        </motion.div>

                        <motion.div
                            className={`${styles.floatingIcon} ${styles.databaseIcon}`}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        >
                            <FaDatabase />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
