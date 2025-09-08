"use client";
import React, { FC } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList, Label,
} from "recharts";
import styles from "./DistributionChart.module.css";

type DistributionData = {
    group: {
        count: number;
        min: number;
        max: number;
    };
};

interface DistributionChartProps {
    distribution: DistributionData[];
}

export const DistributionChart: FC<DistributionChartProps> = ({ distribution }) => {
    const data = distribution?.map((item) => ({
        name: `${item?.group?.min}-${item.group.max}`,
        count: item?.group?.count,
        label: `$${item?.group?.max}`,
    }));

    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.title}>Active Listings Prices</h3>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 20, left: 5, bottom: 40 }}>
                        <CartesianGrid  vertical={false} horizontal={false} strokeDasharray="3 3" stroke="#3b82f6" />
                        <XAxis dataKey="name" tick={false}>
                            <Label value="Price Range ($)" offset={-10} position="insideBottom" />
                        </XAxis>
                        <YAxis tick={{ fontSize: 10 }}>
                            <Label
                                value="Number of Cars"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: "middle" }}
                            />
                        </YAxis>
                        <Tooltip
                            formatter={(value) => [`${value} cars`]}
                            labelFormatter={(label) => `$${label}`}
                        />
                        <Bar dataKey="count" fill="#4a90e2" radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="label" position="top" fontSize={10} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
};
