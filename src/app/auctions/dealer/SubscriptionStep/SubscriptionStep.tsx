"use client";

import { FC } from "react";
import { FaCheck, FaCrown, FaRocket } from "react-icons/fa";
import styles from "./SubscriptionStep.module.css";

interface SubscriptionStep {}

export const SubscriptionStep: FC<SubscriptionStep> = () => {
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

                    {/* Right Subscription Card */}
                    <div className={styles.subscriptionCard}>
                        <div className={styles.featuresList}>
                            <div className={styles.featureItem}>
                                <FaCheck className={styles.featureIcon} />
                                <span>Unlimited Market Value</span>
                            </div>
                            <div className={styles.featureItem}>
                                <FaCheck className={styles.featureIcon} />
                                <span>Unlimited Salvage Check</span>
                            </div>
                            <div className={styles.featureItem}>
                                <FaCheck className={styles.featureIcon} />
                                <span>
                  100 Vehicle History Reports
                  <br />
                  <span className={styles.featureSubText}>Additional reports $0.95 each</span>
                </span>
                            </div>
                            <div className={styles.featureItem}>
                                <FaCheck className={styles.featureIcon} />
                                <span>Auction Access Included</span>
                            </div>
                        </div>

                        <div className={styles.pricingSection}>
                            <div className={styles.priceRow}>
                                <span className={styles.oldPrice}>$200</span>
                                <span className={styles.newPrice}>$100</span>
                                <span className={styles.priceSuffix}>/month</span>
                            </div>
                            <div className={styles.savingsBadge}>You Save 50%!</div>
                        </div>

                        <button className={styles.getPlanBtn}>
                            <FaRocket className={styles.rocketIcon} />
                            Get Your Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
