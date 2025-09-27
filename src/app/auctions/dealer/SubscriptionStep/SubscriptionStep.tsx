"use client";

import { FC } from "react";
import { FaCheck, FaCrown, FaRocket } from "react-icons/fa";
import styles from "./SubscriptionStep.module.css";
import {ProPlan} from "@/app/auctions/dealer/SubscriptionStep/ProPlan/ProPlan";
import {BasicPlan} from "@/app/auctions/dealer/SubscriptionStep/BasicPlan/BasicPlan";

interface SubscriptionStep {
    isRejected?: boolean;
}

export const SubscriptionStep: FC<SubscriptionStep> = ({isRejected}) => {
    return (
        <div className={styles.container}>
            <div className={styles.cardWrapper}>
                {/* Decorative Elements */}
                <div className={styles.decorTopLeft}></div>
                <div className={styles.decorBottomRight}></div>
                <div className={styles.decorStar}></div>
                <div className={styles.decorCircle}></div>
                <div className={styles.decorSmallSquare}></div>

                <div className={styles.grid}>
                    {/* Left Text Section */}
                    {!isRejected ? (
                        <div className={styles.textSection}>
                            <div className={styles.label}>
                                <FaCheck className={styles.iconCheck} />
                                Auction Access Granted
                            </div>
                            <h1 className={styles.title}>Congratulations!</h1>
                            <p className={styles.description}>
                                You've unlocked exclusive Auction Access. After purchasing the plan, you'll receive your number and QR code to attend offline dealer auctions.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.textSection}>
                            <h1 className={styles.title}>We’re sorry, but we are unable to grant you Auction Access at this time.</h1>
                            <p className={styles.description}>
                                If anything changes, we’ll be sure to contact you right away.
                            </p>
                            <p className={styles.description}>
                                In the meantime, you can take advantage of our Basic Subscription and continue using our great service to check vehicles and view detailed reports.
                            </p>
                        </div>
                    )}


                    {/* Right Subscription Card */}
                    {!isRejected ? <ProPlan/> : <BasicPlan/>}
                </div>
            </div>
        </div>
    );
};
