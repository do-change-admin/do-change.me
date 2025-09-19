"use client";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DatePicker } from "@mantine/dates";
import { Button, Card, Text, Badge } from "@mantine/core";
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import styles from "./SchedulePicker.module.css";

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
];


export type Schedule = {
    [date: string]: string[];
};

export const SchedulePicker: FC<{ scheduleState: [Schedule, Dispatch<SetStateAction<Schedule>>] }> = ({
    scheduleState
}) => {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [schedule, setSchedule] = scheduleState;
    const [currentDate, setCurrentDate] = useState<string | null>(null);

    useEffect(() => {
        const dates = Object.keys(schedule);
        const notSelected = dates.filter(x => !selectedDates.includes(x))
        if (notSelected.length) {
            setSelectedDates(x => x.concat(notSelected))
        }
    }, [schedule])

    const handleTimeClick = (slot: string) => {
        if (!currentDate) return;
        const key = currentDate.toString();
        setSchedule((prev) => {
            const prevSlots = prev[key] || [];
            const updatedSlots = prevSlots.includes(slot)
                ? prevSlots.filter((s) => s !== slot)
                : [...prevSlots, slot];
            return { ...prev, [key]: updatedSlots };
        });
        if (!selectedDates.some((d) => d.toString() === key)) {
            setSelectedDates([...selectedDates, currentDate]);
        }
    };

    const removeDate = (dateStr: string) => {
        setSelectedDates(selectedDates.filter((d) => d.toString() !== dateStr));
        setSchedule((prev) => {
            const copy = { ...prev };
            delete copy[dateStr];
            return copy;
        });
        if (currentDate?.toString() === dateStr) {
            setCurrentDate(null);
        }
    };

    const handleConfirm = () => {
        console.log(schedule);
    };

    return (
        <Card className={styles.wrapper} shadow="lg" radius="xl" withBorder>
            {/* Selected Dates Badges */}
            <div className={styles.badges}>
                {selectedDates.map((d) => {
                    const dateStr = d.toString();
                    return (
                        <Badge
                            key={dateStr}
                            color="green"
                            radius="sm"
                            className={styles.badge}
                            rightSection={
                                <AiOutlineClose
                                    size={12}
                                    className={styles.badgeClose}
                                    onClick={() => removeDate(dateStr)}
                                />
                            }
                        >
                            {dateStr}
                        </Badge>
                    );
                })}
            </div>

            <div className={styles.grid}>
                {/* Calendar Block */}
                <div className={styles.calendarBlock}>
                    <Text className={styles.title}>
                        <AiOutlineCalendar /> Select a Date
                    </Text>
                    <DatePicker
                        value={currentDate}
                        onChange={setCurrentDate}
                        className={styles.calendar}
                    />
                </div>

                {/* Time Slots Block */}
                <div className={styles.timeBlock}>
                    <Text className={styles.title}>
                        <AiOutlineClockCircle /> Available Times
                    </Text>
                    <Text className={styles.subTitle}>
                        {currentDate ? currentDate.toString() : "Please select a date"}
                    </Text>

                    <div className={styles.timeGrid}>
                        {timeSlots.map((slot) => {
                            const isSelected =
                                currentDate &&
                                schedule[currentDate.toString()]?.includes(slot);
                            return (
                                <button
                                    key={slot}
                                    onClick={() => handleTimeClick(slot)}
                                    className={`${styles.timeSlot} ${isSelected ? styles.timeSlotSelected : ""
                                        }`}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <Button variant="default" size="md">
                    Cancel
                </Button>
                <Button size="md" onClick={handleConfirm}>
                    Confirm
                </Button>
            </div>
        </Card>
    );
};
