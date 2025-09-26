"use client";

import React, { useState, FormEvent, useEffect, ChangeEvent } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCamera,
    FaArrowRight,
    FaFileAlt,
    FaCheck,
    FaCar,
    FaKey,
} from "react-icons/fa";
import styles from "./ApplicationForm.module.css";
import { ApplicationSuccesses } from "./ApplicationSuccesses";
import { useAuctionAccessRequestCreation, useProfile, useProfileModifying } from "@/hooks";
import type { ProfileData, UpdateProfilePayload } from "@/services";
import { FaCalendar } from "react-icons/fa6";
import { DateInput } from "@mantine/dates";
import { useQueryClient } from "@tanstack/react-query";
import {Avatar, Button, Group, Text} from "@mantine/core";
import {ProfileForm} from "@/app/settings/(ProfileForm)/ProfileForm";
import {FiAlertCircle, FiCheckCircle} from "react-icons/fi";

export const ApplicationForm = () => {
    const { data: profileData } = useProfile()
    const { mutate: createAuctionAccessRequest } = useAuctionAccessRequestCreation()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createAuctionAccessRequest({})
    };

    const requiredFields: (keyof ProfileData)[] = [
        "firstName",
        "lastName",
        "phone",
        "email",
        "state",
        "zipCode",
        "address",
        "photoLink",
    ]

    const validateUser =  requiredFields?.every((key) => {

            if (profileData) {
                const value = profileData[key];
                return value !== null && value !== "" && value !== undefined;
            }
        });

    console.log(profileData)
    return (
        <div className={styles.mainContainer}>
            {/* Left Section - Form */}
            <div className={styles.formSection}>
                <div className={styles.formContent}>
                    <div className={styles.formHeader}>
                        <h1>Join Our Auction Network</h1>
                        <p>
                            Complete your application to get exclusive access to premium car auctions
                        </p>
                    </div>
                    <ProfileForm isNotSettings/>
                    {!validateUser ? (
                        <Group gap="xs" m="md">
                            <FiAlertCircle color="red" size={18} />
                            <Text c="red" size="sm">
                                Please fill in all required fields to submit your application.
                            </Text>
                        </Group>
                    ) : (
                        <Group gap="xs" mt="lg" mb="lg">
                            <FiCheckCircle color="green" size={18} />
                            <Text c="green" size="sm">
                                Your profile is complete. You can now submit your application.
                            </Text>
                        </Group>
                    )}
                    {/* Submit */}
                    <Button onClick={handleSubmit} radius="lg" fullWidth disabled={!validateUser} h={50}>
                        Submit Application <FaArrowRight />
                    </Button>
                </div>
            </div>

            {/* Right Section */}
            <div className={styles.infoSection}>
                <div className={styles.infoContent}>
                    <div className={styles.infoHeader}>
                        <h2>Exclusive Car Auctions Await</h2>
                        <p>
                            Join thousands of dealers and collectors accessing premium vehicles through our curated auction platform.
                        </p>
                    </div>

                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><FaFileAlt /></div>
                            <div>
                                <h3>Submit Application</h3>
                                <p>Complete the form with your details and background</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><FaPhone /></div>
                            <div>
                                <h3>Admin Review & Call</h3>
                                <p>Our team reviews your application and schedules a verification call</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><FaCheck /></div>
                            <div>
                                <h3>Get Access</h3>
                                <p>Start bidding on exclusive vehicles within 24-48 hours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative */}
                <FaCar className={styles.decorCar} />
                <FaKey className={styles.decorKey} />
            </div>
        </div>
    );
}
