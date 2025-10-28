'use client'

import styles from "./SampleResults.module.css";
import React, { FC, useEffect, useState } from "react";
import { useMileagePriceQuery, useOdometer } from "@/client/hooks";
import { DistributionChart } from "@/client/components/DistributionChart/DistributionChart";
import { ReportsProvider } from "@/client/components/ReportsProvider/ReportsProvider";
import { CarInfo } from "@/client/components/SearchSection/CarInfo/CarInfo";
import { VehicleBaseInfoDTO } from "@/app/api/vin/base-info/models";
import { formatDate, Odometer } from "@/client/components/SearchSection/Odometer/Odometer";
import { Badge, Group, Paper, Skeleton, Slider, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useVINAnalysisState } from "@/client/states/vin-analysis.state";

export interface ISampleResults {
    reportsLeft: number,
    baseInfo: VehicleBaseInfoDTO | undefined
}

const formatNumber = (num: number) => {
    const intPart = Math.floor(num);
    return intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const SampleResults: FC<ISampleResults> = ({ baseInfo }) => {
    const requestVIN = useVINAnalysisState(x => x.requestVIN)

    const { data: odometerData, isLoading } = useOdometer(requestVIN);
    const lastMileageRecord = odometerData?.at()?.miles;
    const [miles, setMiles] = useState<number>(0)
    const [debouncedMiles] = useDebouncedValue(miles, 500)
    const { data: mileageData, isLoading: isLoadingMileage } = useMileagePriceQuery(requestVIN, debouncedMiles);

    useEffect(() => {
        if (!!lastMileageRecord) {
            setMiles(lastMileageRecord);
        }
    }, [lastMileageRecord])

    return (
        <section className={styles.sampleResults}>
            <div className={styles.card}>
                <div className={styles.grid}>
                    <div className={styles.valuationInfo}>
                        <div className={styles.infoCard}>
                            {/*<h3>Market Valuation</h3>*/}
                            {isLoading ? <Skeleton mb="md" h={50} w="100%" radius="lg" /> : (
                                <Paper p="xs" radius="lg" mb="md">
                                    <Group mb="xs">
                                        <Text size="sm" fw={500}>
                                            {miles?.toLocaleString()} miles
                                        </Text>
                                        {miles === lastMileageRecord && (
                                            <>
                                                <Badge variant="light" size="xs" c="gray">
                                                    Latest Record
                                                </Badge>
                                                <Badge variant="light" size="xs" c="gray">
                                                    {formatDate(odometerData[0].last_seen_at_date)}
                                                </Badge>
                                            </>

                                        )}
                                    </Group>
                                    <Slider
                                        value={miles}
                                        onChange={setMiles}
                                        min={0}
                                        max={300000}
                                        step={1000}
                                        label={(val) => val.toLocaleString()}
                                        styles={{
                                            label: { fontSize: 12 },
                                        }}
                                    />
                                </Paper>
                            )}
                            {(isLoadingMileage || isLoading) ? (
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
                    </div>
                    <DistributionChart distribution={mileageData?.market_prices?.distribution ?? []} />
                </div>
                <Odometer records={odometerData} />
                {baseInfo ? <CarInfo {...baseInfo} /> : <>Loading...</>}
                <ReportsProvider />
            </div>
        </section>
    );
}

