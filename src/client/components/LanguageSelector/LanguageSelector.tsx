'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';
import styles from './LanguageSelector.module.css';
import { useLocalesStore } from '@/client/stores/locales.store';

type LangOption = {
    code: string;
    countryCode: string;
    name: string;
};

const LANGUAGES: LangOption[] = [
    { code: 'en', countryCode: 'US', name: 'English' },
    { code: 'es', countryCode: 'ES', name: 'Español' },
    // { code: 'hy', countryCode: 'AM', name: 'Հայերեն' },
    { code: 'ru', countryCode: 'RU', name: 'Русский' },
];

export const LanguageSelector = () => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<LangOption>(LANGUAGES[0]);
    const { locale, setLocale } = useLocalesStore();

    useEffect(() => {
        const saved = locale;
        if (saved) {
            const lang = LANGUAGES.find(l => l.code === saved);
            if (lang) setLocale(lang.code);
        }
    }, []);

    const handleSelect = (lang: LangOption) => {
        setCurrent(lang);
        setLocale(lang.code);
        setOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.relative}>
                <button onClick={() => setOpen((p) => !p)} className={styles.toggle}>
                    <ReactCountryFlag
                        countryCode={current.countryCode}
                        svg
                        className={styles.flag}
                    />
                    <span className={styles.lang}>{current.name}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <FaChevronDown className={styles.arrow} />
                    </motion.span>
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={styles.dropdown}
                        >
                            {LANGUAGES.map((lang) => (
                                <button key={lang.code} className={styles.option} onClick={() => handleSelect(lang)}>
                                    <ReactCountryFlag
                                        countryCode={lang.countryCode}
                                        svg
                                        className={styles.flag}
                                    />
                                    <span className={styles.langInner}>{lang.name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}