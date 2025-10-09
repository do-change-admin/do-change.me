"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stack, Box, Group, Text } from "@mantine/core";
import { FaTachometerAlt, FaLayerGroup, FaClipboardList } from "react-icons/fa";
import styles from "./AdminSideBar.module.css";

const links = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { label: "Auction Access", href: "/admin", icon: <FaClipboardList /> },
    { label: "SDK", href: "/admin/sdk", icon: <FaLayerGroup /> },
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
                        <Group gap="sm">
                            {link.icon}
                            <Text>{link.label}</Text>
                        </Group>
                    </Link>
                ))}
            </Stack>
        </Box>
    );
};
