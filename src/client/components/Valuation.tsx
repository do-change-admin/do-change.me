"use client";

import React, { FC, useMemo, useState } from "react";
import {
    Box,
    Card,
    Container,
    Divider,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    Title,
} from "@mantine/core";
import { useMileagePriceQuery } from "@/client/hooks";

// === MMR CONSTANTS ===
const AVERAGE_MILEAGE = 170000;

// Mileage penalty/bonus exactly like Manheim (~$0.055 per mile)
const MILEAGE_PER_MILE = 0.055;

// Retail markup (Manheim uses ~35–42%)
const RETAIL_FACTOR = 1.38;

// Build options effect
const BUILD_OPTIONS = 0.02;

// Region adjustments
const REGION_FACTORS: Record<string, number> = {
    national: 0,
    south: -0.02,
    midwest: -0.03,
    east: 0.01,
    west: 0.03,
    texas: 0.02,
};

// Grade multipliers (approximate Manheim logic)
const GRADE_FACTORS: Record<string, number> = {
    "1.0": -0.15,
    "2.0": -0.08,
    "3.0": 0,
    "4.0": 0.07,
    "5.0": 0.12,
};

// Demand shifts (optional)
const DEMAND_FACTORS: Record<string, number> = {
    low: -0.05,
    normal: 0,
    high: 0.07,
};

const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });


// =========================
// ⭐ REAL MMR BASE FORMULA ⭐
// Weighted distribution like Manheim
// =========================
function getWeightedMMRBase(distribution: any[]): number {
    if (!distribution || distribution.length === 0) return 0;

    let totalWeighted = 0;
    let totalCount = 0;

    for (const item of distribution) {
        const { count, min, max } = item.group;
        const mid = (min + max) / 2;

        totalWeighted += mid * count;
        totalCount += count;
    }

    return Math.round(totalWeighted / totalCount);
}



