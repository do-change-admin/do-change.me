"use client";

import {useEffect, useState} from "react";
import {Box, Stepper, Loader} from "@mantine/core";
import {useTranslations} from "next-intl";
import {motion} from "framer-motion";
import {FaFileAlt, FaPhone, FaUpload, FaCheckCircle} from "react-icons/fa";
import styles from "./page.module.css";
import {CallSchedule} from "./CallSchedule/CallSchedule";
import {ApplicationForm} from "./ApplicationForm/ApplicationForm";
import {RegistrationSteps} from "./RegistrationAuctionAcceess/RegistrationAuctionAcceess";
import {useAuctionAccessRequest, useProfile} from "@/hooks";
import type {UserAuctionAccessSchemaSteps} from '@/services'
import {ApplicationSuccesses} from "./ApplicationForm/ApplicationSuccesses";
import {AccessMainStep} from "./AccessMainStep/AccessMainStep";
import {SubscriptionStep} from "@/app/auctions/dealer/SubscriptionStep/SubscriptionStep";
import {SuccessCard} from "@/app/auctions/dealer/SuccessPage/SuccessCard";
import {ApprovedAccess} from "@/app/auctions/dealer/ApprovedAccess/ApprovedAccess";

const stepMapping: Record<UserAuctionAccessSchemaSteps, number> = {
    application: 0,
    call: 2,
    documents: 3,
    approved: 4,
    rejected: 5,
}

export default function Page() {
    const [activeStep, setActiveStep] = useState(1);
    const [waitingForAdmin, setWaitingForAdmin] = useState(false)
    const {data, isLoading} = useAuctionAccessRequest()
    const {data: profileData} = useProfile()

    const t = useTranslations("Steps");

    const stepsData = [
        {
            label: t("application.label"),
            description: t("application.description"),
            icon: <FaFileAlt/>
        },
        {
            label: t("call.label"),
            description: t("call.description"),
            icon: <FaPhone/>
        },
        {
            label: t("documents.label"),
            description: t("documents.description"),
            icon: <FaUpload/>
        },
        {
            label: t("decision.label"),
            description: t("decision.description"),
            icon: <FaCheckCircle/>
        }
    ];

    const handleStepClick = (index: number) => {
        if (index <= activeStep) setActiveStep(index);
        setActiveStep(index);
    };
    //
    // useEffect(() => {
    //     if (!data) {
    //         return
    //     }
    //
    //     setActiveStep(stepMapping[data.step])
    //     setWaitingForAdmin(data.status === 'pending')
    // }, [data])


    if (activeStep === 0 && !waitingForAdmin) {
        return (
            <>
                {isLoading ? (
                    <div className={styles.loader}>
                        <Loader/>
                    </div>
                ) : (
                    <AccessMainStep onStart={() => setActiveStep(1)}/>
                )}
            </>
        )
    }
    if (activeStep === 0 && !waitingForAdmin) {
        return <AccessMainStep onStart={() => setActiveStep(1)}/>
    }

    if (profileData?.subscription) {
        return (
            <ApprovedAccess/>
        )
    }

    return (
        <Box
            className={styles.container}
            component={motion.div}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
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
                {isLoading && (
                    <div className={styles.card}>
                        <div className={styles.loader}>
                            <Loader/>
                        </div>
                    </div>
                )}
                {!isLoading && (waitingForAdmin ? <SuccessCard/> : <>
                    {activeStep === 1 && (
                        <div className={styles.card}>
                            <ApplicationForm/>
                        </div>
                    )}
                    {activeStep === 2 && (
                        <div className={styles.card}>
                            <CallSchedule/>
                        </div>
                    )}
                    {activeStep === 3 && (
                        <div className={styles.card}><RegistrationSteps/></div>
                    )}
                    {activeStep === 4 && <SubscriptionStep />}
                    {activeStep === 5 && <SubscriptionStep isRejected/>}
                </>)}
            </div>
        </Box>
    );
}
