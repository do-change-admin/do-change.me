'use client';
import { Image } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './HeaderWeb.module.css';

export const HeaderWeb = () => {
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const arrowIcon = isOpen ? (
        <FaArrowLeft className={styles.arrow} color="white" onClick={() => setIsOpen(false)} />
    ) : (
        <FaArrowRight className={styles.arrow} color="white" onClick={() => setIsOpen(true)} />
    );

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <header className={styles.header}>
            <div className={`${styles.bg} ${scrolled ? styles.active : ''} ${isOpen ? styles.open : ''}`}>
                {arrowIcon}
            </div>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <nav className={styles.nav}>
                        <Link
                            className={`${styles.name} ${scrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}
                            href="/home"
                        >
                            <Image alt="DoChange logo" h={40} src="/logo/logo.png" w="auto" />
                        </Link>
                        <Link
                            className={`${styles.link} ${scrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}
                            href="#how-it-works"
                        >
                            How It Works
                        </Link>
                        <Link
                            className={`${styles.link} ${scrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}
                            href="#pricing"
                        >
                            Pricing
                        </Link>
                        <Link
                            className={`${styles.link} ${scrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}
                            href="#footer"
                        >
                            Contact
                        </Link>
                    </nav>
                    <button className={styles.button} onClick={() => router.push('/auth/login')} type="button">
                        <AiOutlineLogin color="white" size={30} />
                    </button>
                </div>
            </div>
        </header>
    );
};
