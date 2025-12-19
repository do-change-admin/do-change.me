'use client';

import { notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { FC } from 'react';
import { FaCheckCircle, FaRegFileAlt } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { LoadingMinute } from '@/client/components';
import { useReport } from '@/client/hooks';
import { useVINAnalysisState } from '@/client/states/vin-analysis.state';
import { VIN } from '@/value-objects/vin.value-object';
import styles from './ReportsProvider.module.css';

export const ReportsProvider: FC = () => {
    const vin = useVINAnalysisState((x) => x.vin);
    const { mutate: getReport, isPending } = useReport();
    const handleGetReport = () => {
        if (!vin) {
            notifications.show({
                message: 'No VIN was selected',
                title: 'Error',
                color: 'red'
            });
            return;
        }
        if (!VIN.schema.safeParse(vin)) {
            notifications.show({
                message: 'Requested VIN is invalid',
                title: 'Error',
                color: 'red'
            });
            return;
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
                        title: 'Error',
                        message,
                        color: 'red'
                    });
                }
            }
        );
    };

    return (
        <motion.div
            className={styles.reportFooter}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                    <motion.div className={styles.cardBlue} whileHover={{ scale: 1.03 }}>
                        <div className={styles.cardContent}>
                            <div className={styles.logoCircleBlue}>
                                <Image alt="Carfax" className={styles.logo} height={60} src="/carfax.png" width={100} />
                            </div>
                            <h3>CARFAX Report</h3>
                            <p>Most comprehensive database with 22+ billion records</p>
                            <button
                                className={styles.btnBlue}
                                disabled={isPending}
                                onClick={handleGetReport}
                                type="button"
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
