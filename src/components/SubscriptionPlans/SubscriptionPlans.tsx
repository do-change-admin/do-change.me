"use client";

import {FaLock} from "react-icons/fa";
import styles from "./SubscriptionPlans.module.css";
import { Drawer } from "@mantine/core";
import { FC } from "react";
import {Plans} from "./Plans";

interface SubscriptionPlansProps {
    opened: boolean;
    close: () => void;
}

export const SubscriptionPlans: FC<SubscriptionPlansProps> = ({ opened, close }) => {

    return (
        <Drawer size="100%" opened={opened} onClose={close}>
            <section className={styles.section}>
                <div className={styles.container}>
                    {/* Сетка с планами */}
                    <Plans/>
                    <div className={styles.footerNote}>
                        <FaLock /> Secure payment • Cancel anytime
                    </div>
                </div>
            </section>
        </Drawer>
    );
}
