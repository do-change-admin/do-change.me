"use client";

import {motion} from "framer-motion";
import {
    FaCalendarAlt,
    FaPaperPlane,
    FaEnvelope,
    FaUserCircle,
    FaClock,
    FaTimes,
    FaArrowRight,
    FaFileUpload,
    FaIdCard,
    FaEye,
    FaDownload,
    FaFileContract, FaCheck,
    FaCopy,
} from "react-icons/fa";

import styles from "./UserCard.module.css";
import React, {FC, useEffect, useState} from "react";
import {Schedule, SchedulePicker} from "@/components/_admin/SchedulePicker/SchedulePicker";
import {useAdminAuctionAccessRequest, useAdminAuctionAccessRequestUpdate, useDatesMapping} from "@/hooks";
import {useRouter} from "next/navigation";
import {Avatar, Badge, Button, Loader, Text, Group, CopyButton, Tooltip, Card} from "@mantine/core";
import dayjs from "dayjs";
import cn from "classnames";
import {AiOutlineArrowLeft} from "react-icons/ai";

export interface UserCardProps {
    applicationId: string;
}

export const UserCard: FC<UserCardProps> = ({applicationId}) => {
    const [schedule, setSchedule] = useState<Schedule>({})
    const {datesFromSchedule, scheduleFromDates} = useDatesMapping()
    const {data: requestInfo} = useAdminAuctionAccessRequest({id: applicationId})
    const {mutate: update} = useAdminAuctionAccessRequestUpdate()
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

    const handleReject = () => {
        update({body: {id: applicationId, progress: 'reject'}})
    }
    const handleContinue = () => {
        const dates = requestInfo.timeSlots?.length ? [] : datesFromSchedule(schedule)
        update({
            body: {
                id: applicationId,
                progress: 'next approve step',
                availableTimeSlots: dates.length ? dates.map(x => ({date: x})) : undefined
            }
        })
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                {/* Header */}
                <div className={styles.header}>
                    <Button
                        variant="light"
                        color="white"
                        mb={16}
                        leftSection={<AiOutlineArrowLeft size={18} />}
                        onClick={() => router.push("/admin")}
                    >
                        Back
                    </Button>
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
                                    <FaCalendarAlt/>
                                    <span>Born: {new Date(requestInfo.birthDate).toDateString()}</span>
                                </div>
                                <div className={styles.dateItem}>
                                    <FaPaperPlane/>
                                    <span>Applied: {new Date(requestInfo.applicationDate).toDateString()}</span>
                                </div>
                            </div>
                            <div className={styles.email}>
                                <FaEnvelope/>
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
                            <FaUserCircle className={styles.sectionIcon}/>
                            <h2>About</h2>
                        </div>
                        <p className={styles.text}>
                            {requestInfo.bio}
                        </p>
                    </section>

                    {/* Status */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <FaClock className={styles.sectionIconOrange}/>
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
                            <FaTimes/> Reject
                        </button>
                        <button className={styles.continueBtn} onClick={handleContinue}>
                            <FaArrowRight/> Continue
                        </button>
                    </section>

                    <div className={styles.grid}>
                        {/* Calendar */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <FaCalendarAlt className={styles.sectionIconBlue}/>
                                <h2>Available Slots</h2>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                                {requestInfo.timeSlots?.length ? (
                                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                                        <Text fw={600} size="lg" mb="sm">
                                            Active Slot:
                                        </Text>
                                        <Group gap="sm" wrap="wrap">
                                            {requestInfo.timeSlots.map((slot, index) => {
                                                const parsedDate = new Date(slot.date);

                                                const day = parsedDate.toLocaleDateString("en-US", {day: "2-digit"});
                                                const month = parsedDate.toLocaleDateString("en-US", {month: "short"});
                                                const weekday = parsedDate.toLocaleDateString("en-US", {weekday: "short"});
                                                const hr = parsedDate.toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                });
                                                return (
                                                    <div
                                                        key={String(slot.date)}
                                                        className={styles.dateButton}
                                                    >
                                                        <FaCalendarAlt className={styles.dateButtonIcon}/>
                                                        <div className={styles.dateButtonText}>
                                                    <span className={styles.dateButtonDay}>
                                                      {day} {month} {weekday}
                                                    </span>
                                                            <span className={styles.dateButtonWeekday}>{hr}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </Group>
                                    </Card>
                                ) : (
                                    <SchedulePicker scheduleState={[schedule, setSchedule]}/>
                                )}

                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text fw={600} size="lg" mb="sm">
                                        Selected Slots:
                                    </Text>
                                    {requestInfo.activeTimeSlot ? (
                                        <div className={styles.dateButton}>
                                            <FaCalendarAlt className={styles.dateButtonIcon} color="green"/>
                                            <div className={styles.dateButtonText}>
                                                 <span className={styles.dateButtonDay}>
                                                        {new Date(requestInfo.activeTimeSlot.date).toLocaleDateString("en-US", {day: "2-digit"})}

                                                        {new Date(requestInfo.activeTimeSlot.date).toLocaleDateString("en-US", {month: "short"})}
                                                 </span>
                                                <span
                                                    className={styles.dateButtonWeekday}>{new Date(requestInfo.activeTimeSlot.date).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <Text color="dimmed">Waiting for user to select a time slot</Text>
                                    )}
                                </Card>
                            </div>
                        </section>

                        {/* Documents */}
                        {requestInfo.links.agreement && requestInfo.links.driverLicence && (
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FaFileUpload className={styles.sectionIconBlue}/>
                                    <h2>Uploaded Documents</h2>
                                </div>


                                <div className={styles.docCard}>
                                    <div className={styles.docInfo}>
                                        <div className={styles.docIcon}>
                                            <FaIdCard/>
                                        </div>
                                        <div>
                                            <h3>Driver License</h3>
                                            <p>drivers_license_sarah.pdf</p>
                                            <small>Uploaded on Dec 18, 2024</small>
                                        </div>
                                    </div>
                                    <div className={styles.docActions}>
                                        <button>
                                            <FaEye/>
                                        </button>
                                        <a download href={requestInfo.links.agreement} target="_blank">
                                            <FaDownload/>
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.docCard}>
                                    <div className={styles.docInfo}>
                                        <div className={styles.docIconGreen}>
                                            <FaFileContract/>
                                        </div>
                                        <div>
                                            <h3>Agreement Contract</h3>
                                            <p>employment_agreement_signed.pdf</p>
                                            <small>Uploaded on Dec 18, 2024</small>
                                        </div>
                                    </div>
                                    <div className={styles.docActions}>
                                        <button>
                                            <FaEye/>
                                        </button>
                                        <a download href={requestInfo.links.driverLicence} target="_blank">
                                            <FaDownload/>
                                        </a>
                                    </div>
                                </div>
                                {requestInfo.auctionAccessNumber && (
                                    <Group flex="column" gap="sm" style={{marginTop: 20}}>
                                        <Text size="lg" fw={600}>
                                            Auction Access Number
                                        </Text>

                                        <CopyButton value={requestInfo.auctionAccessNumber} timeout={2000}>
                                            {({copied, copy}) => (
                                                <Group gap="sm">

                                                    <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'} withArrow>
                                                        <Button
                                                            size="md"
                                                            variant="transparent"
                                                            onClick={copy}
                                                            rightSection={copied ? <FaCheck size={18}/> :
                                                                <FaCopy size={18}/>}
                                                        >
                                                            {requestInfo.auctionAccessNumber}
                                                        </Button>
                                                    </Tooltip>
                                                </Group>
                                            )}
                                        </CopyButton>

                                        <Text size="sm" color="dimmed">
                                            Click the badge or the button to copy your auction access number.
                                        </Text>
                                    </Group>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
