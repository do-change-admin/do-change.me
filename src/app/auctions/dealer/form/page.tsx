"use client";

import { useState } from "react";
import { Box, Stepper } from "@mantine/core";
import { motion } from "framer-motion";
import { FaFileAlt, FaPhone, FaUpload, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";
import { CallSchedule } from "@/app/auctions/dealer/form/CallSchedule/CallSchedule";
import { ApplicationForm } from "@/app/auctions/dealer/form/ApplicationForm/ApplicationForm";

const stepsData = [
    { label: "Application", description: "Fill out info", icon: <FaFileAlt /> },
    { label: "Call", description: "Scheduled call", icon: <FaPhone /> },
    { label: "Documents", description: "Upload docs", icon: <FaUpload /> },
    { label: "Decision", description: "Final approval", icon: <FaCheckCircle /> },
];

export default function Page() {
    const [activeStep, setActiveStep] = useState(1);

    const handleStepClick = (index: number) => {
        if (index <= activeStep) setActiveStep(index);
    };

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
                    />
                ))}
            </Stepper>

            <div className={styles.content}>
                <div className={styles.card}>
                    {activeStep === 0 && <ApplicationForm />}
                    {activeStep === 1 && <CallSchedule />}
                    {activeStep === 2 && <div>Upload docs form here</div>}
                    {activeStep === 3 && <div>Final decision stage</div>}
                </div>
            </div>
        </Box>
    );
}
