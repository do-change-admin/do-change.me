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
    FaCalendarCheck,
} from "react-icons/fa";
import styles from "./CallSchedule.module.css"

export const  CallSchedule = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const availableDates = [3, 5, 6, 9, 10, 12, 13];
    const availableTimes = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

    const handleConfirm = () => {
        console.log("Interview confirmed:", {
            date: selectedDate,
            time: selectedTime,
        });
    };

    return (
        <main id="interview-scheduler" className={styles.schedulerWrapper}>
            <div className={styles.schedulerContainer}>
                <div className={styles.schedulerCard}>
                    <div className={styles.schedulerGrid}>
                        {/* INFO SECTION */}
                        <motion.section
                            id="interview-info"
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
                                    Book a required video call interview to gain access to our
                                    exclusive auction platform. Our verification process ensures a
                                    secure and premium experience.
                                </p>

                                <div className={styles.infoItems}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <FaClock className={styles.iconWhite} />
                                        </div>
                                        <div>
                                            <h3 className={styles.infoTitle}>Duration: 15-20 minutes</h3>
                                            <p className={styles.infoText}>Quick verification process</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <FaShieldAlt className={styles.iconWhite} />
                                        </div>
                                        <div>
                                            <h3 className={styles.infoTitle}>Identity Verification</h3>
                                            <p className={styles.infoText}>Secure platform access</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <FaGavel className={styles.iconWhite} />
                                        </div>
                                        <div>
                                            <h3 className={styles.infoTitle}>Auction Access</h3>
                                            <p className={styles.infoText}>Unlock premium features</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* CALENDAR SECTION */}
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

                            {/* Calendar */}
                            <div className={styles.calendarWrapper}>
                                <div className={styles.calendarMonth}>
                                    <h3>December 2024</h3>
                                    <div className={styles.navButtons}>
                                        <button className={styles.navBtn}>
                                            <FaChevronLeft />
                                        </button>
                                        <button className={styles.navBtn}>
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.weekDays}>
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                        (day) => (
                                            <div key={day} className={styles.weekDay}>
                                                {day}
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className={styles.calendarDays}>
                                    {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                                        const isAvailable = availableDates.includes(day);
                                        const isSelected = selectedDate === day;
                                        return (
                                            <div
                                                key={day}
                                                className={`${styles.calendarCell} ${
                                                    isAvailable ? styles.availableDay : styles.unavailableDay
                                                } ${isSelected ? styles.selectedDay : ""}`}
                                                onClick={() => isAvailable && setSelectedDate(day)}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className={styles.timeSlots}>
                                <h3 className={styles.timeTitle}>Available Times</h3>
                                <div className={styles.timeGrid}>
                                    {availableTimes.map((time) => (
                                        <div
                                            key={time}
                                            className={`${styles.timeSlot} ${
                                                selectedTime === time ? styles.timeSelected : ""
                                            }`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            <FaClock className={styles.timeIcon} />
                                            <span>{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                className={styles.confirmBtn}
                                disabled={!selectedDate || !selectedTime}
                                onClick={handleConfirm}
                            >
                                <FaCalendarCheck className={styles.confirmIcon} />
                                Confirm Interview Appointment
                            </button>
                        </motion.section>
                    </div>
                </div>
            </div>
        </main>
    );
}
