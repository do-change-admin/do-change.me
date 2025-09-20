import React from "react";
import styles from "./page.module.css";
import {SearchSection, SubscriptionPlans} from "@/components";

export default function Reports() {
    return (
        <main id="main-content" className={styles.main}>
            <SearchSection />
            <SubscriptionPlans/>
        </main>
    );
};
