"use client";

import styles from "./Header.module.css";
import { Text, Box, Group, Image } from "@mantine/core";
import { LanguageSelector } from "@/client/components";
import { usePathname } from "next/navigation";
import React from "react";

export const Header = () => {
    const pathname = usePathname();

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
                {/*<Tooltip label="Notifications" position="bottom" transitionProps={{ duration: 150 }}>*/}
                {/*    <ActionIcon*/}
                {/*        variant="light"*/}
                {/*        color="blue"*/}
                {/*        radius="xl"*/}
                {/*        size="lg"*/}
                {/*        className={styles.notificationButton}*/}
                {/*        onClick={() => console.log("Open notifications")}*/}
                {/*    >*/}
                {/*        <FaBell  size={22} />*/}
                {/*    </ActionIcon>*/}
                {/*</Tooltip>*/}
                {/* <LanguageSelector /> */}
            </div>
        </header>
    );
}
