"use client";

import { FC, useEffect, useState } from "react";
import styles from "./ApplicationDetails.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import { Button } from "@mantine/core";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Schedule, SchedulePicker } from "@/components/_admin/SchedulePicker/SchedulePicker";
import { useRouter } from "next/navigation";
import { useAdminAuctionAccessRequest, useAdminAuctionAccessRequestUpdate, useDatesMapping } from "@/hooks";

export type ApplicationDetailsProps = {
    applicationId: string;
}


export const ApplicationDetails: FC<ApplicationDetailsProps> = ({ applicationId }) => {
    const [schedule, setSchedule] = useState<Schedule>({})
    const { datesFromSchedule, scheduleFromDates } = useDatesMapping()
    const { data: requestInfo } = useAdminAuctionAccessRequest({ id: applicationId })
    const { mutate: update } = useAdminAuctionAccessRequestUpdate()
    const router = useRouter();

    useEffect(() => {
        const slots = requestInfo?.timeSlots
        if (!slots) {
            return
        }
        setSchedule(
            scheduleFromDates(slots.map(x => x.date))
        )
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
                                        const dates = datesFromSchedule(schedule)
                                        update({ body: { id: applicationId, progress: 'next approve step', availableTimeSlots: dates.length ? dates.map(x => ({ date: x })) : undefined } })
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
