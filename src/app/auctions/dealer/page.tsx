"use client";

import { useEffect, useState } from "react";
import { Box, Stepper, Loader } from "@mantine/core";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FaFileAlt, FaPhone, FaUpload, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";
import { CallSchedule } from "./CallSchedule/CallSchedule";
import { ApplicationForm } from "./ApplicationForm/ApplicationForm";
import { RegistrationSteps } from "./RegistrationAuctionAcceess/RegistrationAuctionAcceess";
import { useAuctionAccessRequest } from "@/hooks";
import type { UserAuctionAccessSchemaSteps } from '@/services'
import { ApplicationSuccesses } from "./ApplicationForm/ApplicationSuccesses";
import { AuctionAccess } from "./ApprovedAccess/ApprovedAccess";
import { AccessMainStep } from "./AccessMainStep/AccessMainStep";

const stepMapping: Record<UserAuctionAccessSchemaSteps, number> = {
    application: 0,
    call: 2,
    documents: 3,
    approved: 4,
    rejected: 5,
}

export default function Page() {
    const [activeStep, setActiveStep] = useState(0);
    const [waitingForAdmin, setWaitingForAdmin] = useState(false)
    const { data, isLoading } = useAuctionAccessRequest()

    const t = useTranslations("Steps");

    const stepsData = [
        {
            label: t("application.label"),
            description: t("application.description"),
            icon: <FaFileAlt />
        },
        {
            label: t("call.label"),
            description: t("call.description"),
            icon: <FaPhone />
        },
        {
            label: t("documents.label"),
            description: t("documents.description"),
            icon: <FaUpload />
        },
        {
            label: t("decision.label"),
            description: t("decision.description"),
            icon: <FaCheckCircle />
        }
    ];

    const handleStepClick = (index: number) => {
        if (index <= activeStep) setActiveStep(index);
        setActiveStep(index);
    };

    useEffect(() => {
        if (!data) {
            return
        }

        setActiveStep(stepMapping[data.step])
        setWaitingForAdmin(data.status === 'pending')
    }, [data])


    if (activeStep === 0 && !waitingForAdmin) {
        return (
            <>
                {isLoading ? (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                ) : (
                    <AccessMainStep onStart={() => setActiveStep(1)} />
                )}
            </>
        )


    }

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
                        {activeStep === 1 && <ApplicationForm />}
                        {activeStep === 2 && <CallSchedule />}
                        {activeStep === 3 && <RegistrationSteps />}
                        {activeStep === 4 && <AuctionAccess />}
                    </>)}
                </div>
            </div>
        </Box>
    );
}
