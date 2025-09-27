'use client'

import React from 'react';
import styles from "./BasicPlan.module.css";
import {FaCheck, FaRocket} from "react-icons/fa";

export const BasicPlan = () => {
    return (
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
                  Unlimited Vehicle History Reports
                  <br />
                  {/*<span className={styles.featureSubText}>Additional reports $0.95 each</span>*/}
                </span>
                </div>
            </div>

            <div className={styles.pricingSection}>
                <div className={styles.priceRow}>
                    <span className={styles.oldPrice}>$100</span>
                    <span className={styles.newPrice}>$50</span>
                    <span className={styles.priceSuffix}>/month</span>
                </div>
                <div className={styles.savingsBadge}>You Save 50%!</div>
            </div>

            <button className={styles.getPlanBtn}>
                <FaRocket className={styles.rocketIcon} />
                Get Your Plan
            </button>
        </div>
    );
};