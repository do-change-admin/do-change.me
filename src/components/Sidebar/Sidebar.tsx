"use client";

import React from "react";
import cn from "classnames";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";
import {FaSignOutAlt} from "react-icons/fa";
import {usePathname} from "next/navigation";
import {AuctionServicesCards} from "@/components/AuctionsServicesCards/AuctionsServicesCards";
import {useSlideMenu} from "@/contexts";
import {useNavMenu} from "@/hooks";


export const Sidebar = () => {
    const { openMenu } = useSlideMenu();

    const handleOpenMenu = () => {
        openMenu(<AuctionServicesCards/>);
    };
    const { navLinks, handleClick } = useNavMenu(handleOpenMenu);
    const pathname = usePathname();




    return (
        <>
            <div className={styles.sidebar}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                            alt="User Avatar"
                            className={styles.avatar}
                        />
                        <div className={styles.onlineDot}></div>
                    </div>
                    <h3 className={styles.userNameCollapsed}>
                        Razmik
                    </h3>
                </div>

                {/* Navigation */}
                <div className={styles.navLinks}>
                    {navLinks.map((link, index) => (
                        <div
                            key={index}
                            className={cn(styles.link, {
                                [styles.linkActive]: link.href === pathname
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
