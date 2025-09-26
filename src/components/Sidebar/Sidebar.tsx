"use client";

import React from "react";
import cn from "classnames";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";
import {FaSignOutAlt} from "react-icons/fa";
import {usePathname} from "next/navigation";
import { AuctionsServicesCards} from "@/components";
import {useSlideMenu} from "@/contexts";
import {useNavMenu, useProfile} from "@/hooks";
import {Avatar} from "@mantine/core";


export const Sidebar = () => {
    const { openMenu } = useSlideMenu();
    const { data: profileData } = useProfile()

    const handleOpenMenu = () => {
        openMenu(<AuctionsServicesCards/>);
    };
    const { navLinks, handleClick } = useNavMenu(handleOpenMenu);
    const pathname = usePathname();


    return (
        <>
            <div className={styles.sidebar}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        <Avatar
                            src={profileData?.photoLink}
                            alt="User Avatar"
                            radius="xl"
                            size={48}
                        />
                        <div className={styles.onlineDot}></div>
                    </div>
                    <h3 className={styles.userNameCollapsed}>
                        {profileData?.firstName}
                    </h3>
                </div>

                {/* Navigation */}
                <div className={styles.navLinks}>
                    {navLinks.map((link, index) => (
                        <div
                            key={index}
                            className={cn(styles.link, {
                                [styles.linkActive]:link.href === "/"
                                    ? pathname === "/" // главная строго
                                    : pathname.startsWith(link.href),
                            })}
                            onClick={() => handleClick(link)}
                            role="button"
                            tabIndex={0}
                        >
                            {link.icon}
                            {link.label}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button
                      className={styles.logout}
                      onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    >
                        <FaSignOutAlt/>
                    </button>
                </div>
            </div>
        </>
    );
};
