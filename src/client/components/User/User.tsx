'use client'

import React from 'react';
import styles from './User.module.css'
import Image from "next/image";

const DEFAULT_AVATAR = 'https://i.pravatar.cc/40';

export const User = ({
                         firstName = 'John',
                         lastName = 'Doe',
                         avatarUrl = DEFAULT_AVATAR,
                     }) => {
    return (
        <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
                <Image fill src={avatarUrl} alt="User Avatar" className={styles.avatar}/>
            </div>
            <span className={styles.userName}>
             {firstName} {lastName}
             </span>
        </div>
    );
};
