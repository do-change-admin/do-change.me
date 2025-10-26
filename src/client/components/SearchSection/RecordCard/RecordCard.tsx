'use client'

import { motion } from 'framer-motion'
import { Card, Text, Group, Badge } from '@mantine/core'
import { FaCar, FaStar, FaMapMarkerAlt, FaStore } from 'react-icons/fa'
import styles from './RecordCard.module.css'
import { formatDate } from "@/client/components/SearchSection/Odometer/Odometer";

interface RecordCardProps {
    record: {
        id: string
        price: number
        miles: number
        city: string
        state: string
        seller_name: string
        first_seen_at_date: string
        last_seen_at_date: string
    }
    isLatest?: boolean
}

export const RecordCard = ({ record, isLatest }: RecordCardProps) => {
    return (
        <Card radius="xl" p="lg" className={styles.card}>
            <Group justify="space-between" mb="md">
                <Group gap="sm">
                    <div>
                        <Text fw={700} fz="lg" c="gray.9">
                            {record.seller_name}
                        </Text>
                        {isLatest && (
                            <Badge
                                variant="gradient"
                                gradient={{ from: 'green', to: 'teal' }}
                                leftSection={<FaStar size={10} style={{ marginRight: 4 }} />}
                                radius="sm"
                            >
                                Latest
                            </Badge>
                        )}
                    </div>
                </Group>
            </Group>

            <div className={styles.priceSection}>
                <Group justify="space-between" mb="xs">
                    <Text fz="xl" fw={700} c="gray.9">
                        ${record.price?.toLocaleString() || '--'}
                    </Text>
                    <Text fz="lg" fw={600} c="blue.6">
                        {record.miles?.toLocaleString()} mi
                    </Text>
                </Group>
            </div>

            <div className={styles.infoSection}>
                <Group gap="xs">
                    <FaMapMarkerAlt className={styles.grayIcon} />
                    <Text fw={500} c="gray.7">
                        {record.city}, {record.state}
                    </Text>
                </Group>

                <Group gap="xs">
                    <FaStore className={styles.grayIcon} />
                    <Text c="gray.7">{record.seller_name}</Text>
                </Group>

                <div className={styles.dates}>
                    <div>
                        <Text fz="sm" c="gray.6">
                            First seen:
                        </Text>
                        <Text fw={500} c="gray.9">
                            {formatDate(record.first_seen_at_date)}
                        </Text>
                    </div>
                    <div className={styles.right}>
                        <Text fz="sm" c="gray.6">
                            Last seen:
                        </Text>
                        <Text fw={500} c="gray.9">
                            {formatDate(record.last_seen_at_date)}
                        </Text>
                    </div>
                </div>
            </div>
        </Card>
    )
}
