'use client'

import styles from "./SampleResults.module.css";
import React, { FC, useState } from "react";
import { PricesResultDTO } from "@/app/api/vin/market-value/models";
import { MileageButtons } from "@/components/SearchSection/MileageButtons/MileageButtons";
import { useMileagePriceQuery } from "@/hooks";
import { DistributionChart } from "@/components/DistributionChart/DistributionChart";
import { CachedData_GET_Response, CacheStatus } from "@/app/api/vin/cached-data/models";
import { ReportsProvider } from "@/components/ReportsProvider/ReportsProvider";
import { CarInfo } from "@/components/SearchSection/CarInfo/CarInfo";

export interface ISampleResults {
    vin: string,
    cacheStatus?: CacheStatus,
    cachedPricesInfo?: CachedData_GET_Response['marketAnalysis'],
    baseInfo?: CachedData_GET_Response['baseInfo']
}

const formatNumber = (num: number) => {
    const intPart = Math.floor(num);
    return intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const SampleResults: FC<ISampleResults> = ({ vin, cacheStatus, cachedPricesInfo, baseInfo }) => {

    const [averageMileage, setAverageMileage] = useState<number>(25);
    const { data: refetchedMileageData, isLoading: isLoadingMileage } = useMileagePriceQuery(vin, averageMileage * 1000, cacheStatus);

    const mileageData = cachedPricesInfo?.find(x => x.mileage === averageMileage * 1000) || refetchedMileageData
    return (
        <section className={styles.sampleResults}>
            <div className={styles.card}>
                <div className={styles.filters}>
                    <MileageButtons onMileageChange={setAverageMileage} averageMileage={averageMileage} />
                </div>
                <div className={styles.grid}>
                    <div className={styles.valuationInfo}>
                        <div className={styles.infoCard}>
                            <h3>Market Valuation</h3>
                            {isLoadingMileage ? (
                                <div className={styles.valuationContent}>
                                    <div className={styles.estimatedValue}>
                                        <div className={styles.skeleton} />
                                        <div className={styles.skeletonText}>Estimated Market Value</div>
                                    </div>
                                    <div className={styles.rangeGrid}>
                                        <div className={styles.rangeBox}>
                                            <div className={styles.skeleton} />
                                            <div className={styles.skeletonText}>Low</div>
                                        </div>
                                        <div className={styles.rangeBox}>
                                            <div className={styles.skeleton} />
                                            <div className={styles.skeletonText}>High</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.valuationContent}>
                                    <div className={styles.estimatedValue}>
                                        <div>${formatNumber(mileageData?.market_prices?.average || 0)}</div>
                                        <div>Estimated Market Value</div>
                                    </div>
                                    <div className={styles.rangeGrid}>
                                        <div className={styles.rangeBox}>
                                            <div>${formatNumber(mileageData?.market_prices?.below || 0)}</div>
                                            <div>Low</div>
                                        </div>
                                        <div className={styles.rangeBox}>
                                            <div>${formatNumber(mileageData?.market_prices?.above || 0)}</div>
                                            <div>High</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DistributionChart distribution={mileageData?.market_prices?.distribution ?? []} />
                    </div>
                    <ReportsProvider vin={vin} />
                </div>
                <CarInfo {...baseInfo} />
            </div>
        </section>
    );
}

