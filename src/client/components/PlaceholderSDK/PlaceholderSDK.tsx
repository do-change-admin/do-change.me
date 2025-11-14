"use client";

import React, {FC} from "react";
import { motion } from "framer-motion";
import {FaBox, FaCar, FaPlus} from "react-icons/fa";
import styles from "./PlaceholderSDK.module.css";
import {Card} from "@mantine/core";

export const PlaceholderSDK: FC<{title?: string, description?: string}> = ({title=" No items available yet", description="Your collection is currently empty. Add new items to start managing your inventory and keep everything organized in one place."}) => {
    return (
        <Card shadow="lg" radius="xl" p="xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.content}
            >
                <div className={styles.iconWrapper}>
                    <FaCar className={styles.icon} />
                </div>

                <h2 className={styles.title}>
                    {title}
                </h2>

                <p className={styles.description}>
                    {description}
                </p>
            </motion.div>
        </Card>
    );
};
