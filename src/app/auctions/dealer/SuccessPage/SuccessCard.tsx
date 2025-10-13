import { FC } from 'react';
import styles from './SuccessCard.module.css';
import { motion } from 'framer-motion';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdEmail, MdUpdate } from 'react-icons/md';
import { useRouter } from "next/navigation";

export const SuccessCard: FC = () => {
    const router = useRouter()
    return (
        <div className={styles.card}>

            {/* Success Icon */}
            <motion.div
                className={styles.successIconWrapper}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <AiOutlineCheckCircle className={styles.iconOutlineCheck} />
                <div className={styles.successPing}></div>
            </motion.div>

            {/* Header */}
            <motion.h1
                className={styles.header}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                Your application has been submitted!
            </motion.h1>
            <div className={styles.divider}></div>

            {/* Info Boxes */}
            <motion.div
                className={styles.infoBox}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <MdUpdate className={styles.infoIcon} />
                <p className={styles.infoText}>
                    Please keep an eye on updates on this page — when the next stage becomes available, the information here will be updated.
                </p>
            </motion.div>

            <motion.div
                className={styles.infoBox}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <MdEmail className={styles.infoIcon} />
                <p className={styles.infoText}>
                    For scheduling calls, we will reach out to you via the email address you provided.
                </p>
            </motion.div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
                <motion.button
                    className={styles.actionButton}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/')}
                >
                    Home Page
                </motion.button>
            </div>

            {/* Decorative Circles */}
            <div className={styles.topRightCircle}></div>
            <div className={styles.bottomLeftCircle}></div>
        </div>
    );
};
