"use client";

import { motion } from "framer-motion";
import {
    FaCalendarAlt,
    FaPaperPlane,
    FaEnvelope,
    FaUserCircle,
    FaClock,
    FaTimes,
    FaArrowRight,
    FaChevronLeft,
    FaChevronRight,
    FaCheckCircle,
    FaFileUpload,
    FaIdCard,
    FaEye,
    FaDownload,
    FaFileContract,
} from "react-icons/fa";

import styles from "./UserCard.module.css";
import React, {FC, useEffect, useState} from "react";
import {Schedule, SchedulePicker} from "@/components/_admin/SchedulePicker/SchedulePicker";
import {useAdminAuctionAccessRequest, useAdminAuctionAccessRequestUpdate, useDatesMapping} from "@/hooks";
import {useRouter} from "next/navigation";
import {Avatar, Loader} from "@mantine/core";
import dayjs from "dayjs";

export interface UserCardProps {
    applicationId: string;
}

export  const  UserCard:FC<UserCardProps> = ({applicationId}) => {
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
        return <Loader/>
    }

    const handleReject = () => { update({ body: { id: applicationId, progress: 'reject' } }) }
    const handleContinue = () => {
        const dates = requestInfo.timeSlots?.length ? [] : datesFromSchedule(schedule)
        update({ body: { id: applicationId, progress: 'next approve step', availableTimeSlots: dates.length ? dates.map(x => ({ date: x })) : undefined } })
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.userPhoto}>
                            <Avatar
                                src={requestInfo?.photoLink}
                                alt="User avatar"
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.basicInfo}>
                            <h1 className={styles.userName}>{requestInfo.firstName} {requestInfo.lastName}</h1>
                            <div className={styles.dates}>
                                <div className={styles.dateItem}>
                                    <FaCalendarAlt />
                                    <span>Born: {new Date(requestInfo.birthDate).toDateString()}</span>
                                </div>
                                <div className={styles.dateItem}>
                                    <FaPaperPlane />
                                    <span>Applied: {new Date(requestInfo.applicationDate).toDateString()}</span>
                                </div>
                            </div>
                            <div className={styles.email}>
                                <FaEnvelope />
                                <span>{requestInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {/* About */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <FaUserCircle className={styles.sectionIcon} />
                            <h2>About</h2>
                        </div>
                        <p className={styles.text}>
                            Experienced software engineer with 8+ years in full-stack
                            development. Passionate about creating innovative solutions and
                            leading cross-functional teams. Strong background in React,
                            Node.js, and cloud technologies.
                        </p>
                    </section>

                    {/* Status */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <FaClock className={styles.sectionIconOrange} />
                            <h2>Application Status</h2>
                        </div>
                        <div className={styles.statusBox}>
                            <div className={styles.statusRow}>
                                <div className={styles.pulseDot}></div>
                                <span className={styles.pending}>Pending Review</span>
                            </div>
                            <p className={styles.pendingText}>
                                {requestInfo.status}
                            </p>
                        </div>
                    </section>

                    {/* Buttons */}
                    <section className={styles.buttons}>
                        <button className={styles.rejectBtn} onClick={handleReject}>
                            <FaTimes /> Reject
                        </button>
                        <button className={styles.continueBtn} onClick={handleContinue}>
                            <FaArrowRight /> Continue
                        </button>
                    </section>

                    <div className={styles.grid}>
                        {/* Calendar */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <FaCalendarAlt className={styles.sectionIconBlue} />
                                <h2>Available Slots</h2>
                            </div>
                            {/*<div className={styles.calendarBox}>*/}
                            {/*    <div className={styles.calendarHeader}>*/}
                            {/*        <h3>December 2024</h3>*/}
                            {/*        <div className={styles.calendarNav}>*/}
                            {/*            <button>*/}
                            {/*                <FaChevronLeft />*/}
                            {/*            </button>*/}
                            {/*            <button>*/}
                            {/*                <FaChevronRight />*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div className={styles.calendarGrid}>*/}
                            {/*        <span>Sun</span>*/}
                            {/*        <span>Mon</span>*/}
                            {/*        <span>Tue</span>*/}
                            {/*        <span>Wed</span>*/}
                            {/*        <span>Thu</span>*/}
                            {/*        <span>Fri</span>*/}
                            {/*        <span>Sat</span>*/}
                            {/*        /!* Days (демо) *!/*/}
                            {/*        <span className={styles.dayMuted}>1</span>*/}
                            {/*        <span className={styles.dayMuted}>2</span>*/}
                            {/*        <span className={styles.dayActive}>20</span>*/}
                            {/*        <span className={styles.dayActive}>22</span>*/}
                            {/*        <span className={styles.dayActive}>27</span>*/}
                            {/*    </div>*/}
                            {/*    <div className={styles.selectedSlots}>*/}
                            {/*        <span>Selected slots: Dec 20, 22, 27</span>*/}
                            {/*    </div>*/}
                            {/*    <div className={styles.userSelected}>*/}
                            {/*        <FaCheckCircle />*/}
                            {/*        <span>User selected: December 22, 2024</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div>
                                {requestInfo.timeSlots?.length
                                    ? <>You selected slots: {requestInfo.timeSlots.map(x => dayjs(x.date).format('YYYY-MM-DD (HH:mm)')).join(', ')}</>
                                    : <SchedulePicker scheduleState={[schedule, setSchedule]} />
                                }
                            </div>
                        </section>

                        {/* Documents */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <FaFileUpload className={styles.sectionIconBlue} />
                                <h2>Uploaded Documents</h2>
                            </div>

                            <div className={styles.docCard}>
                                <div className={styles.docInfo}>
                                    <div className={styles.docIcon}>
                                        <FaIdCard />
                                    </div>
                                    <div>
                                        <h3>Driver License</h3>
                                        <p>drivers_license_sarah.pdf</p>
                                        <small>Uploaded on Dec 18, 2024</small>
                                    </div>
                                </div>
                                <div className={styles.docActions}>
                                    <button>
                                        <FaEye />
                                    </button>
                                    <button>
                                        <FaDownload />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.docCard}>
                                <div className={styles.docInfo}>
                                    <div className={styles.docIconGreen}>
                                        <FaFileContract />
                                    </div>
                                    <div>
                                        <h3>Agreement Contract</h3>
                                        <p>employment_agreement_signed.pdf</p>
                                        <small>Uploaded on Dec 18, 2024</small>
                                    </div>
                                </div>
                                <div className={styles.docActions}>
                                    <button>
                                        <FaEye />
                                    </button>
                                    <button>
                                        <FaDownload />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
