'use client'

import { FaBell } from 'react-icons/fa';
import styles from './ApplicationSuccesses.module.css';

export const ApplicationSuccesses = ()=> {
    return (
        <div className={styles.statusContent}>

            <div>
                <p className={styles.description}>
                    Your application for <span className={styles.highlight}>Auction Access</span> has been received. Our manager will contact you soon.
                </p>

                <div className={styles.noticeBox}>
                    <div className={styles.noticeHeader}>
                        <FaBell className={styles.noticeIcon} />
                        <span className={styles.noticeTitle}>Important Notice</span>
                    </div>
                    <p className={styles.noticeText}>
                        Please stay attentive to notifications in the app so you can proceed to the next step and schedule your interview call.
                    </p>
                </div>
            </div>
        </div>
    );
}
