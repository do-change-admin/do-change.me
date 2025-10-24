"use client";

import { useEffect, useState } from "react";
import { Tabs, Button, Group, Badge } from "@mantine/core";
import styles from "./layout.module.css";
import { UserTable } from "@/components";
import {
    useAdminAuctionAccessCount,
    useAdminAuctionAccessRequests,
} from "@/hooks";
import type { AuctionAccessRequestStatus } from "@/services/auction-access-requests";

type Tab = {
    label: string;
    count?: number;
    status: AuctionAccessRequestStatus;
};

const mainTabs: Tab[] = [
    { label: "Review", count: 12, status: "review" },
    { label: "Scheduling", count: 5, status: "awaiting user confirmation" },
    { label: "Onboarding", count: 3, status: "awaiting documents upload" },
    { label: "Approved", count: 0, status: "approved" },
    { label: "Rejected", count: 0, status: "rejected" },
];

const subTabs: Tab[] = [
    {
        status: "awaiting user confirmation",
        label: "Awaiting User Confirmation",
    },
    {
        label: "Scheduling",
        status: "call scheduling",
    },
    {
        label: "Call Completed - Awaiting Decision",
        status: "call completed",
    },
];

const subOnboardingTabs: Tab[] = [
    {
        label: "Awaiting Documents Upload",
        status: "awaiting documents upload",
    },
    {
        label: "Documents Under Review",
        status: "documents under review",
    },
    {
        label: "Corrections Required",
        status: "corrections required",
    },
    {
        label: "Ready for Auction Access",
        status: "ready for auction access",
    },
];

export default function AuctionAccessPage() {
    const [status, setStatus] = useState<AuctionAccessRequestStatus>(
        mainTabs[0].status
    );

    const [activeStatus, setActiveStatus] =
        useState<AuctionAccessRequestStatus>(mainTabs[0].status);
    const [activeSubTab, setActiveSubTab] =
        useState<AuctionAccessRequestStatus>(subTabs[0].status);
    const [activeOnboardingTab, setActiveOnboardingTabsTab] =
        useState<AuctionAccessRequestStatus>(subOnboardingTabs[0].status);

    const { data: groupedCount } = useAdminAuctionAccessCount();

    useEffect(() => {
        setStatus(activeSubTab);
    }, [activeSubTab]);

    useEffect(() => {
        setStatus(activeOnboardingTab);
    }, [activeOnboardingTab]);

    useEffect(() => {
        setStatus(activeStatus)
    }, [activeStatus])


    const { data: auctionAccessRequests } = useAdminAuctionAccessRequests({ status })


    return (
        <div className={styles.container}>
            {/* Main Tabs */}
            <Tabs
                value={activeStatus}
                onChange={(val) =>
                    val && setActiveStatus(val as AuctionAccessRequestStatus)
                }
                variant="outline"
            >
                <Tabs.List>
                    {mainTabs.map((tab) => (
                        <Tabs.Tab
                            value={tab.status}
                            key={tab.label}
                            className={styles.tabWithBadge}
                        >
                            {tab.label}
                            {/*{!!groupedCount[tab?.label?.toLowerCase()] && (*/}
                            {/*    <Badge color="pink" size="sm" className={styles.tabBadge}>*/}
                            {/*        {groupedCount[tab?.label?.toLowerCase()]}*/}
                            {/*    </Badge>*/}
                            {/*)}*/}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {mainTabs.map((tab) => (
                    <Tabs.Panel value={tab.status} key={tab.label} pt="md">
                        {tab.label === "Scheduling" && (
                            <Group gap="sm" m="lg">
                                {subTabs.map(({ label, status }) => (
                                    <Button
                                        key={status}
                                        variant={
                                            activeSubTab === status
                                                ? "filled"
                                                : "outline"
                                        }
                                        onClick={() => setActiveSubTab(status)}
                                        size="xs"
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Group>
                        )}
                        {tab.label === "Onboarding" && (
                            <Group gap="sm" m="lg">
                                {subOnboardingTabs.map(({ label, status }) => (
                                    <Button
                                        key={status}
                                        variant={
                                            activeOnboardingTab === status
                                                ? "filled"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setActiveOnboardingTabsTab(status)
                                        }
                                        size="xs"
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Group>
                        )}
                    </Tabs.Panel>
                ))}
            </Tabs>
            <UserTable requests={auctionAccessRequests?.items ?? []} />
        </div>
    );
}
