"use client";

import React from "react";
import cn from "classnames";
import styles from "./Sidebar.module.css";
import {usePathname} from "next/navigation";
import {AuctionAccess, AuctionsServicesCards} from "@/components";
import {useSlideMenu} from "@/contexts";
import {useNavMenu, useProfile} from "@/hooks";
import {ActionIcon, Avatar, Image} from "@mantine/core";


export const Sidebar = () => {
    const { openMenu, isOpen, closeMenu } = useSlideMenu();
    const { data: profileData } = useProfile()

    const handleOpenMenu = () => {
        openMenu(<AuctionsServicesCards/>);
    };


    const handleOpenAuctionAccess = () => {
        openMenu(<AuctionAccess/>);
    };

    const { navLinks, handleClick } = useNavMenu(handleOpenMenu);
    const pathname = usePathname();


    return (
        <>
            <div className={styles.sidebar}>
                {/* HeaderWeb */}
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
                            onClick={() => {
                                handleClick(link)
                                if (isOpen) {
                                    closeMenu()
                                }
                            }}
                            role="button"
                            tabIndex={0}
                        >
                            {link.icon}
                            {link.label}
                        </div>
                    ))}
                </div>

                {/* FooterWeb */}
                <div className={styles.footer}>
                    {/*<button*/}
                    {/*  className={styles.logout}*/}
                    {/*  onClick={() => signOut({ callbackUrl: "/auth/login" })}*/}
                    {/*>*/}
                    {/*    <FaSignOutAlt/>*/}
                    {/*</button>*/}
                    <ActionIcon
                        className={styles.auctionButton}
                        onClick={handleOpenAuctionAccess}
                        p="lg"
                        radius="lg"
                        bg="white"
                    >
                        <Image src="/auctionAccessIcon.png" w={40} h={40}/>
                    </ActionIcon>
                </div>
            </div>
        </>
    );
};
