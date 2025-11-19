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
import {useMarketCheckPriceQuery, useMileagePriceQuery} from "@/client/hooks";

// ====== БАЗОВЫЕ КОНСТАНТЫ (можно подстраивать) ======
const AVERAGE_MILEAGE = 155000; // базовый средний пробег (можешь менять под свои данные)

// штраф за милю (по калибровке с MMR, ~0.055–0.057 $/миля)
const MILEAGE_PER_MILE = 0.056;

// наценка для розницы (Manheim Retail ~ +35–42% к wholesale)
const RETAIL_FACTOR = 1.38;

// влияние "build options"
const BUILD_OPTIONS_FACTOR = 0.02;

// региональные поправки
const REGION_FACTORS: Record<string, number> = {
    national: 0,
    south: -0.02,
    midwest: -0.03,
    east: 0.01,
    west: 0.03,
    texas: 0.02,
};

// поправки по grade (приблизительно как в MMR)
const GRADE_FACTORS: Record<string, number> = {
    "1.0": -0.15,
    "2.0": -0.08,
    "3.0": 0,
    "4.0": 0.07,
    "5.0": 0.12,
};

// поправки по спросу
const DEMAND_FACTORS: Record<string, number> = {
    low: -0.05,
    normal: 0,
    high: 0.07,
};

// калиброванные коэффициенты для типов авто (под твои 3 VIN’а)
const SEGMENT_RATIOS: Record<string, number> = {
    // 3KPF24AD6KE090701 (Kia Forte): 16,795 * 0.385 ≈ 6,475 (MMR BASE)
    economy: 0.385,
    // 1FTEW1EG5HFB21471 (F150): 29,999 * 0.677 ≈ 20,300 (MMR BASE)
    standard: 0.677,
    // WP1AB2A22ELA55998 (Cayenne): 15,999 * 0.611 ≈ 9,775 (MMR BASE)
    luxury: 0.611,
};

const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

// тип для price-статистики (Format №2)
type PriceStats = {
    min: number;
    max: number;
    count: number;
    mean?: number;
    median?: number;
    percentiles?: Record<string, number>;
};

// вычисляем Base MMR из блока "price" + выбранный тип авто
function calculateBaseMmrFromPrice(
    price: PriceStats | undefined,
    segment: string
): number {
    if (!price) return 0;

    const median = price.median ?? price.mean ?? 0;
    if (!median) return 0;

    const ratio = SEGMENT_RATIOS[segment] ?? SEGMENT_RATIOS.standard;

    return Math.round(median * ratio);
}

