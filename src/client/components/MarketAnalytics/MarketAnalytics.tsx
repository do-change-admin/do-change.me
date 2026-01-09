"use client";
import React, {ChangeEvent, Dispatch, FC, InputHTMLAttributes, SetStateAction} from 'react';
import styles from './MarketAnalytics.module.css';
import {
    FaArrowTrendDown, FaArrowTrendUp, FaChartLine,
    FaStar
} from "react-icons/fa6";
import {VehicleHistoryCard} from "@/client/components";
import {IVehiclePriceResponse} from "@/client/components/MarketAnalytics/useVehiclePriceQuery";
import {Stack, Title, Text, Skeleton, Card} from "@mantine/core";

export interface MarketAnalyticsProps {
    data?: IVehiclePriceResponse;
    isLoading?: boolean;
    miles: string;
    setMiles: Dispatch<SetStateAction<string>> ;
}

export const MarketAnalytics:FC<MarketAnalyticsProps> = ({data, miles, setMiles, isLoading}) => {
    const recordType = data?.data?.adjustments?.history.records?.at(-1)?.type
    const status = recordType === "accident" ? "accident" : recordType === "salvage" ? "total" : "clean"

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setMiles(e.target.value);
    }

    if (!data?.data || !data?.data.period || !data?.data?.adjustments?.history) {
        return <Card p={20} mb="lg" radius="lg" color="red">There is no data available for this VIN number.</Card>
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                    <VehicleHistoryCard
                        title={data?.data.vehicle}
                        vin={data?.data.vin}
                        yearRange={`${data?.data?.period ? data?.data?.period[0] : "-"} - ${data?.data?.period ? data?.data?.period[1] : "-"}`}
                        status={status}
                        accidents={data?.data?.adjustments?.history.records}
                        lossStatus="repaired"
                        lastUpdated={data?.data.period[1]}
                    />
                <section className={styles.priceAdjustment}>
                    <Stack align="center" gap={4}>
                        <Title order={3} ta="center">
                            Price Adjustment
                        </Title>

                        <Text size="sm" c="dimmed">
                            Retail
                        </Text>
                    </Stack>
                    {isLoading ? (
                        <div className={styles.priceGrid}>
                            <div className={styles.priceCard}>
                                <FaArrowTrendDown color="#4ade80"/>
                                <p className={styles.priceCardTitle}><Skeleton h={20}/></p>
                                <p style={{fontSize: '0.65rem', opacity: 0.6}}>Below Market</p>
                            </div>
                            <div className={styles.priceCardActive}>
                                <FaChartLine color="#D4AF37"/>
                                <p className={styles.priceCardTitle}><Skeleton h={20}/></p>
                                <p style={{fontSize: '0.65rem', opacity: 0.8}}>Market Average</p>
                            </div>
                            <div className={styles.priceCard}>
                                <FaArrowTrendUp color="#f87171"/>
                                <p className={styles.priceCardTitle}><Skeleton h={20}/></p>
                                <p style={{fontSize: '0.65rem', opacity: 0.6}}>Above Market</p>
                            </div>
                        </div>
                    ):(
                        <div className={styles.priceGrid}>
                            <div className={styles.priceCard}>
                                <FaArrowTrendDown color="#4ade80"/>
                                <p className={styles.priceCardTitle}>${data?.data.prices.below.toFixed()}</p>
                                <p style={{fontSize: '0.65rem', opacity: 0.6}}>Below Market</p>
                            </div>
                            <div className={styles.priceCardActive}>
                                <FaChartLine color="#D4AF37"/>
                                <p className={styles.priceCardTitle}>${data?.data.prices.average.toFixed()}</p>
                                <p style={{fontSize: '0.65rem', opacity: 0.8}}>Market Average</p>
                            </div>
                            <div className={styles.priceCard}>
                                <FaArrowTrendUp color="#f87171"/>
                                <p className={styles.priceCardTitle}>${data?.data.prices.above.toFixed()}</p>
                                <p style={{fontSize: '0.65rem', opacity: 0.6}}>Above Market</p>
                            </div>
                        </div>
                    )}
                    <div className={`${styles.adjustmentRow} styles.mileageRow`}>
                        <div style={{flex: 1}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                                <div>
                                    <h4 style={{fontWeight: 600, color: '#ffffff'}}>Mileage</h4>
                                    <p style={{fontSize: '0.75rem', color: '#ffffff'}}>Based on {miles} miles</p>
                                </div>
                            </div>
                            {isLoading ? (
                                <Skeleton h={40}/>
                            ): (
                                <input onChange={handleChange} value={miles} type="number" placeholder="Enter mileage" className={styles.mileageInput}/>
                            )}

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};