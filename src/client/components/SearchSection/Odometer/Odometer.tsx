'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Carousel } from '@mantine/carousel'
import styles from './Odometer.module.css'
import { RecordCard } from "@/client/components/SearchSection/RecordCard/RecordCard";
import { useMediaQuery } from "@mantine/hooks";

interface VehicleRecord {
    id: string
    city: string
    state: string
    seller_name: string
    first_seen_at_date: string
    last_seen_at_date: string
    miles: number
    price: number
}

interface OdometerProps {
    records: VehicleRecord[]
}

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateChart = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric' })
}

export const Odometer = ({ records }: OdometerProps) => {
    const sortedRecords: VehicleRecord[] = Array.isArray(records)
        ? [...records].sort(
            (a, b) =>
                new Date(a.last_seen_at_date).getTime() - new Date(b.last_seen_at_date).getTime()
        )
        : [];

    if (!sortedRecords.length) {
        return <p>No vehicle records available</p>;
    }

    const chartData = sortedRecords.map(record => ({
        ...record,
        first_seen_at_date: formatDateChart(record.first_seen_at_date),
        last_seen_at_date: formatDateChart(record.last_seen_at_date)
    }))

    const isMobile = useMediaQuery('(max-width: 700px)')
    const isTablet = useMediaQuery('(max-width: 1024px)')

    const slideSize = isMobile ? '100vw' : isTablet ? '50vw' : '33vw'

    return (
        <div className={styles.container}>
            {/* Charts Section */}
            <div className={styles.chartSection}>
                {/* Miles Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Odometer Records</h2>
                        <p className={styles.chartDescription}>Vehicle mileage tracking from first to last seen date</p>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="last_seen_at_date"
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    interval={0}
                                    angle={-30}
                                    textAnchor="end"
                                />
                                <YAxis />
                                <Tooltip formatter={(value: any) => value.toLocaleString()} />
                                <Line strokeWidth={3} type="monotone" dataKey="miles" stroke="rgba(59, 130, 246, 0.94)" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Price Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Price History</h2>
                        <p className={styles.chartDescription}>Vehicle price changes from first to last seen date</p>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="last_seen_at_date"
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    interval={0}
                                    angle={-30}
                                    textAnchor="end"
                                />
                                <YAxis />
                                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                                <Line strokeWidth={3} type="monotone" dataKey="price" stroke="hsl(43, 100%, 68%)" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <Carousel
                withIndicators
                slideGap="md"
                slideSize={slideSize}
                emblaOptions={{ align: 'start', loop: false }}
                className={styles.carousel}
            >
                {records
                    .filter(record => record.seller_name && record.city && record.state)
                    .map((record, index) => (
                        <Carousel.Slide key={record.id} h={270}>
                            <RecordCard record={record} isLatest={index === 0} />
                        </Carousel.Slide>
                    ))}
            </Carousel>
        </div>
    )
}
