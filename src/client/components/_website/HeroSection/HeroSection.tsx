'use client';

import { Image } from '@mantine/core';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {FaArrowRight, FaCar, FaDatabase, FaInfoCircle, FaRocket} from 'react-icons/fa';
import styles from './HeroSection.module.css';

export const HeroSection = () => {
    const router = useRouter();
    const handleClick = () => router.push('/auth/login');

    return (
        <section className={styles.heroSection} id="hero-section">

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
                                onClick={handleClick}
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.ctaButton}
                            >
                                <span>Start 2-Day Free Trial</span>
                                <motion.span
                                    className={styles.ctaIconWrapper}
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                >
                                    <FaArrowRight className={styles.ctaIcon} />
                                </motion.span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className={styles.heroVisuals}>
                        <motion.div
                            initial={{ rotate: 2 }}
                            whileHover={{ rotate: 0 }}
                            className={styles.mainCard}
                        >
                            <div className={styles.imageWrapper}>
                                <img
                                    src="/images/heroImage.png"
                                    alt="Dashboard"
                                    className={styles.mainImage}
                                />
                            </div>
                        </motion.div>

                        {/* Дополнительные карточки */}
                        <motion.div
                            initial={{ rotate: -6 }}
                            whileHover={{ rotate: 0 }}
                            className={styles.smallCard}
                            style={{ top: '2rem', right: '-1rem' }}
                        >
                            <Image
                                height={300}
                                width={100}
                                src="/images/carfaxScreen.png"
                                alt="Dashboard"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ rotate: 6 }}
                            whileHover={{ rotate: 0 }}
                            className={styles.smallCard}
                            style={{ bottom: '-1rem', left: '1rem' }}
                        >
                            <Image
                                height={300}
                                width={100}
                                src="/images/marketValue.png"
                                alt="Dashboard"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ rotate: -12 }}
                            whileHover={{ rotate: 0 }}
                            className={styles.smallCard}
                            style={{ top: '5rem', left: '-2rem' }}
                        >
                            <Image
                                height={300}
                                width={100}
                                src="/images/seller.png"
                                alt="Dashboard"
                            />
                        </motion.div>
                        <div className={styles.bgBlur}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};
