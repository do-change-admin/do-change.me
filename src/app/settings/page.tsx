"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { FaCamera, FaCheck, FaCcVisa } from "react-icons/fa";
import { useProfile, useProfileModifying } from "@/hooks";

export default function SettingsContent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");

    const { data: profileData, isLoading: profileIsLoading } = useProfile()
    const { mutate: modifyProfile, isPending: profileIsModifying } = useProfileModifying()

    useEffect(() => {
        if (!profileIsLoading && profileData) {
            setFirstName(profileData.firstName)
            setLastName(profileData.lastName)
            setPhone(profileData.phone)
            setBio(profileData.bio)
        }
    }, [profileIsLoading])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        modifyProfile({ bio, firstName, lastName, phone }, {
            onSuccess: () => {
                alert('New profile data was successfully saved!')
            },
            onError: (e) => {
                alert(`Error while saving - ${e.message}`)
            }
        })
    };

    if (profileIsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.settings}>
            {/* Profile */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Profile Information</h2>
                    <button className={styles.primaryBtn} onClick={handleSave} disabled={profileIsModifying}>
                        Save
                    </button>
                </div>

                <div className={styles.avatarRow}>
                    <div className={styles.avatarWrap}>
                        <img
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                            alt="User avatar"
                            className={styles.avatar}
                        />
                        <button className={styles.avatarBtn} aria-label="Change photo">
                            <FaCamera className={styles.avatarIcon} />
                        </button>
                    </div>

                    <div className={styles.avatarInfo}>
                        <h3 className={styles.userName}>{profileData?.firstName} {profileData?.lastName}</h3>
                        <p className={styles.userEmail}>{profileData?.email}</p>
                        <button className={styles.linkBtn}>Change Avatar</button>
                    </div>
                </div>

                <form className={styles.grid} onSubmit={handleSave}>
                    <div className={styles.field}>
                        <label className={styles.label}>First Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Last Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            className={`${styles.input} ${styles.disabled}`}
                            value={profileData?.email}
                            disabled
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Phone</label>
                        <input
                            type="tel"
                            className={styles.input}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldFull}>
                        <label className={styles.label}>Bio</label>
                        <textarea
                            rows={3}
                            placeholder="Tell us about yourself..."
                            className={`${styles.input} ${styles.textarea}`}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                </form>
            </section>

             Subscription
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Subscription & Billing</h2>

                {/* Current plan */}
                <div id="current-plan" className={styles.planBox}>
                    <div className={styles.planRow}>
                        <div>
                            <div className={styles.planTitleRow}>
                                <h3 className={styles.planName}>Pro Plan</h3>
                                <span className={styles.planBadge}>Current</span>
                            </div>
                            <p className={styles.planDesc}>Access to all features and priority support</p>
                            <div className={styles.planMeta}>
                                <span>$29/month</span>
                                <span className={styles.dot}>•</span>
                                <span>Next billing: March 15, 2024</span>
                            </div>
                        </div>

                        <div className={styles.actionsCol}>
                            <button className={styles.ghostBtn}>Change Plan</button>
                            <button className={styles.dangerLink}>Cancel Subscription</button>
                        </div>
                    </div>
                </div>

                {/* Billing history */}
                <div id="billing-history" className={styles.block}>
                    <h3 className={styles.blockTitle}>Billing History</h3>

                    <div className={styles.historyList}>
                        <HistoryItem title="Pro Plan - February 2024" date="Feb 15, 2024" amount="$29.00" />
                        <HistoryItem title="Pro Plan - January 2024" date="Jan 15, 2024" amount="$29.00" />
                    </div>
                </div>

                {/* Payment method */}
                <div id="payment-method" className={styles.blockTop}>
                    <h3 className={styles.blockTitle}>Payment Method</h3>

                    <div className={styles.pmRow}>
                        <div className={styles.pmLeft}>
                            <div className={styles.pmIcon}>
                                <FaCcVisa />
                            </div>
                            <div>
                                <p className={styles.pmNumber}>•••• •••• •••• 4242</p>
                                <p className={styles.pmMeta}>Expires 12/26</p>
                            </div>
                        </div>
                        <button className={styles.ghostBtn}>Update</button>
                    </div>
                </div>
            </section>
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
