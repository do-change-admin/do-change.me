'use client'

import {
    FaCar,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
} from 'react-icons/fa'
import dayjs from 'dayjs'
import styles from './VehicleHistoryCard.module.css'

export type LossStatus = 'none' | 'repaired' | 'total'
export type CardStatus = 'clean' | 'excellent' | 'minor' | 'accident' | 'multiple' | 'total'

export interface VehicleHistoryCardProps {
    title?: string
    vin?: string
    yearRange: string
    status: CardStatus
    accidents?: {
        type: string
        date?: string
    }[]
    lossStatus: LossStatus
    lastUpdated?: string
}

const STATUS_META: Record<CardStatus, { label: string; className: string }> = {
    clean: { label: 'No Total Loss', className: styles.clean },
    excellent: { label: 'Excellent', className: styles.excellent },
    minor: { label: 'Minor Issues', className: styles.minor },
    accident: { label: 'Damaged', className: styles.damaged },
    multiple: { label: 'Multiple Issues', className: styles.multiple },
    total: { label: 'Total Loss', className: styles.total },
}

const formatMonthYear = (date?: string) => {
    if (!date) return null
    return dayjs(date).format('MMMM YYYY')
}


export function VehicleHistoryCard(props: VehicleHistoryCardProps) {
    const { title, vin, yearRange, status, accidents, lossStatus, lastUpdated } = props
    const meta = STATUS_META[status]

    return (
        <div className={`${styles.card} ${meta.className}`}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <div>
                        <h3>{title}</h3>
                        <span className={styles.vin}>VIN: {vin}</span>
                    </div>
                </div>
                <span className={styles.badge}>{meta.label}</span>
            </header>

            <section className={styles.body}>
                <p className={styles.period}><strong>History Period:</strong> {formatMonthYear(yearRange.split(" - ")[0])}-{formatMonthYear(yearRange.split(" - ")[1])}</p>

                {(!accidents || accidents.length === 0) && (
                    <div className={styles.rowSuccess}>
                        <FaCheckCircle /> No accidents reported
                    </div>
                )}

                {accidents?.map((acc, i) => (
                    <div key={i} className={styles.rowWarning}>
                        {acc.type === 'accident' && <FaExclamationTriangle />}
                        {acc.type === 'salvage' && <FaTimesCircle />}
                        <div>
                            <strong>{acc.type === 'salvage' ? "Total Loss" : acc.type}</strong>
                            {acc.date && (
                                <div className={styles.sub}>
                                    {formatMonthYear(acc.date)}
                                </div>
                            )}

                        </div>
                    </div>
                ))}

                {lossStatus === 'none' && (
                    <div className={styles.rowSuccess}>
                        <FaCheckCircle /> No total loss
                    </div>
                )}
                {lossStatus === 'total' && (
                    <div className={styles.rowDanger}>
                        <FaTimesCircle /> Total loss declared
                    </div>
                )}
            </section>

            <footer className={styles.footer}>
                Last updated: {formatMonthYear(lastUpdated)}
            </footer>
        </div>
    )
}
