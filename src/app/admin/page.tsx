"use client";

import { useState } from "react";
import { Tabs, Button, Group, Badge } from "@mantine/core";
import styles from "./layout.module.css";
import { UserTable } from "@/components";

interface User {
    id: number;
    photo: string;
    name: string;
    dob: string;
    date: string;
    email: string;
}

// Основные табы
const mainTabs = [
    { label: "Review", count: 12 },
    { label: "Scheduling", count: 5 },
    { label: "Onboarding", count: 3 },
    { label: "Approved", count: 0 },
    { label: "Rejected", count: 0 },
];

const subTabs = ["Awaiting User Confirmation", "Scheduled", "Call Completed - Awaiting Decision"];
const subOnboardingTabs = [
    "Awaiting Documents Upload",
    "Documents Under Review",
    "Corrections Required",
    "Ready for Auction Access",
];


export default function AuctionAccessPage() {
    const [activeMainTab, setActiveMainTab] = useState<string | null>(mainTabs[0].label);
    const [activeSubTab, setActiveSubTab] = useState<string>(subTabs[0]);
    const [activeOnboardingTab, setActiveOnboardingTabsTab] = useState<string>(subOnboardingTabs[0]);

    return (
        <div className={styles.container}>
            {/* Main Tabs */}
            <Tabs
                value={activeMainTab}
                onChange={(val) => val && setActiveMainTab(val)}
                variant="outline"
            >
                <Tabs.List>
                    {mainTabs.map((tab) => (
                        <Tabs.Tab value={tab.label} key={tab.label} className={styles.tabWithBadge}>
                            {tab.label}
                            {!!tab.count && (
                                <Badge color="pink" size="sm" className={styles.tabBadge}>
                                    {tab.count}
                                </Badge>
                            )}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {mainTabs.map((tab) => (
                    <Tabs.Panel value={tab.label} key={tab.label} pt="md">
                        {tab.label === "Scheduling" && (
                            <Group gap="sm" m="lg">
                                {subTabs.map((sub) => (
                                    <Button
                                        key={sub}
                                        variant={activeSubTab === sub ? "filled" : "outline"}
                                        onClick={() => setActiveSubTab(sub)}
                                        size="xs"
                                    >
                                        {sub}
                                    </Button>
                                ))}
                            </Group>
                        )}
                        {tab.label === "Onboarding" && (
                            <Group gap="sm" m="lg">
                                {subOnboardingTabs.map((sub) => (
                                    <Button
                                        key={sub}
                                        variant={activeOnboardingTab === sub ? "filled" : "outline"}
                                        onClick={() => setActiveOnboardingTabsTab(sub)}
                                        size="xs"
                                    >
                                        {sub}
                                    </Button>
                                ))}
                            </Group>
                        )}
                        <UserTable />
                    </Tabs.Panel>
                ))}
            </Tabs>
        </div>
    );
}
