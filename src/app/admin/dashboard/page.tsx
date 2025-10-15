"use client";

import styles from "./page.module.css";
import { FaIdCard, FaEnvelope, FaDownload } from "react-icons/fa";
import { Progress, Badge } from "@mantine/core";
import { useAdminUsersInfo } from "@/hooks/_admin-users.hooks";
import {useEffect, useState} from "react";
import {useStats} from "@/hooks";

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
    const { data: stats, isLoading, error } = useStats();
    console.log(stats)
    if (isFetching) return <>Loading...</>;
    if (!data?.users.length) return <>No reports usage was detected</>;

    return (
        <div className={styles.tableContainer}>
            {/* HeaderWeb */}
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
                    {data.users.sort((a, b) => b.downloadedReports - a.downloadedReports).map((user) => {
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
