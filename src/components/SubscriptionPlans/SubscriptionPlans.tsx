"use client";

import { motion } from "framer-motion";
import {
    FaCar,
    FaCheck,
    FaFileAlt,
    FaShieldAlt,
    FaHeadset,
    FaRocket,
    FaCrown,
    FaGavel,
    FaShareAlt,
    FaStar,
    FaInfoCircle,
    FaUnlock,
    FaLock
} from "react-icons/fa";
import styles from "./SubscriptionPlans.module.css";
import { useRouter } from "next/navigation";
import { Badge, Drawer, Modal, Text } from "@mantine/core";
import { FC } from "react";
import { usePlans, useSubscriptionCreation } from "@/hooks";

interface SubscriptionPlansProps {
    opened: boolean;
    close: () => void;
}

export const SubscriptionPlans: FC<SubscriptionPlansProps> = ({ opened, close }) => {
    const router = useRouter()
    const { data: plans } = usePlans()
    const { mutateAsync: subscribe } = useSubscriptionCreation()

    const onlyReportsPlan = plans?.basic
    const auctionAccessPlan = plans?.auctionAccess

    return (
        <Drawer size="100%" opened={opened} onClose={close}>
            <section className={styles.section}>
                <div className={styles.container}>
                    {/* Сетка с планами */}
                    <div className={styles.grid}>
                        {/* Basic Plan */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                            className={styles.card}
                        >
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>Basic Plan</h3>
                                        <p className={styles.cardText}>Perfect for individual users</p>
                                    </div>
                                    <div className={styles.iconBlue}>
                                        <FaCar />
                                    </div>
                                </div>

                                <div className={styles.priceBlock}>
                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>$20</span>
                                        <Text>/month</Text>
                                        <span className={styles.oldPrice}>$70</span>
                                    </div>
                                    <div className={styles.discountBlue}>Save 70%</div>
                                </div>

                                <div className={styles.features}>
                                    <div className={styles.feature}>
                                        <FaCheck className={styles.checkGreen} />
                                        <div>
                                            <strong>Market Value</strong> — <Badge size="lg"
                                                variant="light">Unlimited</Badge>
                                            <p className={styles.featureNote}>Get accurate market pricing for any
                                                vehicle</p>
                                        </div>
                                    </div>
                                    <div className={styles.feature}>
                                        <FaCheck className={styles.checkGreen} />
                                        <div>
                                            <strong>Total Loss Check</strong> — <Badge size="lg"
                                                variant="light">Unlimited</Badge>
                                            <p className={styles.featureNote}>Verify if vehicle was declared a total
                                                loss</p>
                                        </div>
                                    </div>
                                    <div className={styles.feature}>
                                        <FaFileAlt className={styles.iconBlue} />
                                        <div>
                                            <strong>10 Vehicle History Reports</strong>
                                            <p className={styles.featureNote}>The best report options, such as Carfax
                                                and AutoCheck.</p>
                                            <p className={styles.featureNote}>Additional reports: $0.95 each</p>
                                        </div>
                                    </div>
                                    <div className={styles.feature}>
                                        <FaShieldAlt className={styles.iconPurple} />
                                        <div>
                                            <strong>Fraud Protection</strong>
                                            <p className={styles.featureNote}>Advanced algorithms to detect potential
                                                fraud</p>
                                        </div>
                                    </div>
                                    <div className={styles.feature}>
                                        <FaHeadset className={styles.iconOrange} />
                                        <div>
                                            <strong>24/7 Customer Support</strong>
                                            <p className={styles.featureNote}>Get help whenever you need it</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        const { url } = await subscribe({
                                            body: {
                                                planId: onlyReportsPlan!.prices![0].planId.toString(),
                                                priceId: onlyReportsPlan!.prices![0].stripePriceId
                                            }
                                        })
                                        if (url) {
                                            router.push(url)
                                        }
                                    }}
                                    className={styles.buttonBlue}>
                                    <FaRocket /> Get Plan
                                </button>
                            </div>
                        </motion.div>

                        {/* Premium Plan */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                            className={styles.cardPremium}
                        >
                            <div className={styles.ribbon}>MOST POPULAR</div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>Premium Plan</h3>
                                        <p className={styles.cardText}>For professionals</p>
                                    </div>
                                    <div className={styles.iconPurpleBg}>
                                        <FaCrown />
                                    </div>
                                </div>

                                <div className={styles.priceBlock}>
                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>$100</span>
                                        <Text>/month</Text>
                                        <span className={styles.oldPrice}>$200</span>

                                    </div>
                                    <div className={styles.discountPurple}>Save 50%</div>
                                </div>

                                <div className={styles.features}>
                                    <p className={styles.extraNote}>
                                        <FaStar className={styles.iconYellow} /> Everything in Basic Plan, plus:
                                    </p>
                                    <div className={styles.feature}>
                                        <FaGavel className={styles.iconPurple} />
                                        <div>
                                            <strong>Auction Access</strong>
                                            <p className={styles.featureNote}>Access to exclusive dealer auctions
                                                nationwide</p>
                                        </div>
                                    </div>
                                    <div className={styles.feature}>
                                        <FaShareAlt className={styles.iconPink} />
                                        <div>
                                            <strong>Syndication</strong>
                                            <p className={styles.featureNote}>Distribute your inventory across multiple
                                                platforms</p>
                                        </div>
                                    </div>
                                    <div className={styles.feature}>
                                        <FaFileAlt className={styles.iconBlue} />
                                        <div>
                                            <strong>50 Vehicle History Reports</strong>
                                            <p className={styles.featureNote}>The best report options, such as Carfax
                                                and AutoCheck.</p>
                                            <p className={styles.featureNote}>Additional reports: $0.95 each</p>
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

                                <button className={styles.buttonPurple} onClick={async () => {
                                    const { url } = await subscribe({
                                        body: {
                                            planId: auctionAccessPlan!.prices![0].planId.toString(),
                                            priceId: auctionAccessPlan!.prices![0].stripePriceId
                                        }
                                    })
                                    if (url) {
                                        router.push(url)
                                    }
                                }}>
                                    <FaUnlock /> Get Access
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <div className={styles.footerNote}>
                        <FaLock /> Secure payment • Cancel anytime
                    </div>
                </div>
            </section>
        </Drawer>
    );
}