export const Valuation: FC<{ vin: string | null }> = ({ vin }) => {
    const [odo, setOdo] = useState<number | string>(AVERAGE_MILEAGE);
    const [region, setRegion] = useState("national");
    const [grade, setGrade] = useState<string>("1.0");
    const [demand, setDemand] = useState("normal");
    const [includeBuildOptions, setIncludeBuildOptions] = useState(true);
    const [segment, setSegment] = useState<string>("standard");

    const { data: mileageData } = useMarketCheckPriceQuery(vin, odo);
    const priceStats: PriceStats | undefined = mileageData?.comparables.stats.price;

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
        // 1️⃣ Base MMR, восстановленный из Format №2
        const baseMmr = calculateBaseMmrFromPrice(priceStats, segment);

        // 2️⃣ корректировка по пробегу
        const odoValue = typeof odo === "number" ? odo : AVERAGE_MILEAGE;
        const milesDiff = odoValue - AVERAGE_MILEAGE;
        const mileageAdj = -(milesDiff * MILEAGE_PER_MILE);

        // 3️⃣ регион
        const regionFactor = REGION_FACTORS[region] ?? 0;
        const regionAdj = baseMmr * regionFactor;

        // 4️⃣ grade
        const gradeFactor = GRADE_FACTORS[grade] ?? 0;
        const gradeAdj = baseMmr * gradeFactor;

        // 5️⃣ спрос
        const demandFactor = DEMAND_FACTORS[demand] ?? 0;
        const demandAdj = baseMmr * demandFactor;

        // 6️⃣ build options
        const buildAdj = includeBuildOptions ? baseMmr * BUILD_OPTIONS_FACTOR : 0;

        // 7️⃣ итоговый Adjusted MMR
        const adjustedRaw =
            baseMmr + mileageAdj + regionAdj + gradeAdj + demandAdj + buildAdj;
        const adjustedMmr = Math.round(adjustedRaw);

        // 8️⃣ диапазон (примерно в стиле MMR)
        const adjustedRangeLow = Math.round(adjustedMmr * 0.85);
        const adjustedRangeHigh = Math.round(adjustedMmr * 1.15);

        // 9️⃣ розничная цена
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
    }, [
        priceStats,
        segment,
        odo,
        region,
        grade,
        demand,
        includeBuildOptions,
    ]);

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
                                    <Text size="xs" c="dimmed">
                                        BASE MMR
                                    </Text>
                                    <Text fw={700} size="lg">
                                        {formatCurrency(baseMmr)}
                                    </Text>
                                </Stack>

                                <Stack>
                                    <Text size="xs" c="dimmed">
                                        Est. Avg Odo (mi)
                                    </Text>
                                    <Text fw={600}>{AVERAGE_MILEAGE.toLocaleString()}</Text>
                                </Stack>

                                <Stack>
                                    <Text size="xs" c="dimmed">
                                        Avg Grade
                                    </Text>
                                    <Text fw={600}>{grade}</Text>
                                </Stack>
                            </SimpleGrid>
                        </Card>

                        {/* Adjusted MMR */}
                        <Card withBorder padding="md" radius="md" mt="sm">
                            <Stack gap="xs">
                                <Text size="xs" c="dimmed">
                                    Adj MMR Range
                                </Text>
                                <Text fw={600}>
                                    {formatCurrency(adjustedRangeLow)} –{" "}
                                    {formatCurrency(adjustedRangeHigh)}
                                </Text>

                                <Divider my="sm" />

                                <Text size="xs" c="dimmed">
                                    ADJUSTED MMR
                                </Text>
                                <Title order={2}>{formatCurrency(adjustedMmr)}</Title>

                                <Divider my="sm" />

                                <Text size="xs" c="dimmed">
                                    Estimated Retail Value
                                </Text>
                                <Text fw={600}>{formatCurrency(retail)}</Text>
                                <Text size="sm" c="dimmed">
                                    Typical Range: {formatCurrency(retailLow)} –{" "}
                                    {formatCurrency(retailHigh)}
                                </Text>
                            </Stack>
                        </Card>

                        {/* Adjustments details */}
                        <Box mt="sm">
                            <Text size="xs" c="dimmed" mb={4}>
                                Adjustments detail (vs Base MMR)
                            </Text>
                            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                                <Text size="xs">Mileage: {formatCurrency(mileageAdj)}</Text>
                                <Text size="xs">Region: {formatCurrency(regionAdj)}</Text>
                                <Text size="xs">Grade: {formatCurrency(gradeAdj)}</Text>
                                <Text size="xs">Demand: {formatCurrency(demandAdj)}</Text>
                                <Text size="xs">
                                    Build options: {formatCurrency(buildAdj)}
                                </Text>
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
                            label="Vehicle segment"
                            value={segment}
                            onChange={(val) => setSegment(val || "standard")}
                            data={[
                                { value: "economy", label: "Economy (Kia / Corolla / Civic)" },
                                {
                                    value: "standard",
                                    label: "Standard / Truck / Mainstream (F-150, Silverado)",
                                },
                                {
                                    value: "luxury",
                                    label: "Luxury / Premium (Porsche, BMW, Mercedes)",
                                },
                            ]}
                        />

                        <Select
                            label="Region"
                            value={region}
                            onChange={(val) => setRegion(val || "national")}
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
                            onChange={(val) => setGrade(val || "3.0")}
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
                            onChange={(val) => setDemand(val || "normal")}
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
                                onChange={(e) =>
                                    setIncludeBuildOptions(e.currentTarget.checked)
                                }
                                label={includeBuildOptions ? "YES" : "NO"}
                            />
                        </Group>
                    </Stack>
                </Card>
            </Stack>
        </Container>
    );
};