export const Valuation: FC<{ vin: string | null }> = ({ vin }) => {
    const [odo, setOdo] = useState<any>(AVERAGE_MILEAGE);
    const [region, setRegion] = useState("national");
    const [grade, setGrade] = useState<string>("3.0");
    const [demand, setDemand] = useState("normal");
    const [includeBuildOptions, setIncludeBuildOptions] = useState(true);

    const { data: mileageData } = useMileagePriceQuery(vin, odo);
    const prices = mileageData?.market_prices;


    // =========================
    // 🔵 FULL MMR CALCULATION
    // =========================
    const {
        baseMmr,
        adjustedMmr,
        adjustedRangeLow,
        adjustedRangeHigh,
        retail,
        retailLow,
        retailHigh,
        mileageAdj,
        regionAdj,
        gradeAdj,
        demandAdj,
        buildAdj,
    } = useMemo(() => {
        // 1️⃣ Base MMR from weighted distribution
        const baseMmr = prices?.average || 0

        // 2️⃣ Mileage adjustment (REAL Manheim style)
        const milesDiff = odo - AVERAGE_MILEAGE;
        const mileageAdj = -(milesDiff * MILEAGE_PER_MILE);

        // 3️⃣ Region
        const regionAdj = baseMmr * (REGION_FACTORS[region] || 0);

        // 4️⃣ Grade
        const gradeAdj = baseMmr * (GRADE_FACTORS[grade] || 0);

        // 5️⃣ Demand
        const demandAdj = baseMmr * (DEMAND_FACTORS[demand] || 0);

        // 6️⃣ Build options
        const buildAdj = includeBuildOptions ? baseMmr * BUILD_OPTIONS : 0;

        // 7️⃣ Adjusted MMR
        const adjusted = baseMmr + mileageAdj + regionAdj + gradeAdj + demandAdj + buildAdj;
        const adjustedMmr = Math.round(adjusted);

        // 8️⃣ Range like Manheim
        const adjustedRangeLow = Math.round(adjustedMmr * 0.85);
        const adjustedRangeHigh = Math.round(adjustedMmr * 1.15);

        // 9️⃣ Retail value
        const retail = Math.round(adjustedMmr * RETAIL_FACTOR);
        const retailLow = Math.round(retail * 0.9);
        const retailHigh = Math.round(retail * 1.12);

        return {
            baseMmr,
            adjustedMmr,
            adjustedRangeLow,
            adjustedRangeHigh,
            retail,
            retailLow,
            retailHigh,
            mileageAdj,
            regionAdj,
            gradeAdj,
            demandAdj,
            buildAdj,
        };
    }, [prices, odo, region, grade, demand, includeBuildOptions]);




    // =========================
    // 🔵 COMPONENT RENDER
    // =========================

    return (
        <Container size="sm" py="lg">
            <Stack gap="lg">

                {/* MAIN BLOCK */}
                <Card withBorder radius="md" shadow="sm" p="lg">
                    <Stack gap="sm">
                        <Title order={3}>VALUATION</Title>

                        {/* BASE */}
                        <Card withBorder padding="md" radius="md">
                            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                                <Stack>
                                    <Text size="xs" c="dimmed">BASE MMR</Text>
                                    <Text fw={700} size="lg">{formatCurrency(baseMmr)}</Text>
                                </Stack>

                                <Stack>
                                    <Text size="xs" c="dimmed">Est. Avg Odo (mi)</Text>
                                    <Text fw={600}>{AVERAGE_MILEAGE.toLocaleString()}</Text>
                                </Stack>

                                <Stack>
                                    <Text size="xs" c="dimmed">Avg Grade</Text>
                                    <Text fw={600}>{grade}</Text>
                                </Stack>
                            </SimpleGrid>
                        </Card>

                        {/* Adjusted MMR */}
                        <Card withBorder padding="md" radius="md" mt="sm">
                            <Stack gap="xs">
                                <Text size="xs" c="dimmed">Adj MMR Range</Text>
                                <Text fw={600}>
                                    {formatCurrency(adjustedRangeLow)} – {formatCurrency(adjustedRangeHigh)}
                                </Text>

                                <Divider my="sm" />

                                <Text size="xs" c="dimmed">ADJUSTED MMR</Text>
                                <Title order={2}>{formatCurrency(adjustedMmr)}</Title>

                                <Divider my="sm" />

                                <Text size="xs" c="dimmed">Estimated Retail Value</Text>
                                <Text fw={600}>{formatCurrency(retail)}</Text>
                                <Text size="sm" c="dimmed">
                                    Typical Range: {formatCurrency(retailLow)} – {formatCurrency(retailHigh)}
                                </Text>
                            </Stack>
                        </Card>

                        {/* Adjustments details */}
                        <Box mt="sm">
                            <Text size="xs" c="dimmed" mb={4}>Adjustments detail (vs Base MMR)</Text>
                            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                                <Text size="xs">Mileage: {formatCurrency(mileageAdj)}</Text>
                                <Text size="xs">Region: {formatCurrency(regionAdj)}</Text>
                                <Text size="xs">Grade: {formatCurrency(gradeAdj)}</Text>
                                <Text size="xs">Demand: {formatCurrency(demandAdj)}</Text>
                                <Text size="xs">Build options: {formatCurrency(buildAdj)}</Text>
                            </SimpleGrid>
                        </Box>

                    </Stack>
                </Card>




                {/* INPUTS */}
                <Card withBorder radius="md" shadow="sm" p="lg">
                    <Stack gap="md">
                        <Title order={4}>MMR Inputs</Title>

                        <NumberInput
                            label="Enter Odo"
                            value={odo}
                            onChange={setOdo}
                            step={1000}
                            thousandSeparator=","
                        />

                        <Select
                            label="Region"
                            value={region}
                            onChange={(val) => setRegion(val || "")}
                            data={[
                                { value: "national", label: "National" },
                                { value: "texas", label: "Texas" },
                                { value: "south", label: "South" },
                                { value: "midwest", label: "Midwest" },
                                { value: "east", label: "East" },
                                { value: "west", label: "West" },
                            ]}
                        />

                        <Select
                            label="AutoGrade"
                            value={grade}
                            onChange={(val) => setGrade(val || "")}
                            data={[
                                { value: "1.0", label: "1.0 – Rough" },
                                { value: "2.0", label: "2.0 – Below Average" },
                                { value: "3.0", label: "3.0 – Average" },
                                { value: "4.0", label: "4.0 – Above Average" },
                                { value: "5.0", label: "5.0 – Extra Clean" },
                            ]}
                        />

                        <Select
                            label="Demand"
                            value={demand}
                            onChange={(val) => setDemand(val || '')}
                            data={[
                                { value: "low", label: "Low demand" },
                                { value: "normal", label: "Normal" },
                                { value: "high", label: "High demand" },
                            ]}
                        />

                        <Group justify="space-between">
                            <Text size="sm">Include Build Options?</Text>
                            <Switch
                                checked={includeBuildOptions}
                                onChange={(e) => setIncludeBuildOptions(e.currentTarget.checked)}
                                label={includeBuildOptions ? "YES" : "NO"}
                            />
                        </Group>
                    </Stack>
                </Card>

            </Stack>
        </Container>
    );
};
