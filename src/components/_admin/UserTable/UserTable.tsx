"use client";

import styles from "./UserTable.module.css";
import { FiSearch, FiEdit, FiTrash2, FiFilter } from "react-icons/fi";
import { useRouter } from "next/navigation";

const users = [
    {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        dob: "March 15, 1990",
        date: "April 17, 1991",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
    },
    {
        id: 2,
        name: "Michael Chen",
        email: "michael.chen@email.com",
        dob: "July 22, 1985",
        date: "April 17, 1991",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        dob: "December 8, 1992",
        date: "April 17, 1991",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
    },
    {
        id: 4,
        name: "David Wilson",
        email: "david.wilson@email.com",
        dob: "September 3, 1988",
        date: "April 17, 1991",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
    },
    {
        id: 5,
        name: "Lisa Thompson",
        email: "lisa.thompson@email.com",
        dob: "April 17, 1991",
        date: "April 17, 1991",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
    },
];

export const UserTable = () => {
    const router = useRouter();
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
                            {users.map(user => (
                                <tr key={user.id} onClick={() => router.push(`/admin/${user.id}`)}>
                                    <td className={styles.td}>
                                        <img src={user.avatar} alt={user.name} className={styles.avatar} />
                                    </td>
                                    <td className={styles.td}>
                                        <div>{user.name}</div>
                                        <div className={styles.email}>{user.email}</div>
                                    </td>
                                    <td className={styles.td}>{user.date}</td>
                                    <td className={styles.td}>{user.dob}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.footer}>
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
                </div>
            </div>
        </section>
    );
}
