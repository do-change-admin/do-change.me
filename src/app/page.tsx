'use client'

import React from "react";
import styles from "./page.module.css";
import { SearchSection, SubscriptionPlans } from "@/client/components";
import { useDisclosure } from "@mantine/hooks";

export default function Reports() {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <div id="main-content" className={styles.main}>
            <SubscriptionPlans opened={opened} close={close} />
            <SearchSection openSubscription={open} />
        </div>
    );
};
