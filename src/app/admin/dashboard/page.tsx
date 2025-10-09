"use client";

import styles from "./page.module.css";
import { FaIdCard, FaEnvelope, FaDownload } from "react-icons/fa";
import { Progress, Badge } from "@mantine/core";
import { useAdminUsersInfo } from "@/hooks/_admin-users.hooks";
import {useEffect, useState} from "react";

type StatsResponse = {
    user_info: {
        email: string;
        plan: string;
        total_requests: number;
        account_created: string;
        last_request: string;
    };
    current_usage: {
        requests_this_hour: number;
        requests_today: number;
    };
    rate_limits: {
        requests_per_hour: number;
        requests_per_day: number;
        remaining_this_hour: number;
        remaining_today: number;
    };
    status: {
        active: boolean;
        within_hourly_limit: boolean;
        within_daily_limit: boolean;
    };
};

const MAX_REPORTS = 100

const apiKey = process.env.REPORT_KEY || '';
const baseURL = process.env.REPORT_ENDPOINT;


export default function UsersTable() {
    const { data, isFetching } = useAdminUsersInfo();
    // const [stats, setStats] = useState<StatsResponse | null>(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    //
    // useEffect(() => {
    //     async function fetchStats() {
    //         try {
    //             const response = await fetch(`${baseURL}/api/stats`, {
    //                 headers: {
    //                     "X-API-Key": apiKey,
    //                     "Content-Type": "application/json",
    //                 },
    //             });
    //
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //
    //             const data: StatsResponse = await response.json();
    //             setStats(data);
    //         } catch (err: any) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //
    //     fetchStats();
    // }, []);
    //
    // console.log(stats);
    //
    // if (loading) return <p>Loading stats...</p>;
    // if (error) return <p>Error: {error}</p>;
    if (isFetching) return <>Loading...</>;
    if (!data?.users.length) return <>No reports usage was detected</>;

    return (
        <div className={styles.tableContainer}>
            {/* Header */}
            <div className={styles.tableHeader}>
                <div className={styles.flexRow}>
                    <FaIdCard size={24} />
                    <h2>User Activity Report</h2>
                </div>
                <div className={styles.flexRow}>
                    <FaEnvelope />
                    <span>{data.users.length} Users</span>
                </div>
            </div>

            {/* Table */}
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
                    </tr>
                    </thead>
                    <tbody>
                    {data.users.map((user) => {
                        const isHigh = user.downloadedReports > MAX_REPORTS;
                        return (
                            <tr key={user.id} >
                                <td className={styles.bodyTd} >
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
                                            color={isHigh ? "red" : "green"}
                                            variant="filled"
                                            className={styles.badge}
                                        >
                                            {user.downloadedReports}
                                        </Badge>
                                        <Progress
                                            value={Math.min(user.downloadedReports, MAX_REPORTS)}
                                            color={isHigh ? "red" : "green"}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
