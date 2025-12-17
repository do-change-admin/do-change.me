'use client';

import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import type { FC } from 'react';
import { FiCopy, FiFileText } from 'react-icons/fi';
import type { ActionsHistoryService } from '@/backend/services';
import { type ColumnConfig, Table } from '@/client/components';
import styles from './SearchHistory.module.css';

export type SearchHistoryProps = {
    searches: ActionsHistoryService.VinAnalysisResult | undefined;
    isLoading: boolean;
};

export const SearchHistory: FC<SearchHistoryProps> = ({ searches }) => {
    if (!searches || !Object.keys(searches).length) {
        return (
            <section className={styles.searchHistory}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2>Report History</h2>
                        <p>You don't have vin analysis history yet. Let's get started!</p>
                    </div>
                </div>
            </section>
        );
    }

    const data = Object.entries(searches).map(([vin, item]) => ({
        id: vin,
        vin,
        vehicle: `${item.baseInfo?.Make ?? ''}`,
        trim: item.baseInfo?.Model ?? ''
    }));

    const columns: ColumnConfig<(typeof data)[0]>[] = [
        {
            key: 'vehicle',
            label: 'Vehicle',
            render: (item) => (
                <div>
                    {/* Vehicle name — blue link */}
                    <Link className={styles.vehicleLink} href={`/?vin=${item.vin}`}>
                        {item.vehicle}
                    </Link>

                    {/* Trim */}
                    {item.trim && <div className={styles.vehicleTrim}>{item.trim}</div>}
                </div>
            )
        },
        {
            key: 'vin',
            label: 'VIN',
            render: (item) => (
                <div className={styles.vinCopyWrapper}>
                    <span className={styles.vinText}>{item.vin}</span>

                    {/* Copy button */}
                    <button
                        className={styles.copyBtn}
                        onClick={() => {
                            navigator.clipboard.writeText(item.vin);
                            notifications.show({
                                color: 'green',
                                message: 'VIN was succcessfully copied!'
                            });
                        }}
                        type="button"
                    >
                        <FiCopy size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <section className={styles.searchHistory}>
            <Table
                columns={columns}
                data={data}
                iconLeft={<FiFileText size={22} />}
                rowsPerPage={20}
                title="Report History"
            />
        </section>
    );
};
