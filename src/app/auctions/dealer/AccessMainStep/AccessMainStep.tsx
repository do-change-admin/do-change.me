'use client'

import { motion } from "framer-motion";
import { FaKey } from "react-icons/fa";
import styles from "./AccessMainStep.module.css";
import { useRouter } from "next/navigation";
import { AuctionHowItWorks } from "@/client/components";
import { FC } from "react";

interface AccessMainStepProps {
    onStart: () => void;
}

export const AccessMainStep: FC<AccessMainStepProps> = ({ onStart }) => (
    <div className={styles.main}>
        <AuctionHowItWorks />
        <motion.div
            className={styles.ctaSection}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <motion.button
                className={styles.getAccessBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
            >
                <FaKey className={styles.buttonIcon} />
                Get Access
            </motion.button>
        </motion.div>
    </div>
);
