import {Button, Loader, Skeleton} from '@mantine/core';
import styles from './ProfileForm.module.css';
import {FaCamera} from "react-icons/fa";
import React from "react";

export const ProfileFormSkeleton = () => {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Profile Information</h2>
                <Skeleton width={20}/>
            </div>

            <div className={styles.avatarRow}>
                <div className={styles.avatarWrap}>
                    <Skeleton width={80} height={80} circle />
                </div>
            </div>

            <form className={styles.grid}>
                <div className={styles.field}>
                    <label className={styles.label}>First Name</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Last Name</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Date of birth</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <Skeleton radius="1rem" height={40}/>
                </div>

                <div className={styles.fieldFull}>
                    <label className={styles.label}>Bio</label>
                    <Skeleton radius="1rem" height={80}/>
                </div>

            </form>
        </section>
    );
}
