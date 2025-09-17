"use client";

import { useEffect, useState } from "react";
import { Box, Stepper, Loader } from "@mantine/core";
import { motion } from "framer-motion";
import { FaFileAlt, FaPhone, FaUpload, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";
import { CallSchedule } from "@/app/auctions/dealer/form/CallSchedule/CallSchedule";
import { ApplicationForm } from "@/app/auctions/dealer/form/ApplicationForm/ApplicationForm";
import { RegistrationSteps } from "@/app/auctions/dealer/form/RegistrationAuctionAcceess/RegistrationAuctionAcceess";
import { useAuctionAccessRequest } from "@/hooks";
import type { UserAuctionAccessSchemaSteps } from '@/services'
import { ApplicationSuccesses } from "./ApplicationForm/ApplicationSuccesses";

const stepMapping: Record<UserAuctionAccessSchemaSteps, number> = {
    'application': 0,
    call: 1,
    documents: 2,
    approved: 3,
    rejected: 3
}

const stepsData = [
    { label: "Application", description: "Fill out info", icon: <FaFileAlt /> },
    { label: "Call", description: "Scheduled call", icon: <FaPhone /> },
    { label: "Documents", description: "Upload docs", icon: <FaUpload /> },
    { label: "Decision", description: "Final approval", icon: <FaCheckCircle /> },
];

export default function Page() {
    const [activeStep, setActiveStep] = useState(0);
    const [waitingForAdmin, setWaitingForAdmin] = useState(false)
    const { data, isLoading } = useAuctionAccessRequest()

    const handleStepClick = (index: number) => {
        // if (index <= activeStep) setActiveStep(index);
        setActiveStep(index);
    };

    useEffect(() => {
        if (!data) {
            return
        }

        setActiveStep(stepMapping[data.step])
        setWaitingForAdmin(data.status === 'pending')
    }, [data])


    return (
        <Box
            className={styles.container}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Stepper
                active={activeStep}
                onStepClick={handleStepClick}
                color="blue"
                size="sm"
                orientation="horizontal"
                className={styles.stepper}
            >
                {stepsData.map((step, idx) => (
                    <Stepper.Step
                        key={idx}
                        label={step.label}
                        description={step.description}
                        icon={step.icon}
                        allowStepSelect={false}

                    />
                ))}
            </Stepper>

            <div className={styles.content}>
                <div className={styles.card}>
                    {isLoading && (
                        <div className={styles.loader}>
                            <Loader />
                        </div>
                    )}
                    {!isLoading && (waitingForAdmin ? <ApplicationSuccesses /> : <>
                        {activeStep === 0 && <ApplicationForm />}
                        {activeStep === 1 && <CallSchedule />}
                        {activeStep === 2 && <RegistrationSteps />}
                        {activeStep === 3 && <div>Final decision stage</div>}
                    </>)}
                </div>
            </div>
        </Box>
    );
}
