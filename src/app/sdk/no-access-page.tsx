"use client";

import { motion } from "framer-motion";
import { FaCheck, FaRocket } from "react-icons/fa";
import styles from "./no-access-page.module.css";
import { Button, Image } from "@mantine/core";
import { usePlans, useSubscriptionCreation } from "@/client/hooks";
import { useRouter } from "next/navigation";

export default function NoAccessPage() {
    const router = useRouter()
    const { data: plans } = usePlans()
    const { mutateAsync: subscribe } = useSubscriptionCreation()

    const auctionAccessPlan = plans?.auctionAccess

    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Text block */}
                    <motion.div
                        className={styles.textBlock}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className={styles.title}>
                            Car Syndication — <br />
                            <span className={styles.highlight} onClick={async () => {
                                const { url } = await subscribe({
                                    body: {
                                        planId: auctionAccessPlan?.prices?.[0]?.planId?.toString() ?? "",
                                        priceId: auctionAccessPlan?.prices?.[0].stripePriceId ?? ""
                                    }
                                })
                                if (url) {
                                    router.push(url)
                                }
                            }}
                            >
                                Get our Premium Plan to get access!</span>
                        </h1>
                        <p className={styles.description}>
                            And you will be able to list your car across multiple marketplaces with just one click.
                        </p>

                        <button
                            onClick={async () => {
                                const { url } = await subscribe({
                                    body: {
                                        planId: auctionAccessPlan?.prices?.[0]?.planId?.toString() ?? "",
                                        priceId: auctionAccessPlan?.prices?.[0].stripePriceId ?? ""
                                    }
                                })
                                if (url) {
                                    router.push(url)
                                }
                            }}
                            className={styles.buttonBlue}>
                            <FaRocket /> Get Plan
                        </button>
                    </motion.div>

                    {/* Image block */}
                    <motion.div
                        className={styles.imageWrapper}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            className={styles.image}
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/b657407fff-b0a7a6e3676de140b0e2.png"
                            alt="Toyota car connected to marketplaces"
                        />
                        <div className={styles.checkIcon}>
                            <FaCheck size={24} color="#fff" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
