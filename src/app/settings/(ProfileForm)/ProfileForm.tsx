'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from "./ProfileForm.module.css";
import {Avatar, Button, Loader} from "@mantine/core";
import { FaCamera } from "react-icons/fa";
import {useProfile, useProfileModifying, useUploadPhoto} from "@/hooks";
import { notifications } from "@mantine/notifications";
import { ProfileFormSkeleton } from "@/app/settings/(ProfileForm)/ProfileFormSkeleton";
import { DateInput } from '@mantine/dates';


export const ProfileForm = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [birthDate, setBirthDate] = useState<Date>();
    const { data: profileData, isLoading: profileIsLoading } = useProfile();
    const { mutate: modifyProfile, isPending: profileIsModifying } = useProfileModifying();
    const { mutate: uploadPhoto, isPending: isPendingUploadPhoto } = useUploadPhoto();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) return;
        uploadPhoto(event.target.files[0]);
    };

    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() - 18);

    useEffect(() => {
        if (!profileIsLoading && profileData) {
            setFirstName(profileData.firstName)
            setLastName(profileData.lastName)
            setPhone(profileData.phone)
            setBio(profileData.bio)
            if (profileData.birthDate) {
                setBirthDate(new Date(profileData.birthDate))
            }
        }
    }, [profileIsLoading])


    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        modifyProfile(
            { body: { bio, firstName, lastName, phone, birthDate: birthDate! } },
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
                        message: `Error while saving`,
                        color: 'red',
                    });
                },
            }
        );
    };

    if (profileIsLoading || isPendingUploadPhoto || profileIsModifying) {
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
                    <Avatar
                        src={profileData?.photoLink}
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
                    <label htmlFor='photo-upload'>
                        <p className={styles.linkBtn}>Change Avatar</p>
                    </label>
                    <input style={{ display: 'none' }} id='photo-upload' type='file' onChange={handleFileChange} />
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
                    <label className={styles.label}>Date of birth</label>
                    <DateInput
                        placeholder="Pick date"
                        value={birthDate ? birthDate.toISOString().split("T")[0] : null}
                        onChange={(x) => setBirthDate(new Date(x!))}
                        classNames={{
                            input: styles.inputDateInput,
                        }}
                        maxDate={maxAllowedDate}
                        m={0}
                        p={0}
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