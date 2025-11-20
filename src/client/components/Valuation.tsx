"use client";

import React, { FC, useMemo, useState, useEffect } from "react";
import {
    Container,
    NumberInput,
    Select,
    Switch,
    Text,
    Button,
} from "@mantine/core";

import {
    FaChartLine,
    FaArrowUp,
    FaArrowDown,
    FaGauge,
    FaClockRotateLeft,
    FaChevronUp,
    FaChevronDown,
    FaStar,
    FaTriangleExclamation,
    FaFileLines,
    FaCalculator,
} from "react-icons/fa6";

import { useMarketCheckPriceQuery } from "@/client/hooks";
import classes from "./Valuation.module.css";

/* -------------------------------------------------
    TYPE DEFINITIONS
-------------------------------------------------- */

type Region = "national" | "south" | "midwest" | "east" | "west" | "texas";
type Grade = "1.0" | "2.0" | "3.0" | "4.0" | "5.0";
type Demand = "low" | "normal" | "high";
type Segment = "economy" | "standard" | "luxury" | "suv";

interface HistoryRecord {
    type: string;
    date: string;
}

interface MileageAdjustment {
    adjustment: number;
    average: number;
    input: number;
}

interface HistoryAdjustment {
    records: HistoryRecord[];
    adjustment: number;
}

interface Adjustments {
    mileage: MileageAdjustment;
    history: HistoryAdjustment;
    condition: { input: number | null; adjustment: number };
    known_damage: { input: number | null; adjustment: number };
}

interface PriceDistribution {
    group: { count: number; min: number; max: number };
}

interface PriceData {
    above: number;
    average: number;
    below: number;
    distribution: PriceDistribution[];
}

interface VehicleData {
    vin: string;
    vehicle: string;
    prices: PriceData;
    adjustments: Adjustments;
}

/* -------------------------------------------------
    CONSTANTS (STRICTLY TYPED)
-------------------------------------------------- */

const AVERAGE_MILEAGE = 105000;
const RETAIL_FACTOR = 1.38;
const BUILD_OPTIONS_FACTOR = 0.02;

const REGION_FACTORS: Record<string, number> = {
    national: 0,
    south: -0.02,
    midwest: -0.03,
    east: 0.01,
    west: 0.03,
    texas: 0.02,
};

const GRADE_FACTORS: Record<string, number> = {
    "1.0": -0.15,
    "2.0": -0.08,
    "3.0": 0,
    "4.0": 0.07,
    "5.0": 0.12,
};

const DEMAND_FACTORS: Record<string, number> = {
    low: -0.05,
    normal: 0,
    high: 0.07,
};

const SEGMENT_RATIOS: Record<Segment, number> = {
    economy: 0.62,
    standard: 1.08,
    luxury: 0.64,
    suv: 0.78,
};

const MILEAGE_FACTORS: Record<Segment, number> = {
    economy: 1.35,
    standard: 1.05,
    luxury: 1.55,
    suv: 0.67,
};

const SEGMENT_DETECT_MAP: { segment: Segment; keywords: string[] }[] = [
    { segment: "economy", keywords: ["kia", "corolla", "civic", "elantra", "sentra", "accent"] },
    { segment: "standard", keywords: ["f-150", "silverado", "ram", "tacoma", "frontier", "sierra"] },
    { segment: "luxury", keywords: ["porsche", "bmw", "mercedes", "audi", "lexus"] },
    { segment: "suv", keywords: ["yukon", "tahoe", "suburban", "escalade", "explorer"] },
];

/* -------------------------------------------------
    HELPERS
-------------------------------------------------- */

function detectVehicleSegment(vehicle: string | undefined): Segment {
    if (!vehicle) return "standard";
    const v = vehicle.toLowerCase();
    for (const r of SEGMENT_DETECT_MAP) {
        if (r.keywords.some((k) => v.includes(k))) return r.segment;
    }
    return "standard";
}

