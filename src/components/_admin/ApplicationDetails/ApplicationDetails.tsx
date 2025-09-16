"use client";

import { FC, useEffect, useState } from "react";
import styles from "./ApplicationDetails.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import dayjs from "dayjs";
import { Button } from "@mantine/core";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Schedule, SchedulePicker } from "@/components/_admin/SchedulePicker/SchedulePicker";
import { useRouter } from "next/navigation";
import { useAdminAuctionAccessRequest, useAdminAuctionAccessRequestUpdate } from "@/hooks";

export type ApplicationDetailsProps = {
    applicationId: string;
}

interface SelectedDateTime {
    date: string;
    time: string;
}

export const ApplicationDetails: FC<ApplicationDetailsProps> = ({ applicationId }) => {
    const [schedule, setSchedule] = useState<Schedule>({})
    const { data: requestInfo } = useAdminAuctionAccessRequest({ id: applicationId })
    const { mutate: update } = useAdminAuctionAccessRequestUpdate()
    const router = useRouter();

    console.log(schedule)

    useEffect(() => {
        const slots = requestInfo?.timeSlots
        if (!slots) {
            return
        }
        const newData: Record<string, string[]> = {}
        slots.forEach(x => {
            const currentDate = dayjs(x.date)
            const day = currentDate.get('D')
            const month = currentDate.get('M')
            const year = currentDate.get('y')
            const hour = currentDate.get('h')
            const date = new Date(year, month, day)
            const dateAsString = dayjs(date).format('YYYY-MM-DD')
            if (!newData[dateAsString]) {
                newData[dateAsString] = []
            }
            newData[dateAsString] = [...newData[dateAsString], hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`]
        })
        setSchedule(newData)
    }, [requestInfo?.timeSlots])

    if (!requestInfo) {
        return <>404</>
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Button
                    variant="light"
                    mb={16}
                    leftSection={<AiOutlineArrowLeft size={18} />}
                    onClick={() => router.push("/admin")}
                >
                    Back
                </Button>

                <div className={styles.gridLayout}>
                    {/* Action Buttons */}
                    <div>
                        <div className={styles.card}>
                            <div className={styles.profileSection}>
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                                    alt="Applicant"
                                    className={styles.profilePhoto}
                                />
                                <div className={styles.basicInfo}>
                                    <div>
                                        <label className={styles.infoLabel}>Name</label>
                                        <div className={styles.infoValue}>{requestInfo.firstName} {requestInfo.lastName}</div>
                                    </div>
                                    <div>
                                        <label className={styles.infoLabel}>Date of Birth</label>
                                        <div className={styles.infoValue}>{new Date(requestInfo.birthDate).toDateString()}</div>
                                    </div>
                                    <div>
                                        <label className={styles.infoLabel}>Application Date</label>
                                        <div className={styles.infoValue}>{new Date(requestInfo.applicationDate).toDateString()}</div>
                                    </div>
                                    <div className={styles.fullWidth}>
                                        <label className={styles.infoLabel}>Email Address</label>
                                        <div className={styles.infoValue}>{requestInfo.email}</div>
                                    </div>
                                    <div>
                                        <label className={styles.infoLabel}>Application Status</label>
                                        <span className={styles.statusBadge}>{requestInfo.status}</span>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <Button onClick={() => { update({ body: { id: applicationId, progress: 'reject' } }) }} variant="light" color="red">
                                        <FiX size={20} />
                                        <span>Reject</span>
                                    </Button>
                                    <Button onClick={() => {
                                        const dates = Object.entries(schedule).flatMap(([dateAsString, times]) => {
                                            const rootDate = dayjs(dateAsString)
                                            const withTime = times.map(time => {
                                                return rootDate.set('h', time.split(' ')[1].toLowerCase() === 'am' ? +time.split(' ')[0].split(':')[0] : +time.split(' ')[0].split(':')[0] + 12)
                                            })
                                            return withTime
                                        })
                                        update({ body: { id: applicationId, progress: 'next approve step', availableTimeSlots: dates.length ? dates.map(x => ({ date: x.toDate() })) : undefined } })
                                    }} className={`${styles.actionBtn} ${styles.continue}`}>
                                        <FiCheck size={20} />
                                        <span>Continue</span>
                                    </Button>
                                </div>
                            </div>

                            <SchedulePicker scheduleState={[schedule, setSchedule]} />

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
