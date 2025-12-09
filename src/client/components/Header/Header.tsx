"use client";

import styles from "./Header.module.css";
import { Image } from "@mantine/core";
import React from "react";
import { UserListWidget } from "@/client/widgets/notifications/user-list/user-list.widget";

export const Header = () => {
    return (
        <header className={styles.header}>
            <Image
                src="/logo/logo.png"
                alt="DoChange logo"
                w="auto"
                h={40}
            />
            <div className={styles.right}>
                <UserListWidget />
            </div>
        </header>
    );
}
