"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stack, Box } from "@mantine/core";
import styles from "./AdminSideBar.module.css";

const links = [
    { label: "Auction Access", href: "/admin" },
    { label: "Syndication", href: "/admin/syndication" },
];

export const AdminSideBar = () => {
    const pathname = usePathname();

    return (
        <Box className={styles.sidebar}>
            <div className={styles.logo}>do-change</div>
            <Stack gap="xs" p={16}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.link} ${
                            pathname === link.href ? styles.active : ""
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </Stack>
        </Box>
    );
}
