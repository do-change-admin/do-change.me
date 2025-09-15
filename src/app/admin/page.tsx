"use client";

import { useState } from "react";
import { Tabs, Button, Group, Badge } from "@mantine/core";
import styles from "./layout.module.css";
import { UserTable } from "@/components";
import { useAuctionAccessRequests } from "./queries";
import type { AuctionAccessRequestStatus } from '@/services/auction-access-requests'

type MainTab = {
    label: string;
    count: number;
    status: AuctionAccessRequestStatus
}

const mainTabs: MainTab[] = [
    { label: "Review", count: 12, status: 'review' },
    { label: "Scheduling", count: 5, status: 'scheduling' },
    { label: "Onboarding", count: 3, status: 'onboarding' },
    { label: "Approved", count: 0, status: 'approved' },
    { label: "Rejected", count: 0, status: 'rejected' },
];

const subTabs = ["Awaiting User Confirmation", "Scheduled", "Call Completed - Awaiting Decision"];
const subOnboardingTabs = [
    "Awaiting Documents Upload",
    "Documents Under Review",
    "Corrections Required",
    "Ready for Auction Access",
];


export default function AuctionAccessPage() {
    const [activeStatus, setActiveStatus] = useState<AuctionAccessRequestStatus>(mainTabs[0].status);
    const [activeSubTab, setActiveSubTab] = useState<string>(subTabs[0]);
    const [activeOnboardingTab, setActiveOnboardingTabsTab] = useState<string>(subOnboardingTabs[0]);

    const { data: auctionAccessRequests } = useAuctionAccessRequests({ skip: 0, take: 100, status: activeStatus })

    console.log(auctionAccessRequests)

    return (
        <div className={styles.container}>
            {/* Main Tabs */}
            <Tabs
                value={activeStatus}
                onChange={(val) => val && setActiveStatus(val as AuctionAccessRequestStatus)}
                variant="outline"
            >
                <Tabs.List>
                    {mainTabs.map((tab) => (
                        <Tabs.Tab value={tab.status} key={tab.label} className={styles.tabWithBadge}>
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
