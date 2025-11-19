"use client";

import React, { useState } from "react";
import { TextInput, Pagination, Skeleton, Loader, Text } from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import styles from "./Table.module.css";

export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    icon?: React.ReactNode;
    width?: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface TableProps<T> {
    title?: string;
    iconLeft?: React.ReactNode;
    data: T[];
    columns: ColumnConfig<T>[];
    sortBy?: keyof T;
    sortDir?: "asc" | "desc";
    onSort?: (key: keyof T) => void;
    rowsPerPage?: number;
    loading?: boolean; // 👈 Новое
}

export function Table<T extends { id: string | number }>({
                                                             title,
                                                             iconLeft,
                                                             data,
                                                             columns,
                                                             sortBy,
                                                             sortDir,
                                                             onSort,
                                                             rowsPerPage = 10,
                                                             loading = false
                                                         }: TableProps<T>) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const filtered = data.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className={styles.flexRow}>
                    {title && <h3>{iconLeft} {title}</h3>}
                    <Text size="sm" c="white" opacity={0.85}>
                        Total: {loading ? "…" : data.length}
                    </Text>
                </div>
            </div>

            <div className={styles.searchBox}>
                <TextInput
                    radius="lg"
                    placeholder="Search..."
                    leftSection={<FiSearch size={16} />}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <div className={styles.skeletonWrapper}>
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} height={40} mt="md" radius="sm" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                // EMPTY STATE
                <div className={styles.emptyState}>
                    <Loader size="lg" />
                    <p>No results found. Try adjusting your search or filters.</p>
                </div>
            ) : (
                <>
                    {/* TABLE */}
                    <div className={styles.tableContent}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        style={{ width: col.width }}
                                        onClick={() => col.sortable && onSort?.(col.key)}
                                        className={col.sortable ? styles.sortable : ""}
                                    >
                                        <div className={styles.flexRow}>
                                            {col.icon}
                                            <span>{col.label}</span>

                                            {col.sortable && sortBy === col.key && (
                                                <span className={styles.sortArrow}>
                            {sortDir === "asc" ? "▲" : "▼"}
                          </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            {paginated.map((item) => (
                                <tr key={item.id}>
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className={styles.bodyTd}>
                                            <div className={styles.flexRow}>
                                                {col.render ? col.render(item) : (item[col.key] as any)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className={styles.paginationWrapper}>
                        <Pagination
                            total={Math.ceil(filtered.length / rowsPerPage)}
                            value={page}
                            onChange={setPage}
                            size="md"
                            radius="md"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
