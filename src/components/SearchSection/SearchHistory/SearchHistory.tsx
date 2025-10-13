'use client'

import { ActionsHistoryService } from "@/services";
import styles from "./SearchHistory.module.css";
import { FC } from "react";
import { useRouter } from "next/navigation";

export type SearchHistoryProps = {
    searches: ActionsHistoryService.VinAnalysisResult | undefined;
    isLoading: boolean;
}

export const SearchHistory: FC<SearchHistoryProps> = ({ searches, isLoading }) => {
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

    return (
        <section className={styles.searchHistory}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Report History</h2>
                    <p>Your latest vehicle history requests</p>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>VIN/Plate</th>
                                <th>Mileage</th>
                                <th>Value</th>
                                <th>Status</th>
                                <th>Reports</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.entries(searches).map(([vin, data]) => {
                                    return <tr key={vin}>
                                        <td>{new Date(data.registeredAt).toLocaleDateString('en-US')}</td>
                                        <td>
                                            <div className={styles.vehicleName}>{data.baseInfo?.ModelYear} {data.baseInfo?.Make} {data.baseInfo?.Model}</div>
                                            <div className={styles.vehicleTrim}>{data.baseInfo?.Trim}</div>
                                        </td>
                                        <td className={styles.vin}>{vin}</td>
                                        <td>{data.mileage ? `${data.mileage}k` : 'Mileage was not set'}</td>
                                        <td className={styles.valueGreen}>{data.marketValue?.market_prices.average ? "$" + `${data.marketValue?.market_prices.average}` : 'Market value was not requested'}</td>
                                        <td>
                                            <span className={data.salvage ? styles.withSalvage : styles.noSalvage}>{data.salvage ? 'Salvage was found' : 'No salvage'}</span>
                                        </td>
                                        <td>
                                            <div>
                                                {data.carfax ? <button className={styles.viewBtn} onClick={() => {
                                                    if (data.carfax?.type === "html") {
                                                        sessionStorage.setItem("report", data.carfax?.data);
                                                        router.push("/report");
                                                    } else {
                                                        throw new Error("Unexpected response type");
                                                    }
                                                }}>Carfax</button> : undefined}
                                            </div>
                                            <div>
                                                {data.autocheck ? <button className={styles.viewBtn} onClick={() => {
                                                    if (data.autocheck?.type === "html") {
                                                        sessionStorage.setItem("report", data.autocheck?.data);
                                                        router.push("/report");
                                                    } else {
                                                        throw new Error("Unexpected response type");
                                                    }
                                                }}>Autocheck</button> : undefined}
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {/* 
                 <div className={styles.footer}>
                    <div className={styles.resultsInfo}>Showing 3 of 15 results</div>
                    <div className={styles.pagination}>
                        <button>Previous</button>
                        <button>Next</button>
                    </div>
                </div> */}
            </div>
        </section>
    );
}
