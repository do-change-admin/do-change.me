"use client";

import styles from "./UserTable.module.css";
import { FiSearch, FiEdit, FiTrash2, FiFilter } from "react-icons/fi";
import { useRouter } from "next/navigation";
import type { AuctionAccessRequestListItem } from '@/services'
import { FC } from "react";
import { motion } from "framer-motion";
import {FaInbox} from "react-icons/fa";

export type UserTableProps = {
    requests: AuctionAccessRequestListItem[]
}

export const UserTable: FC<UserTableProps> = ({ requests }) => {
    const router = useRouter();
    if (!requests.length) {
        return <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.emptyState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <FaInbox className={styles.emptyIcon} />
                    <h5 className={styles.emptyText}>
                        No users found with this status
                    </h5>
                </motion.div>
            </div>
        </section>
    }
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>Photo</th>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Date of Birth</th>
                                <th className={styles.th}>Date</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {requests.map(request => (
                                <tr key={request.id} onClick={() => router.push(`/admin/${request.id}`)}>
                                    <td className={styles.td}>
                                        <img src={request.photoLink} alt={request.firstName} className={styles.avatar} />
                                    </td>
                                    <td className={styles.td}>
                                        <div>{request.firstName} {request.lastName}</div>
                                        <div className={styles.email}>{request.email}</div>
                                    </td>
                                    <td className={styles.td}>{new Date(request.birthDate).toDateString()}</td>
                                    <td className={styles.td}>{new Date(request.applicationDate).toDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* <div className={styles.footer}>
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">47</span> results
                    </div>
                    <div className={styles.pagination}>
                        <button className={styles.pageBtn}>Previous</button>
                        <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                        <button className={styles.pageBtn}>2</button>
                        <button className={styles.pageBtn}>3</button>
                        <button className={styles.pageBtn}>Next</button>
                    </div>
                </div> */}
            </div>
        </section>
    );
}
