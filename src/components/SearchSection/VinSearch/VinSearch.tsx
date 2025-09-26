import React, { FC, useState } from 'react';
import styles from "./VinSearch.module.css";
import { motion } from "framer-motion";
import {FaCamera, FaQrcode, FaSearch} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from '@/components/_ui';
import {BiBarcode} from "react-icons/bi";
import {useScanner} from "@/contexts";
import Image from "next/image";

export const VinSearch = ({openSubscription}:{openSubscription?: () => void}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initVin = searchParams.get("vin");
    const [vin, setVin] = useState(initVin);
    const { start } = useScanner();

    const handleSearch = () => {
        if (openSubscription) {
            openSubscription()
        }
        // if (!vin && vin?.length !== 17) return;
        // router.push(`/?vin=${encodeURIComponent(vin)}`);
    };

    return (
        <div className={styles.searchPanel}>
            <div className={styles.grid}>
                <Input
                    onChange={(e) => setVin(e.target.value)}
                    type="text"
                    placeholder={initVin || 'Enter VIN (e.g. 1C6RD6FT1CS310366)'}
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
                            onClick={start}
                        >
                            <div className={styles.qrBox}>
                                <Image className={styles.qrIcon} src="/scanIcon.png" alt='' width={25} height={25}/>
                            </div>
                        </motion.div>
                    </>}
                />

            </div>
        </div>
    );
}
