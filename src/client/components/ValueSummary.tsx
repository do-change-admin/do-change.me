"use client";

import React, {useEffect, useMemo, useState} from "react";
import styles from "./ValueSummary.module.css";
import {
    FaChartLine,
    FaArrowDown,
    FaCalculator,
    FaRoad,
    FaCarBurst,
    FaTriangleExclamation,
    FaArrowTrendDown,
} from "react-icons/fa6";
import {FaHistory, FaMinusCircle} from "react-icons/fa";
import {Badge, Group, Input, Paper, Skeleton, Slider, Text} from "@mantine/core";
import {formatDate} from "@/client/components/SearchSection/Odometer/Odometer";
import {DistributionChart} from "@/client/components/DistributionChart/DistributionChart";
import {useVINAnalysisState} from "@/client/states/vin-analysis.state";
import {useMileagePriceQuery, useOdometer} from "@/client/hooks";
import {useDebouncedValue} from "@mantine/hooks";
import {formatNumber} from "@/client/components/SearchSection/SampleResults/SampleResults";

export const ValueSummaryOld = () => {
    const [mileage, setMileage] = useState(105000);

    const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const parsed = parseInt(raw || "0", 10);
        if (Number.isNaN(parsed)) {
            setMileage(0);
        } else {
            setMileage(parsed);
        }
    };

    const isHighMileage = mileage > 100000;

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.grid}>
                    {/* Left column */}
                    <div className={styles.column}>
                        <AdjustedValue />
                        <MileageSection
                            mileage={mileage}
                            onMileageChange={handleMileageChange}
                            isHighMileage={isHighMileage}
                        />
                    </div>

                    {/* Right column */}
                    <div className={styles.column}>
                        <VehicleHistory />
                        <TotalImpact />
                    </div>
                </div>
            </main>
        </div>
    );
};
export const ValueSummary = ({ adjustedValue, miles, onMileageChange }: { adjustedValue: string | null, miles: number, onMileageChange: any }) => {

    return (
        <div className={styles.grid}>
            <div className={styles.valuationInfo}>
                <div className={styles.infoCard}>
                 <div className={styles.valuationContent}>
                            {/* ------- Adjusted Price Section ------- */}
                            <div className={styles.estimatedValue}>
                                <div className={styles.adjustedValue}>${adjustedValue}</div>

                                <div className={styles.tag}>
                                    <FaChartLine className={styles.tagIcon} />
                                    <p className={styles.tagText}>Adjusted Market Value</p>
                                </div>

                                <div className={styles.adjustedBottomBox}>
                                    <div className={styles.adjustedBottomGrid}>
                                        <div className={styles.bottomItem}>
                      <span className={styles.bottomLabel}>
                       <div>Base</div>
                          <div className={styles.bottomValue}>$38,420</div>
                      </span>
                                        </div>
                                        <div className={styles.bottomItem}>
                      <span className={styles.bottomLabel}>
                          <div>Adj:{" "}</div>
                          <div className={styles.bottomValueRed}>-$15,738</div>
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ------- Mileage Input Section ------- */}
                            <div className={styles.rangeGrid}>
                                <MileageSection
                                    mileage={miles}
                                    isHighMileage={true}
                                    onMileageChange={onMileageChange}
                                />
                            </div>
                        </div>
                </div>
            </div>

            {/* <DistributionChart distribution={mileageData?.market_prices?.distribution ?? []} /> */}
            <VehicleHistory />
        </div>
    );
};

/** -------- SKELETON COMPONENT -------- */
const ValuationSkeleton = () => (
    <div className={styles.valuationContent}>
        <div className={styles.estimatedValue}>
            <div className={styles.skeleton} />
            <div className={styles.skeletonText}>Estimated Market Value</div>
        </div>
    </div>
);


// === Adjusted Market Value ===

