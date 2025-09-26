"use client";

import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import styles from "./page.module.css";

export default function Sell() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Text block */}
                    <motion.div
                        className={styles.textBlock}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className={styles.title}>
                            Car Syndication — <br />
                            <span className={styles.highlight}>Coming Soon!</span>
                        </h1>
                        <p className={styles.description}>
                            Soon you will be able to list your car across multiple marketplaces with just one click.
                        </p>
                    </motion.div>

                    {/* Image block */}
                    <motion.div
                        className={styles.imageWrapper}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            className={styles.image}
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/b657407fff-b0a7a6e3676de140b0e2.png"
                            alt="Toyota car connected to marketplaces"
                        />
                        <div className={styles.checkIcon}>
                            <FaCheck size={24} color="#fff" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
