'use client';

import React from 'react';
import styles from './MobileBottomNav.module.css';
import { useScanner, useSlideMenu } from '@/contexts';
import { AuctionsServicesCards } from '@/components';
import { useNavMenu } from '@/hooks';
import { FaQrcode } from 'react-icons/fa';

export const MobileBottomNav = () => {
    const { start } = useScanner();
    const { openMenu } = useSlideMenu();

    const handleOpenMenu = () => {
        openMenu(<AuctionsServicesCards />);
    };

    const { navLinks, handleClick } = useNavMenu(handleOpenMenu);


    const firstHalf = navLinks.slice(0, 2);
    const secondHalf = navLinks.slice(2);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.buttonsWrapper}>
                    {firstHalf.map((nav) => (
                        <button  key={nav.href} className={styles.button} onClick={() => handleClick(nav)}>
                            {nav.icon}
                            <span className={styles.label}>{nav.label}</span>
                        </button>
                    ))}

                    {/* Scanner Button (Center) */}
                    <button className={styles.scannerButton} onClick={start}>
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
