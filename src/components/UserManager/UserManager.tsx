'use client';

import { useEffect, useState } from 'react';
import styles from './UserManager.module.css';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function UserManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    };

    const addUser = async () => {
        if (!name || !email) return;
        setLoading(true);
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        });
        const newUser = await res.json();
        setUsers([...users, newUser]);
        setName('');
        setEmail('');
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className={styles.container}>
            <h2>Users</h2>

            <div className={styles.form}>
                <input
                    className={styles.inputField}
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className={styles.inputField}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className={styles.addButton}
                    onClick={addUser}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Add User'}
                </button>
            </div>

            <ul className={styles.userList}>
                {users.map((user) => (
                    <li key={user.id} className={styles.userListItem}>
                        {user.name} — {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
