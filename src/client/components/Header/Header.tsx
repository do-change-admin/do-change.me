"use client";

import styles from "./Header.module.css";
import {Text, Box, Group, Image, Tooltip, ActionIcon, Indicator, Drawer} from "@mantine/core";
import { LanguageSelector } from "@/client/components";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBell } from "react-icons/fa6";
import {useUnreadNotificationsCount} from "@/client/hooks";
import {useDisclosure} from "@mantine/hooks";
import { UserListWidget } from "@/client/widgets/notifications/user-list/user-list.widget";
// import {UserNotifications} from "@/client/features/user-notifications";

export const Header = () => {
    const pathname = usePathname();
    const {count, isFetching} = useUnreadNotificationsCount()
    const [opened, { open, close }] = useDisclosure(false);

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
