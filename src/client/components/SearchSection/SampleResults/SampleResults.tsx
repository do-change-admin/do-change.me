'use client';

import { Badge, Group, Paper, Skeleton, Slider, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { type FC, useEffect, useState } from 'react';
import type { VehicleBaseInfoDTO } from '@/app/api/vin/base-info/models';
import { DistributionChart } from '@/client/components/DistributionChart/DistributionChart';
import { ReportsProvider } from '@/client/components/ReportsProvider/ReportsProvider';
import { CarInfo } from '@/client/components/SearchSection/CarInfo/CarInfo';
import { formatDate, Odometer } from '@/client/components/SearchSection/Odometer/Odometer';
import { useMileagePriceQuery, useOdometer } from '@/client/hooks';
import { useVINAnalysisState } from '@/client/states/vin-analysis.state';
import styles from './SampleResults.module.css';

export interface ISampleResults {
    reportsLeft: number;
    baseInfo: VehicleBaseInfoDTO | undefined;
    openSubscription?: Function;
}

const formatNumber = (num: number) => {
    const intPart = Math.floor(num);
    return intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const SampleResults: FC<ISampleResults> = ({ baseInfo, openSubscription }) => {
    const requestVIN = useVINAnalysisState((x) => x.requestVIN);

    const { data: odometerData, isLoading, isFetched } = useOdometer(requestVIN);
    const lastMileageRecord = odometerData?.at()?.miles;
    const [miles, setMiles] = useState<number>(0);
    const [debouncedMiles] = useDebouncedValue(miles, 1500);
    const { data: mileageData, isLoading: isLoadingMileage } = useMileagePriceQuery(requestVIN, debouncedMiles);

    useEffect(() => {
        if (!!lastMileageRecord && !isLoadingMileage && !miles) {
            setMiles(lastMileageRecord);
            return;
        }
    }, [lastMileageRecord, isLoadingMileage, isFetched]);

    return (
        <section className={styles.sampleResults}>
            <div className={styles.card}>
                {/*<div className={styles.grid}>*/}
                {/*    <div className={styles.valuationInfo}>*/}
                {/*        <div className={styles.infoCard}>*/}
                {/*            /!*<h3>Market Valuation</h3>*!/*/}
                {/*            {isLoading ? (*/}
                {/*                <Skeleton h={50} mb="md" radius="lg" w="100%" />*/}
                {/*            ) : (*/}
                {/*                <Paper mb="md" p="xs" radius="lg">*/}
                {/*                    <Group mb="xs">*/}
                {/*                        <Text fw={500} size="sm">*/}
                {/*                            {miles?.toLocaleString()} miles*/}
                {/*                        </Text>*/}
                {/*                        {miles === lastMileageRecord && (*/}
                {/*                            <>*/}
                {/*                                <Badge c="gray" size="xs" variant="light">*/}
                {/*                                    Latest Record*/}
                {/*                                </Badge>*/}
                {/*                                <Badge c="gray" size="xs" variant="light">*/}
                {/*                                    {formatDate(odometerData[0].last_seen_at_date)}*/}
                {/*                                </Badge>*/}
                {/*                            </>*/}
                {/*                        )}*/}
                {/*                    </Group>*/}
                {/*                    <Slider*/}
                {/*                        label={(val) => val.toLocaleString()}*/}
                {/*                        max={300000}*/}
                {/*                        min={0}*/}
                {/*                        onChange={setMiles}*/}
                {/*                        step={1000}*/}
                {/*                        styles={{*/}
                {/*                            label: { fontSize: 12 }*/}
                {/*                        }}*/}
                {/*                        value={miles}*/}
                {/*                    />*/}
                {/*                </Paper>*/}
                {/*            )}*/}
                {/*            {isLoadingMileage || isLoading ? (*/}
                {/*                <div className={styles.valuationContent}>*/}
                {/*                    <div className={styles.estimatedValue}>*/}
                {/*                        <div className={styles.skeleton} />*/}
                {/*                        <div className={styles.skeletonText}>Estimated Market Value</div>*/}
                {/*                    </div>*/}
                {/*                    <div className={styles.rangeGrid}>*/}
                {/*                        <div className={styles.rangeBox}>*/}
                {/*                            <div className={styles.skeleton} />*/}
                {/*                            <div className={styles.skeletonText}>Low</div>*/}
                {/*                        </div>*/}
                {/*                        <div className={styles.rangeBox}>*/}
                {/*                            <div className={styles.skeleton} />*/}
                {/*                            <div className={styles.skeletonText}>High</div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            ) : (*/}
                {/*                <div className={styles.valuationContent}>*/}
                {/*                    <div className={styles.estimatedValue}>*/}
                {/*                        <div>${formatNumber(mileageData?.market_prices?.average || 0)}</div>*/}
                {/*                        <div>Estimated Market Value</div>*/}
                {/*                    </div>*/}
                {/*                    <div className={styles.rangeGrid}>*/}
                {/*                        <div className={styles.rangeBox}>*/}
                {/*                            <div>${formatNumber(mileageData?.market_prices?.below || 0)}</div>*/}
                {/*                            <div>Low</div>*/}
                {/*                        </div>*/}
                {/*                        <div className={styles.rangeBox}>*/}
                {/*                            <div>${formatNumber(mileageData?.market_prices?.above || 0)}</div>*/}
                {/*                            <div>High</div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <DistributionChart distribution={mileageData?.market_prices?.distribution ?? []} />*/}
                {/*</div>*/}
                <Odometer records={odometerData} />
                {baseInfo ? <CarInfo {...baseInfo} /> : <>Loading...</>}
                <ReportsProvider openSubscription={openSubscription} />
            </div>
        </section>
    );
};
