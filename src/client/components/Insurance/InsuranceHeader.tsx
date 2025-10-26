'use client';

import { FaSlidersH } from 'react-icons/fa';
import styles from './InsuranceHeader.module.css';
import {FC} from "react";

export interface InsuranceHeaderProps {
    openFilters: () => void
}
export const InsuranceHeader:FC<InsuranceHeaderProps> = ({openFilters}) => {
    return (
        <header className={styles.header}>
            {/* Background Image */}
            <div className={styles.background}>
                <img
                    src='/bg.png'
                    alt="luxury car auction warehouse with rows of premium vehicles, dramatic lighting, wide angle photography"
                    className={styles.bgImage}
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Decorative Shapes */}
            <div className={styles.shapeTopRight}></div>
            <div className={styles.shapeBottomLeft}></div>
            <div className={styles.shapeMiddle}></div>

            {/* Geometric Shapes */}
            <div className={styles.geoTop}></div>
            <div className={styles.geoBottom}></div>

            {/* HeaderWeb Content */}
            <div className={styles.contentWrapper}>
                <div className={styles.content}>
                    <div>
                    <h1 className={styles.title}>
                        Insurance{' '}
                        <span className={styles.gradientText}>Auctions</span>
                    </h1>

                    <p className={styles.description}>
                        Access over <span className={styles.highlight}>140+ U.S.</span> insurance auto auctions, including top names like{' '}
                        <span className={styles.whiteText}>Copart</span> and <span className={styles.whiteText}>IAA</span>
                    </p>
                    </div>
                    {/* Filter Button */}
                    <button className={styles.filterButton} onClick={openFilters}>
                        <FaSlidersH className={styles.filterIcon} />
                        <span>Open Filters</span>
                    </button>
                </div>
            </div>

            {/* Floating Elements */}
            <div className={styles.floating1}></div>
            <div className={styles.floating2}></div>
        </header>
    );
};
