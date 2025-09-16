"use client";

import { FC, useState } from "react";
import styles from "./ApplicationDetails.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import dayjs from "dayjs";
import { Button } from "@mantine/core";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { SchedulePicker } from "@/components/_admin/SchedulePicker/SchedulePicker";
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
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [schedule, setSchedule] = useState<SelectedDateTime[]>([]);
    const { data: requestInfo } = useAdminAuctionAccessRequest({ id: applicationId })
    const { mutate: update } = useAdminAuctionAccessRequestUpdate()
    const router = useRouter();

    const handleAddToSchedule = () => {
        if (selectedDate && selectedTime) {
            const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
            const timeStr = dayjs(selectedTime).format("HH:mm");
            setSchedule((prev) => [...prev, { date: dateStr, time: timeStr }]);
            setSelectedDate(null);
            setSelectedTime(null);
        }
    };

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
                                    <Button onClick={() => { update({ body: { id: applicationId, progress: 'next approve step' } }) }} className={`${styles.actionBtn} ${styles.continue}`}>
                                        <FiCheck size={20} />
                                        <span>Continue</span>
                                    </Button>
                                </div>
                            </div>

                            <SchedulePicker />

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
