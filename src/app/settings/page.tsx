"use client";

import styles from "./page.module.css";
import {FaCheck, FaSignOutAlt, FaTimes} from "react-icons/fa";
import { ProfileForm } from "./(ProfileForm)/ProfileForm";
import { Button, Group } from "@mantine/core";
import { signOut } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";

export default function SettingsContent() {
    const [opened, { open, close }] = useDisclosure(false);


    return (
        <div className={styles.settings}>
            <ProfileForm />

            {/*Subscription*/}
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Subscription</h2>

                {/* Current plan */}
                <div id="current-plan" className={styles.planBox}>
                    <div className={styles.planRow}>
                        <div>
                            <div className={styles.planTitleRow}>
                                <h3 className={styles.planName}>Pro Plan</h3>
                                <span className={styles.planBadge}>Current</span>
                            </div>
                            <div className={styles.planMeta}>
                                <div>50/month</div>
                                <div>Next billing: March 15, 2024</div>
                            </div>
                        </div>

                        <div className={styles.actionsCol}>
                            {/*<button className={styles.ghostBtn}>Change Plan</button>*/}
                            <Button
                                variant="light"
                                c="red"
                                leftSection={<FaTimes />}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Billing history */}
                {/*<div id="billing-history" className={styles.block}>*/}
                {/*    <h3 className={styles.blockTitle}>Billing History</h3>*/}

                {/*    <div className={styles.historyList}>*/}
                {/*        <HistoryItem title="Pro Plan - February 2024" date="Feb 15, 2024" amount="$29.00" />*/}
                {/*        <HistoryItem title="Pro Plan - January 2024" date="Jan 15, 2024" amount="$29.00" />*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Payment method */}
                {/*<div id="payment-method" className={styles.blockTop}>*/}
                {/*    <h3 className={styles.blockTitle}>Payment Method</h3>*/}

                {/*    <div className={styles.pmRow}>*/}
                {/*        <div className={styles.pmLeft}>*/}
                {/*            <div className={styles.pmIcon}>*/}
                {/*                <FaCcVisa />*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <p className={styles.pmNumber}>•••• •••• •••• 4242</p>*/}
                {/*                <p className={styles.pmMeta}>Expires 12/26</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <button className={styles.ghostBtn}>Update</button>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </section>

            <Group gap="xs" justify="right">
                <Button
                    leftSection={<FaSignOutAlt />}
                    color="red"
                    variant="light"
                    radius="lg"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                    Logout
                </Button>
            </Group>
        </div>
    );
}

function HistoryItem({
    title,
    date,
    amount,
}: {
    title: string;
    date: string;
    amount: string;
}) {
    return (
        <div className={styles.historyItem}>
            <div className={styles.historyLeft}>
                <div className={styles.historyIcon}>
                    <FaCheck />
                </div>
                <div>
                    <p className={styles.historyTitle}>{title}</p>
                    <p className={styles.historyDate}>{date}</p>
                </div>
            </div>

            <div className={styles.historyRight}>
                <p className={styles.historyAmount}>{amount}</p>
                <button className={styles.linkBtn}>Download</button>
            </div>
        </div>
    );
}
