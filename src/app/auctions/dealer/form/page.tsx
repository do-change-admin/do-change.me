"use client";

import { useState } from "react";
import { Box, Stepper } from "@mantine/core";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import {CallSchedule} from "@/app/auctions/dealer/form/CallSchedule/CallSchedule";
import {ApplicationForm} from "@/app/auctions/dealer/form/ApplicationForm/ApplicationForm";

const stepsData = [
    { label: "Application", description: "Complete preliminary information", completed: false },
    { label: "Call Scheduled", description: "Wait for the scheduled call", completed: false },
    { label: "Document Upload", description: "Upload necessary documents", completed: false },
    { label: "Final Decision", description: "Receive final approval", completed: false },
];

export default function Page() {
    const [activeStep, setActiveStep] = useState(0);

    const [steps, setSteps] = useState(stepsData);

    const handleNext = () => {
        const newSteps = [...steps];
        newSteps[activeStep].completed = true;
        setSteps(newSteps);
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleStepClick = (index: number) => {
        // Разрешаем переход только на текущий шаг или уже выполненные
        if (index <= activeStep && steps[index].completed) {
            setActiveStep(index);
        }
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
            >
                {steps.map((step, idx) => (
                    <Stepper.Step
                        key={idx}
                        label={step.label}
                        description={step.description}
                        // allowStepSelect={step.completed || idx === activeStep} // блокировка
                    />
                ))}
            </Stepper>
            <div className={styles.content}>
                <div className={styles.card}>
                    {activeStep === 0 && <ApplicationForm/>}
                    {activeStep === 1 && <CallSchedule/>}
                </div>
            </div>


        </Box>
    );
}
