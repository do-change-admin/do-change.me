'use client'

import React, { FormEvent, useEffect, useState } from 'react';
import styles from "./ProfileForm.module.css";
import { Button, Loader } from "@mantine/core";
import { FaCamera } from "react-icons/fa";
import { useProfile, useProfileModifying } from "@/hooks";
import { notifications } from "@mantine/notifications";
import { ProfileFormSkeleton } from "@/app/settings/(ProfileForm)/ProfileFormSkeleton";

export const ProfileForm = () => {

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


    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        modifyProfile(
            { body: { bio, firstName, lastName, phone } },
            {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'New profile data was successfully saved!',
                        color: 'green',
                    });
                },
                onError: (e) => {
                    notifications.show({
                        title: 'Error',
                        message: `Error while saving - ${e.error.message} (${e.stage})`,
                        color: 'red',
                    });
                },
            }
        );
    };

    if (profileIsLoading) {
        return <ProfileFormSkeleton />
    }

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Profile Information</h2>
                <Button
                    onClick={handleSave}
                    disabled={profileIsModifying}
                    leftSection={profileIsModifying ? <Loader size="xs" color="white" /> : null}
                >
                    {profileIsModifying ? 'Saving...' : 'Save'}
                </Button>
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
    );
};