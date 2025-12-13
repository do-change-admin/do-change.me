'use client';

import { Image } from '@mantine/core';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaCar, FaDatabase, FaInfoCircle, FaRocket } from 'react-icons/fa';
import styles from './HeroSection.module.css';

// // const features = [
// //     { icon: <FaChartLine />, title: 'Market Value', subtitle: 'Unlimited Access' },
// //     { icon: <FaBarcode />, title: 'VIN Scanner', subtitle: 'Quick & Accurate' },
// //     { icon: <FaHeadset />, title: '24/7 Support', subtitle: 'Always Available' },
// //     { icon: <FaFileAlt />, title: 'Vehicle History Reports', subtitle: '' },
// //     { icon: <FaGavel />, title: 'Auction Access', subtitle: 'Professional Tools' },
// //     { icon: <FaExclamationTriangle />, title: 'Total Loss Check', subtitle: '' }
// // ];

export const HeroSection = () => {
    const router = useRouter();
    const handleClick = () => router.push('/auth/login');

    return (
        <section className={styles.heroSection} id="hero-section">
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
                                Car Flipping Made Easy. <span className={styles.gradientText}>Buy & Sell</span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                Get all the tools you need to buy, verify, and sell vehicles with confidence. Access
                                dealer auctions, real-time market data, and detailed vehicle reports —{' '}
                                <strong>all without a dealer license.</strong>
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className={styles.ctaButtons}>
                            <motion.button
                                className={styles.getPlanButton}
                                onClick={handleClick}
                                whileHover={{ scale: 1.05 }}
                            >
                                <FaRocket className={styles.buttonIcon} />
                                Get Plan
                            </motion.button>
                            <motion.button
                                className={styles.learnMoreButton}
                                onClick={handleClick}
                                whileHover={{ scale: 1.05 }}
                            >
                                <FaInfoCircle className={styles.buttonIcon} />
                                Learn More
                            </motion.button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className={styles.heroVisual}>
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            className={`${styles.floating} ${styles.mainImage}`}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Image alt="" className={styles.heroImage} radius="lg" src="/images/heroImage.png" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            className={`${styles.floatingIcon} ${styles.carIcon}`}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        >
                            <FaCar size={'50%'} />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            className={`${styles.floatingIcon} ${styles.databaseIcon}`}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        >
                            <FaDatabase size={'50%'} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