function formatCurrency(value: number): string {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

/* -------------------------------------------------
    MAIN COMPONENT
-------------------------------------------------- */

export const Valuation: FC<{ vin: string | null }> = ({ vin }) => {
    const [odo, setOdo] = useState<number>(AVERAGE_MILEAGE);
    const [region, setRegion] = useState<string>("national");
    const [grade, setGrade] = useState<string>("3.0");
    const [demand, setDemand] = useState<string>("normal");
    const [includeBuildOptions, setIncludeBuildOptions] = useState<boolean>(true);

    const { data } = useMarketCheckPriceQuery(vin, odo);
    const mileageData: VehicleData | undefined = data?.data;

    const [segment, setSegment] = useState<Segment>("standard");
    const [historyOpened, setHistoryOpened] = useState<boolean>(true);

    useEffect(() => {
        if (mileageData?.vehicle) {
            setSegment(detectVehicleSegment(mileageData.vehicle));
        }
    }, [mileageData]);

    /* ---------------------- CALCULATIONS ---------------------- */

    const {
        baseMmr,
        adjustedMmr,
        retail,
        mileageAdj,
        regionAdj,
        gradeAdj,
        demandAdj,
        buildAdj,
        lowVal,
        highVal,
    } = useMemo(() => {
        if (!mileageData)
            return {
                baseMmr: 0,
                adjustedMmr: 0,
                retail: 0,
                lowVal: 0,
                highVal: 0,
                mileageAdj: 0,
                regionAdj: 0,
                gradeAdj: 0,
                demandAdj: 0,
                buildAdj: 0,
            };

        const avg = mileageData.prices.average;
        const apiMileageAdj = mileageData.adjustments.mileage.adjustment;

        const segRatio = SEGMENT_RATIOS[segment];
        const mileageFactor = MILEAGE_FACTORS[segment];

        const baseMmr = Math.round(avg * segRatio);
        const mileageAdj = Math.round(apiMileageAdj * mileageFactor);
        const regionAdj = Math.round(baseMmr * REGION_FACTORS[region]);
        const gradeAdj = Math.round(baseMmr * GRADE_FACTORS[grade]);
        const demandAdj = Math.round(baseMmr * DEMAND_FACTORS[demand]);
        const buildAdj = includeBuildOptions ? Math.round(baseMmr * BUILD_OPTIONS_FACTOR) : 0;

        const adjustedMmr = Math.round(
            baseMmr + mileageAdj + regionAdj + gradeAdj + demandAdj + buildAdj
        );

        const retail = Math.round(adjustedMmr * RETAIL_FACTOR);

        const lowVal = mileageData.prices.below;
        const highVal = mileageData.prices.above;

        return {
            baseMmr,
            adjustedMmr,
            retail,
            mileageAdj,
            regionAdj,
            gradeAdj,
            demandAdj,
            buildAdj,
            lowVal,
            highVal,
        };
    }, [mileageData, odo, region, grade, demand, includeBuildOptions, segment]);

    if (!mileageData) return null;

    const history = mileageData.adjustments.history.records;
    const historyAdj = mileageData.adjustments.history.adjustment;

    /* ---------------------- RENDER ---------------------- */

    return (
        <Container size="sm" className={classes.wrapper}>
            <div className={classes.card}>

                {/* ADJUSTED VALUE */}
                <div className={classes.centerBlock}>
                    <p className={classes.label}>Adjusted Market Value</p>
                    <div className={classes.adjustedValue}>{formatCurrency(adjustedMmr)}</div>
                    {/* BADGES */}
                    <div className={classes.badgeRow}>
                        <div className={`${classes.badge} ${classes.badgeFio}`}>
                            <FaChartLine />
                            <span>Avg: {formatCurrency(mileageData.prices.average)}</span>
                        </div>

                        <div className={`${classes.badge} ${classes.badgeFio}`}>
                            <FaArrowUp />
                            <span>High: {formatCurrency(highVal)}</span>
                        </div>

                        <div className={`${classes.badge} ${classes.badgeYellow}`}>
                            <FaArrowDown />
                            <span>Low: {formatCurrency(lowVal)}</span>
                        </div>
                    </div>

                    <div className={classes.badgeRow}>
                        <div className={`${classes.badge} ${classes.badgeYellow}`}>
                            <FaGauge />
                            <span>Mileage: {formatCurrency(mileageAdj)}</span>
                        </div>

                        <div
                            className={`${classes.badge} ${classes.badgePrimary} ${classes.clickable}`}
                            onClick={() => setHistoryOpened((p) => !p)}
                        >
                            <FaClockRotateLeft />
                            <span>History: {formatCurrency(historyAdj)}</span>
                            {historyOpened ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        <div className={`${classes.badge} ${classes.badgeFio}`}>
                            <FaStar />
                            <span>Condition: {formatCurrency(gradeAdj)}</span>
                        </div>

                        <div className={`${classes.badge} ${classes.badgePrimary}`}>
                            <FaTriangleExclamation />
                            <span>Damage: {formatCurrency(buildAdj)}</span>
                        </div>
                    </div>
                </div>

                {/* HISTORY */}
                {historyOpened && (
                    <div className={classes.historySection}>
                        <p className={classes.historyTitle}>
                            <FaFileLines className={classes.historyIcon} /> History Report Details
                        </p>

                        <div className={classes.historyGrid}>
                            {history.map((h, i) => (
                                <div key={i} className={classes.historyItem}>
                                    <div className={classes.historyRow}>
                                        <span className={classes.historyType}>{h.type.toUpperCase()}</span>
                                        <span className={classes.historyAdj}>
                      {formatCurrency(historyAdj / history.length)}
                    </span>
                                    </div>
                                    <p className={classes.historyDate}>{h.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SELECTS */}
                <div className={classes.inputsInline}>
                    <Select
                        label="Region"
                        value={region}
                        onChange={(v) => setRegion(v || "national")}
                        data={[
                            { value: "national", label: "National" },
                            { value: "texas", label: "Texas" },
                            { value: "south", label: "South" },
                            { value: "midwest", label: "Midwest" },
                            { value: "east", label: "East" },
                            { value: "west", label: "West" },
                        ]}
                        className={classes.smallSelect}
                    />

                    <Select
                        label="Grade"
                        value={grade}
                        onChange={(v) => setGrade(v || "3.0")}
                        data={[
                            { value: "1.0", label: "1.0 Rough" },
                            { value: "2.0", label: "2.0 Below Avg" },
                            { value: "3.0", label: "3.0 Average" },
                            { value: "4.0", label: "4.0 Above Avg" },
                            { value: "5.0", label: "5.0 Extra Clean" },
                        ]}
                        className={classes.smallSelect}
                    />

                    <Select
                        label="Demand"
                        value={demand}
                        onChange={(v) => setDemand(v || "normal")}
                        data={[
                            { value: "low", label: "Low" },
                            { value: "normal", label: "Normal" },
                            { value: "high", label: "High" },
                        ]}
                        className={classes.smallSelect}
                    />

                    <div className={classes.switchBlock}>
                        <Text>Build Options</Text>
                        <Switch
                            checked={includeBuildOptions}
                            onChange={(e) => setIncludeBuildOptions(e.currentTarget.checked)}
                        />
                    </div>
                </div>
            </div>

            {/* NOTE */}
            <div className={classes.noteCard}>
                <p className={classes.noteText}>
                    <strong>Note:</strong> Adjustments are based on market data, history, grade and mileage.
                </p>
            </div>
        </Container>
    );
};
