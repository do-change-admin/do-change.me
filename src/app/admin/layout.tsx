"use client";

import { AppShell } from "@mantine/core";
import styles from "./layout.module.css";
import {AdminSideBar} from "@/components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell
            padding="md"
            navbar={{ width: 220, breakpoint: "sm", collapsed: { mobile: false } }}
        >
            <AppShell.Navbar>
                <AdminSideBar />
            </AppShell.Navbar>
            <AppShell.Main className={styles.main}>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
