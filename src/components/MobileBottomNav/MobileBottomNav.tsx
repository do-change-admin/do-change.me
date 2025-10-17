'use client';

import React, { FC } from 'react';
import styles from './MobileBottomNav.module.css';
import { useScanner, useSlideMenu } from '@/contexts';
import { AuctionsServicesCards, Chat, SubscriptionPlans } from '@/components';
import { useNavMenu, useProfile } from '@/hooks';
import { FaQrcode } from 'react-icons/fa';
import { useDisclosure } from '@mantine/hooks';

export const MobileBottomNav = () => {
    const { start } = useScanner();
    const { data } = useProfile()
    const { openMenu } = useSlideMenu();

    const handleOpenMenu = () => {
        openMenu(<AuctionsServicesCards />);
    };

    const [opened, { open, close }] = useDisclosure(false);

    const scannerOnClick = () => {
        if (!data?.subscription) {
            open()
            return;
        }
        start()
    }

    const { navLinks, handleClick } = useNavMenu(handleOpenMenu);


    const firstHalf = navLinks.slice(0, 2);
    const secondHalf = navLinks.slice(2);

    return (
        <footer className={styles.footer}>
            <SubscriptionPlans opened={opened} close={close} />

            <div className={styles.container}>
                <div className={styles.buttonsWrapper}>
                    {firstHalf.map((nav) => (
                        <button key={nav.href} className={styles.button} onClick={() => handleClick(nav)}>
                            {nav.icon}
                            <span className={styles.label}>{nav.label}</span>
                        </button>
                    ))}

                    {/* Scanner Button (Center) */}
                    <button className={styles.scannerButton} onClick={scannerOnClick}>
                        <FaQrcode className={styles.scannerIcon} />
                    </button>

                    {secondHalf.map((nav) => (
                        <button key={nav.href} className={styles.button} onClick={() => handleClick(nav)}>
                            {nav.icon}
                            <span className={styles.label}>{nav.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </footer>
    );
};
