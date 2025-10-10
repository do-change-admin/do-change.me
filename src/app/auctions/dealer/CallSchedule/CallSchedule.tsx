"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaVideo,
    FaClock,
    FaShieldAlt,
    FaGavel,
    FaChevronLeft,
    FaChevronRight,
    FaCalendarCheck, FaCalendarAlt,
} from "react-icons/fa";
import styles from "./CallSchedule.module.css"
import { useAuctionAccessRequest, useAuctionAccessRequestUpdate, useDatesMapping } from "@/hooks";
import dayjs from "dayjs";
import cn from "classnames";

export const CallSchedule = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string>()

    const availableDates = [3, 5, 6, 9, 10, 12, 13];
    const availableTimes = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

    const { data } = useAuctionAccessRequest()
    const { mutate: update } = useAuctionAccessRequestUpdate()

    const handleConfirm = () => {
        update({ body: { selectedTimeSlotId } })
    }


    return (
        <div id="interview-scheduler" className={styles.schedulerWrapper}>
            <div className={styles.schedulerContainer}>
                <div className={styles.schedulerCard}>
                    <div className={styles.schedulerGrid}>
                        <motion.section
                            id="calendar-scheduler"
                            className={styles.calendarSection}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className={styles.calendarHeader}>
                                <h2 className={styles.calendarTitle}>Select Date & Time</h2>
                                <p className={styles.calendarSubtitle}>
                                    Choose from available interview slots below
                                </p>
                            </div>
                            <div className={styles.timeSlots}>
                                <h3 className={styles.timeTitle}>Available Times</h3>
                                <div className={styles.timeGrid}>
                                    {data?.timeSlots.map((time) => {
                                        const parsedDate = new Date(time.date);

                                        const day = parsedDate.toLocaleDateString("en-US", { day: "2-digit" });
                                        const month = parsedDate.toLocaleDateString("en-US", { month: "short" });
                                        const weekday = parsedDate.toLocaleDateString("en-US", { weekday: "short" });
                                        const hr = parsedDate.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        });
                                        return (
                                            <div
                                                key={time.id}
                                                className={cn(styles.dateButton, {
                                                    [styles.timeSelected]: selectedTimeSlotId === time.id,
                                                })}
                                                onClick={() => setSelectedTimeSlotId(time.id)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <FaCalendarAlt className={styles.dateButtonIcon} />
                                                <div className={styles.dateButtonText}>
                                                    <span className={styles.dateButtonDay}>
                                                      {day} {month} {weekday}
                                                    </span>
                                                    <span className={styles.dateButtonWeekday}>{hr}</span>
                                                </div>
                                            </div>

                                        )
                                    })}
                                </div>
                            </div>

                            <button
                                className={styles.confirmBtn}
                                disabled={!selectedTimeSlotId}
                                onClick={handleConfirm}
                            >
                                <FaCalendarCheck className={styles.confirmIcon} />
                                Confirm Interview Appointment
                            </button>
                        </motion.section>

                        {/* INFO SECTION */}
                        <motion.section
                            className={styles.infoSection}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className={styles.infoContent}>
                                <div className={styles.iconBox}>
                                    <FaVideo size={28} className={styles.iconWhite} />
                                </div>
                                <h1 className={styles.title}>Schedule Your Online Interview</h1>
                                <p className={styles.description}>
                                    Choose a convenient time slot to connect with our manager for your video interview.
                                </p>

                                <div className={styles.infoItems}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <FaClock className={styles.iconWhite} />
                                        </div>
                                        <div>
                                            <h3 className={styles.infoTitle}>Duration: 15-20 minutes</h3>
                                            <p className={styles.infoText}>Preliminary interview before submitting documents</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <FaShieldAlt className={styles.iconWhite} />
                                        </div>
                                        <div>
                                            <h3 className={styles.infoTitle}>Background Check</h3>
                                            <p className={styles.infoText}>Ensures secure access and compliance</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <FaGavel className={styles.iconWhite} />
                                        </div>
                                        <div>
                                            <h3 className={styles.infoTitle}>Auction Access</h3>
                                            <p className={styles.infoText}>Gain access to live auctions after verification</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
}
