'use client';

import { motion, useAnimation } from 'framer-motion';
import React, { FC, useEffect, useState } from 'react';
import styles from './LoadingMinute.module.css';

interface LoadingMinuteProps {
    durationMs?: number;
    onComplete?: () => void;
    label?: string
}

const LABELS = [
    'Getting ready',
    'Working on it',
    'Hang tight',
    'Almost there',
];

export const LoadingMinute: FC<LoadingMinuteProps> = ({
                                                          durationMs = 60000,
                                                          onComplete,
                                                          label
                                                      }) => {
    const controls = useAnimation();
    const [labelIndex, setLabelIndex] = useState(0);

    // Progress animation
    useEffect(() => {
        controls
            .start({
                width: '100%',
                transition: { duration: durationMs / 1000, ease: 'linear' },
            })
            .then(() => onComplete?.());
    }, [controls, durationMs, onComplete]);

    // Label rotation (ChatGPT-style)
    useEffect(() => {
        const step = durationMs / LABELS.length;
        const interval = setInterval(() => {
            setLabelIndex((i) => Math.min(i + 1, LABELS.length - 1));
        }, step);

        return () => clearInterval(interval);
    }, [durationMs]);

    return (
        <div className={styles.overlay}>
            <div className={styles.wrapper}>
                <div className={styles.ad}>
                    <span>🚀 Pro tip</span>
                    <strong>Remove car backgrounds in seconds with AI</strong>
                </div>

                <div className={styles.labelWrapper}>
                    <span
                        className={styles.label}
                    >
                        {label || LABELS[labelIndex]}
                    </span>
                    <span className={styles.dots}>•••</span>
                </div>

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
