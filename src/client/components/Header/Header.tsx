"use client";

import styles from "./Header.module.css";
import {Text, Box, Group, Image, Tooltip, ActionIcon, Indicator, Drawer} from "@mantine/core";
import { LanguageSelector } from "@/client/components";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBell } from "react-icons/fa6";
import {useUnreadNotificationsCount} from "@/client/hooks";
import {useDisclosure} from "@mantine/hooks";
import {UserNotifications} from "@/client/features/user-notifications";

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
            {/*<h1 className={styles.name}>do-change</h1>*/}
            <div className={styles.right}>
                <Indicator inline size={16} offset={7} position="top-end" color="red" withBorder processing={isFetching}  label={isFetching ? undefined : count}>
                    <ActionIcon
                        variant="light"
                        color="blue"
                        radius="xl"
                        size="xl"
                        className={styles.notificationButton}
                        onClick={open}
                    >
                        <FaBell size={22}/>
                    </ActionIcon>
                </Indicator>
                <Drawer zIndex={9999999999999999} position="right" offset={8} radius="lg" opened={opened} onClose={close} title="Notifications">
                   <UserNotifications />
                </Drawer>

                {/*<LanguageSelector />*/}
            </div>
        </header>
    );
}
