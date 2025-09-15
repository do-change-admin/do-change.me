'use client'

import { motion } from 'framer-motion';
import { FaBell, FaEnvelope, FaPhone, FaCalendarAlt, FaHome, FaQuestionCircle } from 'react-icons/fa';
import styles from './ApplicationSuccesses.module.css';

export const ApplicationSuccesses = ()=> {
    return (
        <div className={styles.statusContent}>

            <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Application Received Successfully
            </motion.h1>

            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                <p className={styles.description}>
                    Your application for <span className={styles.highlight}>Auction Access</span> has been received. Our manager will contact you soon.
                </p>

                <div className={styles.noticeBox}>
                    <div className={styles.noticeHeader}>
                        <FaBell className={styles.noticeIcon} />
                        <span className={styles.noticeTitle}>Important Notice</span>
                    </div>
                    <p className={styles.noticeText}>
                        Please stay attentive to notifications in the app so you can proceed to the next step and schedule your interview call.
                    </p>
                </div>
            </motion.div>

            <motion.div
                id="next-steps"
                className={styles.nextSteps}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
            >
                <div className={styles.stepCard}>
                    <FaPhone className={styles.stepIcon} />
                    <h3 className={styles.stepTitle}>Manager Contact</h3>
                    <p className={styles.stepText}>Our team will reach out within 24-48 hours</p>
                </div>

                <div className={styles.stepCard}>
                    <FaCalendarAlt className={styles.stepIcon} />
                    <h3 className={styles.stepTitle}>Interview Scheduling</h3>
                    <p className={styles.stepText}>Schedule your verification call</p>
                </div>
            </motion.div>
        </div>
    );
}
