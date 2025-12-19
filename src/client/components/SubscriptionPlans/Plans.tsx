'use client'

import React, { FC } from 'react';
import styles from "./SubscriptionPlans.module.css";
import { motion } from "framer-motion";
import {
    FaCar,
    FaCheck,
    FaCrown,
    FaFileAlt,
    FaGavel,
    FaHeadset,
    FaInfoCircle,
    FaRocket,
    FaShareAlt,
    FaShieldAlt,
    FaStar,
    FaUnlock
} from "react-icons/fa";
import { Alert, Anchor, Badge, Group, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { usePlans, useSubscriptionCreation } from "@/client/hooks";

interface IPlanProps {
    isHome?: boolean;
}

export const Plans: FC<IPlanProps> = ({ isHome = false }) => {
    const router = useRouter();
    const { data: plans } = usePlans();
    const { mutateAsync: subscribe } = useSubscriptionCreation();

    const onlyReportsPlan = plans?.basic;
    const auctionAccessPlan = plans?.auctionAccess;

    const handleSubscribe = async (planId?: string, priceId?: string) => {
        if (isHome) {
            router.push('/auth/login')
            return
        }
        if (!planId || !priceId) return;
        const { url } = await subscribe({
            body: { planId, priceId }
        });
        if (url) router.push(url);
    };

    return (
        <div className={styles.grid}>
            {/* Free Plan */}
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={styles.card}
            >
                <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h3 className={styles.cardTitle}>Free Plan</h3>
                            <p className={styles.cardText}>No credit card required</p>
                        </div>
                    </div>

                    <div className={styles.priceBlock}>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>$0</span>
                            <Text>/month</Text>
                        </div>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>Market Value Analytics</strong>
                                <p className={styles.featureNote}>Number of active listings, price charts, history</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen}/>
                            <div>
                                <strong>Price & Odometer Records</strong>
                                <p className={styles.featureNote}>Track historical pricing and mileage</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>Seller History</strong>
                                <p className={styles.featureNote}>Who sold, price, listing snapshot, dealer address</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>Unlimited Salvage Checks</strong>
                                <p className={styles.featureNote}>Verify if vehicle was declared a total loss</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>VIN Scanner</strong>
                                <p className={styles.featureNote}>Smart and fast VIN scanning for any vehicle</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSubscribe(onlyReportsPlan?.prices?.[0]?.planId?.toString(), onlyReportsPlan?.prices?.[0]?.stripePriceId)}
                        className={styles.buttonBlue}
                    >
                        <FaRocket /> Use for Free
                    </button>
                </div>
            </motion.div>

            {/* Basic Plan */}
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={styles.cardPremium}
            >
                <div className={styles.ribbon}>MOST POPULAR</div>
                <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h3 className={styles.cardTitle}>Basic Plan</h3>
                            <p className={styles.cardText}>Perfect for individual users</p>
                        </div>
                    </div>

                    <div className={styles.priceBlock}>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>$50</span>
                            <Text>/month</Text>
                            <span className={styles.oldPrice}>$100</span>
                        </div>
                        <div className={styles.discountBlue}>Save 50%</div>
                    </div>

                    <div className={styles.features}>
                        <motion.div
                            className={styles.featureCarfax}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className={styles.featureIconWrapper}>
                                <FaCheck className={styles.checkGreen} />
                            </div>
                            <div className={styles.featureContent}>
                                <strong>Unlimited CarFax Reports</strong>
                                <p className={styles.featureCarfaxNote}>Full vehicle history reports included</p>
                            </div>
                        </motion.div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>Market Value Analytics</strong>
                                <p className={styles.featureNote}>Number of active listings, price charts, history</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen}/>
                            <div>
                                <strong>Price & Odometer Records</strong>
                                <p className={styles.featureNote}>Track historical pricing and mileage</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>Seller History</strong>
                                <p className={styles.featureNote}>Who sold, price, listing snapshot, dealer address</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>Unlimited Salvage Checks</strong>
                                <p className={styles.featureNote}>Verify if vehicle was declared a total loss</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaCheck className={styles.checkGreen} />
                            <div>
                                <strong>VIN Scanner</strong>
                                <p className={styles.featureNote}>Smart and fast VIN scanning for any vehicle</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSubscribe(onlyReportsPlan?.prices?.[0]?.planId?.toString(), onlyReportsPlan?.prices?.[0]?.stripePriceId)}
                        className={styles.buttonBlue}
                    >
                        <FaRocket /> Get Plan
                    </button>
                </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={styles.card}
            >
                <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h3 className={styles.cardTitle}>Pro Plan</h3>
                            <p className={styles.cardText}>For dealers and high-volume sellers</p>
                        </div>
                        <div className={styles.iconPurpleBg}>
                            <FaCrown />
                        </div>
                    </div>

                    <div className={styles.priceBlock}>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>$150</span>
                            <Text>/month</Text>
                        </div>
                    </div>

                    <div className={styles.features}>
                        <p className={styles.extraNote}>
                            <FaStar className={styles.iconYellow} /> Everything in Free and Basic Plan, plus:
                        </p>
                        <div className={styles.feature}>
                            <FaGavel className={styles.iconPurple} />
                            <div>
                                <strong>Auction Access</strong>
                                <p className={styles.featureNote}>Access to exclusive dealer auctions nationwide</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaShareAlt className={styles.iconPink} />
                            <div>
                                <strong>Multi-Platform Listing</strong>
                                <p className={styles.featureNote}>List vehicles on multiple marketplaces from one dashboard</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.auctionBox}>
                        <h4 className={styles.auctionTitle}>
                            <FaInfoCircle className={styles.iconPurple} /> Auction Access Process
                        </h4>
                        <p className={styles.auctionText}>
                            You will go through several verification steps to obtain Auction Access. After
                            completing these steps, you will be able to subscribe to this plan. You'll gain
                            access to dealer auctions and will be able to purchase vehicles after Auction
                            Access is approved.
                        </p>
                    </div>

                    <button
                        className={styles.buttonPurple}
                        onClick={() =>isHome ? router.push('/auth/login') : router.push('/auctions/dealer')}
                    >
                        <FaUnlock /> Get Access
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
