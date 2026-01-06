"use client";

import styles from "./Header.module.css";
import {Group, Image, Text} from "@mantine/core";
import React from "react";
import { UserListWidget } from "@/client/widgets/notifications/user-list/user-list.widget";

export const Header = () => {
    return (
        <header className={styles.header}>
            <Group gap='0.3rem' align='center'>
                <Image
                    src="/logo/logo.png"
                    alt="DoChange logo"
                    w="auto"
                    h={35}
                />
                <Text c="var(--text-texas-blue)" fw="bold">do-change</Text>
            </Group>
            <div className={styles.right}>
                <UserListWidget />
            </div>
        </header>
    );
}
