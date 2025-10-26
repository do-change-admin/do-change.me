import styles from "./PlateSearch.module.css";
import { motion } from "framer-motion";
import React from "react";
import { Input } from "@/client/components/_ui";

export const PlateSearch = () => {
    return (
        <div className={styles.plateSearch}>
            <Input type="text"
                label="Enter License Plate"
                placeholder="ABC123"
                maxLength={8}
                icon={(
                    <motion.button whileHover={{ scale: 1.05 }} className={styles.analyzeBtn}>
                        Search
                    </motion.button>
                )}
            />
        </div>
    );
}
