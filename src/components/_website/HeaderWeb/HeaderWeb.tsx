"use client";
import Link from "next/link";
import styles from "./HeaderWeb.module.css";
import {FaArrowLeft, FaArrowRight, FaPowerOff} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export const HeaderWeb = () => {
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const arrowIcon = isOpen ?  <FaArrowLeft className={styles.arrow} color="white" onClick={() => setIsOpen(false)}/> :  <FaArrowRight  className={styles.arrow} color="white" onClick={() => setIsOpen(true)}/>;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <header className={styles.header}>
            <div className={`${styles.bg} ${scrolled ? styles.active : ""} ${isOpen ? styles.open : ""}`}>
                {arrowIcon}
            </div>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <nav className={styles.nav}>
                        <Link href="#how-it-works" className={`${styles.link} ${scrolled ? styles.scrolled : ""} ${isOpen ? styles.open : ""}`}>
                            How It Works
                        </Link>
                        <Link href="#pricing" className={`${styles.link} ${scrolled ? styles.scrolled : ""} ${isOpen ? styles.open : ""}`}>
                            Pricing
                        </Link>
                        <Link href="#footer" className={`${styles.link} ${scrolled ? styles.scrolled : ""} ${isOpen ? styles.open : ""}`}>
                            Contact
                        </Link>
                    </nav>
                    <button onClick={() => router.push('/space/reports')} className={styles.button}>
                        <FaPowerOff size={20} color="white" />
                    </button>
                </div>
            </div>
        </header>
    );
}
