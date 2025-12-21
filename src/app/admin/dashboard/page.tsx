'use client';

import { Badge, Progress } from '@mantine/core';
import { FaDownload, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { useAdminUsersInfo } from '@/client/hooks/_admin-users.hooks';
import styles from './page.module.css';

const MAX_REPORTS = 100;

export default function UsersTable() {
    const { data, isFetching } = useAdminUsersInfo();
    // const { data: stats, isLoading, error } = useStats();

    if (isFetching) return <>Loading...</>;
    if (!data?.users?.length) return <>No reports usage was detected</>;
    //
    // const rateLimits = stats?.rate_limits;
    // const usageStats = stats?.usage_statistics;

    // const requestsToday = rateLimits?.requests_today ?? 0;
    // const requestsPerDay = rateLimits?.requests_per_day ?? 1;
    // const remainingToday = rateLimits?.remaining_today ?? 0;
    // const totalRequestsAllTime = usageStats?.total_requests_all_time ?? 0;

    // const usedPercent = (requestsToday / requestsPerDay) * 100;

    return (
        <>
            {/*<Card shadow="md" radius="md" padding="lg" withBorder mb="xl">*/}
            {/*    <Stack gap="sm">*/}
            {/*        <Group justify="space-between">*/}
            {/*            <Title order={4}>Daily Usage</Title>*/}
            {/*            <Badge*/}
            {/*                color={*/}
            {/*                    usedPercent > 90 ? "red" : usedPercent > 70 ? "yellow" : "green"*/}
            {/*                }*/}
            {/*            >*/}
            {/*                {requestsToday} / {requestsPerDay} used*/}
            {/*            </Badge>*/}
            {/*        </Group>*/}

            {/*        <Progress*/}
            {/*            value={usedPercent}*/}
            {/*            color={*/}
            {/*                usedPercent > 90 ? "red" : usedPercent > 70 ? "yellow" : "green"*/}
            {/*            }*/}
            {/*            radius="xl"*/}
            {/*            size="lg"*/}
            {/*        />*/}

            {/*        <Group justify="space-between" mt="xs">*/}
            {/*            <Text size="sm" c="dimmed">*/}
            {/*                Remaining today:*/}
            {/*            </Text>*/}
            {/*            <Text fw={600}>{remainingToday}</Text>*/}
            {/*        </Group>*/}

            {/*        <Group justify="space-between">*/}
            {/*            <Text size="sm" c="dimmed">*/}
            {/*                Total reports (all time):*/}
            {/*            </Text>*/}
            {/*            <Text fw={600}>{totalRequestsAllTime}</Text>*/}
            {/*        </Group>*/}
            {/*    </Stack>*/}
            {/*</Card>*/}
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.flexRow}>
                        <FaIdCard size={24} />
                        <h2>User Activity Report</h2>
                    </div>
                    <div className={styles.flexRow}>
                        <FaEnvelope />
                        <span>{data?.users.length} Users</span>
                    </div>
                </div>

                <div className={styles.tableContent}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>
                                    <div className={styles.flexRow}>
                                        <FaIdCard color="#4f46e5" />
                                        <span>User ID</span>
                                    </div>
                                </th>
                                <th>
                                    <div className={styles.flexRow}>
                                        <FaEnvelope color="#a855f7" />
                                        <span>User Email</span>
                                    </div>
                                </th>
                                <th>
                                    <div className={styles.flexRow}>
                                        <FaDownload color="#06b6d4" />
                                        <span>Reports Downloaded</span>
                                    </div>
                                </th>
                                <th>
                                    <div className={styles.flexRow}>
                                        <FaDownload color="#06b6d4" />
                                        <span>Base info requests</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.users
                                .sort((a, b) => b.downloadedReports - a.downloadedReports)
                                .map((user) => {
                                    const isHigh = user.downloadedReports > MAX_REPORTS;
                                    return (
                                        <tr key={user.id}>
                                            <td className={styles.bodyTd}>
                                                <div className={styles.flexRow}>
                                                    <span>{user.id}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.flexRow}>
                                                    <span>{user.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.flexRow}>
                                                    <Badge
                                                        className={styles.badge}
                                                        color={isHigh ? 'red' : 'green'}
                                                        variant="filled"
                                                    >
                                                        {user.downloadedReports}
                                                    </Badge>
                                                    <Progress
                                                        color={isHigh ? 'red' : 'green'}
                                                        style={{ flex: 1 }}
                                                        value={Math.min(
                                                            (user.downloadedReports / MAX_REPORTS) * 100,
                                                            100
                                                        )}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.flexRow} style={{ justifyContent: 'center' }}>
                                                    <span>{user.baseInfoRequests}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
