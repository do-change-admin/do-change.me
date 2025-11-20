'use client'

import {ActionsHistoryService} from "@/backend/services";
import styles from "./SearchHistory.module.css";
import React, {FC} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ColumnConfig, Table} from "@/client/components";
import {FiCopy, FiFileText} from "react-icons/fi";

export type SearchHistoryProps = {
    searches: ActionsHistoryService.VinAnalysisResult | undefined;
    isLoading: boolean;
}

export const SearchHistory: FC<SearchHistoryProps> = ({searches, isLoading}) => {
    const router = useRouter()

    if (!searches || !Object.keys(searches).length) {
        return <section className={styles.searchHistory}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Report History</h2>
                    <p>You don't have vin analysis history yet. Let's get started!</p>
                </div>
            </div>
        </section>
    }

    const data = Object.entries(searches).map(([vin, item]) => ({
        id: vin,
        vin,
        vehicle: `${item.baseInfo?.Make ?? ""}`,
        trim: item.baseInfo?.Model ?? "",
    }));

    const columns: ColumnConfig<typeof data[0]>[] = [
        {
            key: "vehicle",
            label: "Vehicle",
            render: (item) => (
                <div>
                    {/* Vehicle name — blue link */}
                    <Link href={`/?vin=${item.vin}`} className={styles.vehicleLink}>
                        {item.vehicle}
                    </Link>

                    {/* Trim */}
                    {item.trim && (
                        <div className={styles.vehicleTrim}>{item.trim}</div>
                    )}
                </div>
            ),
        },
        {
            key: "vin",
            label: "VIN",
            render: (item) => (
                <div className={styles.vinCopyWrapper}>
                    <span className={styles.vinText}>{item.vin}</span>

                    {/* Copy button */}
                    <button
                        className={styles.copyBtn}
                        onClick={() => navigator.clipboard.writeText(item.vin)}
                    >
                        <FiCopy size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <section className={styles.searchHistory}>
            <Table
                title="Report History"
                iconLeft={<FiFileText size={22} />}
                data={data}
                columns={columns}
                rowsPerPage={20}
            />
        </section>
    );
}
