'use client';

import { Button, Group, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { AuctionAccessRequestStatus } from '@/backend/services/auction-access-requests';
import { UserTable } from '@/client/components';
import { useAdminAuctionAccessRequests } from '@/client/hooks';
import styles from './layout.module.css';

type Tab = {
    label: string;
    count?: number;
    status: AuctionAccessRequestStatus;
};

const mainTabs: Tab[] = [
    { label: 'Review', count: 12, status: 'review' },
    { label: 'Scheduling', count: 5, status: 'awaiting user confirmation' },
    { label: 'Onboarding', count: 3, status: 'awaiting documents upload' },
    { label: 'Approved', count: 0, status: 'approved' },
    { label: 'Rejected', count: 0, status: 'rejected' }
];

const subTabs: Tab[] = [
    {
        status: 'awaiting user confirmation',
        label: 'Awaiting User Confirmation'
    },
    {
        label: 'Scheduling',
        status: 'call scheduling'
    },
    {
        label: 'Call Completed - Awaiting Decision',
        status: 'call completed'
    }
];

const subOnboardingTabs: Tab[] = [
    {
        label: 'Awaiting Documents Upload',
        status: 'awaiting documents upload'
    },
    {
        label: 'Documents Under Review',
        status: 'documents under review'
    },
    {
        label: 'Corrections Required',
        status: 'corrections required'
    },
    {
        label: 'Ready for Auction Access',
        status: 'ready for auction access'
    }
];

export default function AuctionAccessPage() {
    const [status, setStatus] = useState<AuctionAccessRequestStatus>(mainTabs[0].status);

    const [activeStatus, setActiveStatus] = useState<AuctionAccessRequestStatus>(mainTabs[0].status);
    const [activeSubTab, setActiveSubTab] = useState<AuctionAccessRequestStatus>(subTabs[0].status);
    const [activeOnboardingTab, setActiveOnboardingTabsTab] = useState<AuctionAccessRequestStatus>(
        subOnboardingTabs[0].status
    );

    useEffect(() => {
        setStatus(activeSubTab);
    }, [activeSubTab]);

    useEffect(() => {
        setStatus(activeOnboardingTab);
    }, [activeOnboardingTab]);

    useEffect(() => {
        setStatus(activeStatus);
    }, [activeStatus]);

    const { data: auctionAccessRequests } = useAdminAuctionAccessRequests({ status });

    return (
        <div className={styles.container}>
            {/* Main Tabs */}
            <Tabs
                onChange={(val) => val && setActiveStatus(val as AuctionAccessRequestStatus)}
                value={activeStatus}
                variant="outline"
            >
                <Tabs.List>
                    {mainTabs.map((tab) => (
                        <Tabs.Tab className={styles.tabWithBadge} key={tab.label} value={tab.status}>
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
                    <Tabs.Panel key={tab.label} pt="md" value={tab.status}>
                        {tab.label === 'Scheduling' && (
                            <Group gap="sm" m="lg">
                                {subTabs.map(({ label, status }) => (
                                    <Button
                                        key={status}
                                        onClick={() => setActiveSubTab(status)}
                                        size="xs"
                                        variant={activeSubTab === status ? 'filled' : 'outline'}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Group>
                        )}
                        {tab.label === 'Onboarding' && (
                            <Group gap="sm" m="lg">
                                {subOnboardingTabs.map(({ label, status }) => (
                                    <Button
                                        key={status}
                                        onClick={() => setActiveOnboardingTabsTab(status)}
                                        size="xs"
                                        variant={activeOnboardingTab === status ? 'filled' : 'outline'}
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
