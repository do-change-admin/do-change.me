'use client'

import { motion } from "framer-motion";
import styles from "./DesktopAppSection.module.css";
import { FaDesktop, FaChartLine, FaGavel } from "react-icons/fa";

export const DesktopAppSection = () => {
    return (
        <section id="desktop-app" className={styles.section}>
            <div className={styles.container}>
                {/* HeaderWeb */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Desktop Workspace</h2>
                    <p>Full-featured desktop application for advanced automotive business management</p>
                </motion.div>

                {/* Laptop Mockup */}
                {/*<motion.div*/}
                {/*    className={styles.laptopWrapper}*/}
                {/*    initial={{ scale: 0.9, opacity: 0 }}*/}
                {/*    whileInView={{ scale: 1, opacity: 1 }}*/}
                {/*    transition={{ duration: 1 }}*/}
                {/*>*/}
                {/*    <div className={styles.laptopTop}>*/}
                {/*        <div className={styles.screen}>*/}
                {/*            <div className={styles.desktopApp}>*/}
                {/*                <video*/}
                {/*                    src="/video.mp4"*/}
                {/*                    autoPlay*/}
                {/*                    loop*/}
                {/*                    muted*/}
                {/*                    playsInline*/}
                {/*                    className={styles.video}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className={styles.laptopBase}>*/}
                {/*        <div className={styles.laptopStand}></div>*/}
                {/*    </div>*/}
                {/*</motion.div>*/}

                {/* Features */}
                <motion.div
                    className={styles.features}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className={styles.featureCard}>
                        <FaGavel className={styles.featureIcon} />
                        <h3>Smart Vehicle Tools</h3>
                        <p>Access a powerful and user-friendly platform designed to simplify vehicle research and management.</p>
                    </div>

                    <div className={styles.featureCard}>
                        <FaChartLine className={styles.featureIcon} />
                        <h3>Analytics Dashboard</h3>
                        <p>Track your performance with a sleek, easy-to-use dashboard featuring powerful analytics and insights.</p>
                    </div>

                    <div className={styles.featureCard}>
                        <FaDesktop className={styles.featureIcon} />
                        <h3>Quick Vehicle Check</h3>
                        <p>Instantly verify any vehicle’s history and market value — fast, accurate, and accessible anywhere.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
