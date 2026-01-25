import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useShallow } from 'zustand/react/shallow';
import { Input } from '@/client/components/_ui';
import { VehicleSticker } from '@/client/features/vehicle-info/sticker';
import { useScannerState } from '@/client/states/scanner.state';
import { useVINAnalysisState } from '@/client/states/vin-analysis.state';
import { VIN } from '@/value-objects/vin.value-object';
import styles from './VinSearch.module.css';

export const VinSearch = () => {
    const router = useRouter();

    const { setVIN, vin } = useVINAnalysisState(useShallow(({ setVIN, vin }) => ({ vin, setVIN })));
    const start = useScannerState((x) => x.start);

    const handleSearch = () => {
        if (!VIN.schema.safeParse(vin).success) {
            notifications.show({
                message: 'Invalid VIN',
                title: 'Error',
                color: 'red'
            });
            return;
        }
        router.push(`/?vin=${encodeURIComponent(vin!)}`);
    };

    const handleStartScanner = () => {
        start();
    };

    return (
        <div className={styles.searchPanel}>
            <div className={styles.grid}>
                <Input
                    icon={
                        <>
                            {vin && (
                                <ActionIcon onClick={() => setVIN('')} variant="outline">
                                    <FaTimes className={styles.icon} />
                                </ActionIcon>
                            )}
                            <VehicleSticker
                                views={{
                                    Layout: ({ downloadSticker }) => {
                                        return (
                                            <button
                                                onClick={() => {
                                                    downloadSticker();
                                                }}
                                                type="button"
                                            >
                                                DOWNLOAD
                                            </button>
                                        );
                                    }
                                }}
                                vin={vin ?? ''}
                            />
                            <motion.button
                                className={styles.analyzeBtn}
                                onClick={handleSearch}
                                whileHover={{ scale: 1.05 }}
                            >
                                <FaSearch className={styles.icon} /> <span>Analyze</span>
                            </motion.button>
                            <motion.div
                                className={styles.scanBox}
                                onClick={handleStartScanner}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className={styles.qrBox}>
                                    <Image
                                        alt=""
                                        className={styles.qrIcon}
                                        height={25}
                                        src="/scanIcon.png"
                                        width={25}
                                    />
                                </div>
                            </motion.div>
                        </>
                    }
                    maxLength={17}
                    onChange={(e) => setVIN(e.target.value)}
                    placeholder={vin || 'Enter VIN (e.g. 1C6RD6FT1CS310366)'}
                    type="text"
                    value={vin || ''}
                />
            </div>
        </div>
    );
};
