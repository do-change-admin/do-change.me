import React from 'react';
import styles from "./VinSearch.module.css";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Input } from '@/client/components/_ui';
import Image from "next/image";
import { useProfile } from "@/client/hooks";
import { useScannerState } from '@/client/states/scanner.state';
import { useVINAnalysisState } from '@/client/states/vin-analysis.state';
import { useShallow } from 'zustand/react/shallow'
import { VIN } from '@/value-objects/vin.value-object';

export const VinSearch = ({ openSubscription }: { openSubscription?: () => void }) => {
    const router = useRouter();
    const { data } = useProfile();

    const { setVIN, vin } = useVINAnalysisState(
        useShallow(({ setVIN, vin }) => ({ vin, setVIN }))
    )
    const start = useScannerState(x => x.start);

    const handleSearch = () => {
        if (openSubscription && !data?.subscription) {
            openSubscription()
            return;
        }
        if (!VIN.schema.safeParse(vin).success) {
            return;
        }
        router.push(`/?vin=${encodeURIComponent(vin!)}`);
    };

    const handleStartScanner = () => {
        if (openSubscription && !data?.subscription) {
            openSubscription()
            return;
        }
        start()
    }

    return (
        <div className={styles.searchPanel}>
            <div className={styles.grid}>
                <Input
                    onChange={(e) => setVIN(e.target.value)}
                    type="text"
                    placeholder={vin || 'Enter VIN (e.g. 1C6RD6FT1CS310366)'}
                    maxLength={17}
                    value={vin || ""}
                    icon={<>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className={styles.analyzeBtn}
                            onClick={handleSearch}
                        >
                            <FaSearch className={styles.icon} /> <span>Analyze</span>
                        </motion.button>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={styles.scanBox}
                            onClick={handleStartScanner}
                        >
                            <div className={styles.qrBox}>
                                <Image className={styles.qrIcon} src="/scanIcon.png" alt='' width={25} height={25} />
                            </div>
                        </motion.div>
                    </>}
                />

            </div>
        </div>
    );
}
