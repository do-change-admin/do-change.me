"use client";

import { motion, useAnimation } from "framer-motion";
import React, {FC, useEffect} from "react";
import styles from "./LoadingMinute.module.css";

interface LoadingMinuteProps {
    durationMs?: number;
    label?: string;
    onComplete?: () => void;
}

export const LoadingMinute:FC<LoadingMinuteProps> = ({
                                          durationMs = 60000,
                                          label = "Preparing…",
                                          onComplete,
                                      }) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            width: "100%",
            transition: { duration: durationMs / 1000, ease: "linear" },
        }).then(() => {
            onComplete?.();
        });
    }, [controls, durationMs, onComplete]);

    return (
        <div className={styles.overlay}>
            <div className={styles.wrapper}>
                <div className={styles.header}>{label}</div>
                <div className={styles.track}>
                    <motion.div className={styles.bar} initial={{ width: 0 }} animate={controls} />
                </div>
            </div>
        </div>
    );
}