const AdjustedValue = () => {
    return (
        <section className={styles.gradientBorder}>
            <div className={styles.glassCard}>
                <div className={styles.adjustedHeader}>
                    <div className={styles.tag}>
                        <FaChartLine className={styles.tagIcon} />
                        <p className={styles.tagText}>Adjusted Market Value</p>
                    </div>

                    <div className={styles.adjustedValueWrapper}>
                        <p className={styles.adjustedValue}>$22,682</p>
                        <div className={styles.discountBadge}>
                            <FaArrowDown className={styles.discountIcon} />
                            <span>41%</span>
                        </div>
                    </div>

                    <p className={styles.crossedBaseValue}>$38,420 base value</p>
                </div>

                <div className={styles.adjustedBottomBox}>
                    <div className={styles.adjustedBottomGrid}>
                        <div className={styles.bottomItem}>
                            <FaCalculator className={styles.bottomIconBlue} />
                            <span className={styles.bottomLabel}>
                Base: <span className={styles.bottomValue}>$38,420</span>
              </span>
                        </div>
                        <div className={styles.bottomItem}>
                            <FaMinusCircle className={styles.bottomIconRed} />
                            <span className={styles.bottomLabel}>
                Adj:{" "}
                                <span className={styles.bottomValueRed}>-$15,738</span>
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// === Mileage Section ===

interface MileageSectionProps {
    mileage: number;
    onMileageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isHighMileage: boolean;
}

const MileageSection = ({
                            mileage,
                            onMileageChange,
                            isHighMileage,
                        }: MileageSectionProps) => {
    return (
        <section >
            <div>
                <div className={styles.mileageHeader}>
                    <div className={styles.mileageBadge}>
                        <span className={styles.mileageBadgeText}>-$8,874</span>
                        <span className={styles.mileageChip}>High mileage </span>
                    </div>
                </div>

                <Input
                    rightSection={<span className={styles.mileageUnit}>mi</span>}
                    type="number"
                    autoFocus
                    value={mileage}
                    radius="xl"
                    size="lg"
                    onChange={onMileageChange}
                    className={
                        isHighMileage
                            ? `${styles.mileageInput} ${styles.mileageInputHigh}`
                            : styles.mileageInput
                    }
                />
            </div>
        </section>
    );
};

// === Vehicle History ===

const VehicleHistory = () => {
    return (
        <section className={styles.gradientBorder}>
            <div className={styles.glassCard}>
                <div className={styles.historyHeader}>
                    <div className={styles.historyTitle}>
                        <div>
                            <h3 className={styles.historyTitleText}>Vehicle History</h3>
                            <p className={styles.historySubtitle}>3 events recorded</p>
                        </div>
                    </div>
                    <div className={styles.historyBadge}>
                        <span className={styles.historyBadgeText}>-$6,864</span>
                    </div>
                </div>

                <div className={styles.historyList}>
                    <div className={styles.historyItemRed}>
                        <div className={styles.historyItemIconRed}>
                            <FaCarBurst className={styles.historyItemIconInner} />
                        </div>
                        <div className={styles.historyItemText}>
                            <p className={styles.historyItemTitle}>Accident Reported</p>
                            <p className={styles.historyItemDate}>May 19, 2012</p>
                        </div>
                    </div>

                    <div className={styles.historyItemRed}>
                        <div className={styles.historyItemIconRed}>
                            <FaCarBurst className={styles.historyItemIconInner} />
                        </div>
                        <div className={styles.historyItemText}>
                            <p className={styles.historyItemTitle}>Accident Reported</p>
                            <p className={styles.historyItemDate}>Jan 3, 2016</p>
                        </div>
                    </div>

                    <div className={styles.historyItemOrange}>
                        <div className={styles.historyItemIconOrange}>
                            <FaTriangleExclamation className={styles.historyItemIconInner} />
                        </div>
                        <div className={styles.historyItemText}>
                            <p className={styles.historyItemTitle}>Salvage Title</p>
                            <p className={styles.historyItemDate}>Sep 27, 2019</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// === Total Impact ===

const TotalImpact = () => {
    return (
        <section className={styles.totalImpactSection}>
            <div className={styles.totalImpactContent}>
                <div>
                    <p className={styles.totalImpactLabel}>Total Adjustment Impact</p>
                    <p className={styles.totalImpactValue}>-$15,738</p>
                    <p className={styles.totalImpactSub}>
                        41% below market value
                    </p>
                </div>
                <div className={styles.totalImpactIconWrapper}>
                    <div className={styles.totalImpactIconBox}>
                        <FaArrowTrendDown className={styles.totalImpactIcon} />
                    </div>
                    <div className={styles.totalImpactDot} />
                </div>
            </div>
        </section>
    );
};
