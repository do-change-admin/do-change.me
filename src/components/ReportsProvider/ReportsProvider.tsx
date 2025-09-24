"use client";

import { motion } from "framer-motion";
import styles from "./ReportsProvider.module.css";
import { FaCheckCircle, FaRegFileAlt } from "react-icons/fa";
import Image from "next/image";
import React, { FC } from "react";
import { useCheckRecords } from "@/hooks";
import { FiRefreshCw } from "react-icons/fi";

export interface IReportsProviderProp {
    vin: string;
    reportsLeft: number;
}

export const ReportsProvider: FC<IReportsProviderProp> = ({ vin, reportsLeft }) => {
    const { mutate: handleCheck } = useCheckRecords(vin || '');
    return (
        <motion.div
            className={styles.reportFooter}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header */}
            {/*<div className={styles.header}>*/}
            {/*    <h2>Get Detailed Vehicle History Report</h2>*/}
            {/*    <p>Uncover hidden problems, accidents, and more with official reports</p>*/}
            {/*</div>*/}

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.intro}>
                    <div className={styles.reportsAvailable}>
                        <FaCheckCircle className={styles.checkIcon} />
                        <span>{reportsLeft.toString()} Reports Available</span>
                    </div>
                    <p>Choose your preferred vehicle history provider</p>
                </div>

                {/* Grid */}
                <div className={styles.grid}>
                    {/* CARFAX */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={styles.cardBlue}
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.logoCircleBlue}>
                                <Image width={100} height={60} src="/carfax.png" alt="Carfax" className={styles.logo} />
                            </div>
                            <h3>CARFAX Report</h3>
                            <p>Most comprehensive database with 22+ billion records</p>
                            <button className={styles.btnBlue} onClick={() => handleCheck('carfax')}>Order CARFAX Report</button>
                            <div className={styles.priceBlue}>$0.99</div>
                        </div>
                    </motion.div>

                    {/* AutoCheck */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={styles.cardOrange}
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.logoCircleOrange}>
                                <Image width={100} height={50} src='/autoCheck.png' alt="AutoCheck" className={styles.logo} />
                            </div>
                            <h3>AutoCheck Report</h3>
                            <p>Experian's trusted vehicle history service</p>
                            <button className={styles.btnOrange} onClick={() => handleCheck("autocheck")}>Order AutoCheck Report</button>
                            <div className={styles.priceOrange}>$0.99</div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div>
                        <FaCheckCircle className={styles.iconGreen} />
                        <span>Verified Accuracy</span>
                    </div>
                    <div>
                        <FiRefreshCw className={styles.iconBlue} />
                        <span>Always Up-to-Date</span>
                    </div>
                    <div>
                        <FaRegFileAlt className={styles.iconPurple} />
                        <span>Professional Reports</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
