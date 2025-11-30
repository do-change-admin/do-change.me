"use client";

import { motion, useAnimation } from "framer-motion";
import React, { FC, useEffect } from "react";
import styles from "./LoadingMinute.module.css";

interface LoadingMinuteProps {
    durationMs?: number;
    label?: string;
    onComplete?: () => void;
}

export const LoadingMinute: FC<LoadingMinuteProps> = ({
                                                          durationMs = 60000,
                                                          label = "Preparing…",
                                                          onComplete,
                                                      }) => {
    const controls = useAnimation();

    useEffect(() => {
        controls
            .start({
                width: "100%",
                transition: { duration: durationMs / 1000, ease: "linear" },
            })
            .then(() => {
                onComplete?.();
            });
    }, [controls, durationMs, onComplete]);

    return (
        <div className={styles.overlay}>
            <div className={styles.wrapper}>
                <motion.div
                    className={styles.shimmerLabel}
                    animate={{
                        backgroundPosition: ["200% 50%", "0% 50%"],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {label}
                </motion.div>

                <div className={styles.track}>
                    <motion.div
                        className={styles.bar}
                        initial={{ width: 0 }}
                        animate={controls}
                    />
                </div>
            </div>
        </div>
    );
};
