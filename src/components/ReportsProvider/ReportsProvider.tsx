"use client";

import { motion } from "framer-motion";
import styles from "./ReportsProvider.module.css";
import { FaCheckCircle, FaRegFileAlt } from "react-icons/fa";
import Image from "next/image";
import React, { FC } from "react";
import { useReport } from "@/hooks";
import { FiRefreshCw } from "react-icons/fi";
import { notifications } from "@mantine/notifications";
import { LoadingMinute } from "@/components";
import { useVINAnalysisStore } from "@/client/stores/vin-analysis.client-store";

export const ReportsProvider: FC = () => {
    const vin = useVINAnalysisStore(x => x.vin)
    const { mutate: getReport, isPending } = useReport();
    const handleGetReport = () => {
        if (!vin) {
            notifications.show({
                message: 'No VIN was selected',
                title: "Error",
                color: "red",
            })
            return
        }
        getReport(
            { query: { vin } },
            {
                onError: (error: any) => {
                    const message =
                        error?.response?.data?.message ||
                        error?.error.message ||
                        `An error occurred while fetching the ${vin}`;

                    notifications.show({
                        title: "Error",
                        message,
                        color: "red",
                    });
                },
            }
        );
    };


    return (
        <motion.div
            className={styles.reportFooter}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {isPending && <LoadingMinute label="We’re compiling the Vehicle History Report" />}
            <div className={styles.content}>
                <div className={styles.intro}>
                    <div className={styles.reportsAvailable}>
                        <FaCheckCircle className={styles.checkIcon} />
                        <span>Reports Available</span>
                    </div>
                    <p>Choose your preferred vehicle history provider</p>
                </div>

                <div className={styles.grid}>
                    {/* CARFAX */}
                    <motion.div whileHover={{ scale: 1.03 }} className={styles.cardBlue}>

                        <div className={styles.cardContent}>
                            <div className={styles.logoCircleBlue}>
                                <Image
                                    width={100}
                                    height={60}
                                    src="/carfax.png"
                                    alt="Carfax"
                                    className={styles.logo}
                                />
                            </div>
                            <h3>CARFAX Report</h3>
                            <p>Most comprehensive database with 22+ billion records</p>
                            <button
                                className={styles.btnBlue}
                                disabled={isPending}
                                onClick={handleGetReport}
                            >
                                Get Report
                            </button>
                        </div>
                    </motion.div>
                </div>

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
