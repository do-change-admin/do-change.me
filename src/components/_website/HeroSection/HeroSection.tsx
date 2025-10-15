import styles from './HeroSection.module.css';
import {
    FaCar,
    FaSearch,
    FaBarcode,
    FaGavel,
    FaCheckCircle,
    FaBroadcastTower, FaTools
} from 'react-icons/fa';

export const HeroSection = () => {
    return (
        <main id="hero-main" className={styles.main}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left column */}
                    <div className={styles.spaceY8}>
                        <h1 className={styles.title}>
                            Unlock Your Path to
                            <span>Profitable Car Deals</span>
                        </h1>
                        <p className={styles.text}>
                            Gain access to dealer-only auctions, pro-level tools, and insider market data.
                            Buy cars at unbeatable prices and resell them for profit — all through our platform.
                        </p>


                        <div className={styles.btnGroup}>
                            <button className={styles.btnPrimary}>
                                <FaCar />
                                <span>Start Free Trial</span>
                            </button>
                            <button className={styles.btnSecondary}>
                                <FaSearch />
                                <span>Watch Demo</span>
                            </button>
                        </div>
                        <div className={styles.powerToolsWrapper}>
                            <div className={styles.powerToolsHeader}>
                                <div className={styles.powerToolsIconCircle}>
                                    <FaTools className={styles.powerToolsIconMain} />
                                </div>
                                <h3 className={styles.powerToolsTitle}>Power Tools Suite</h3>
                            </div>

                            <div className={styles.powerToolsGrid}>
                                <div className={styles.powerToolCard}>
                                    <div className={styles.powerToolCardHeader}>
                                        <FaBarcode className={styles.powerToolIcon} />
                                        <span className={styles.powerToolCardTitle}>VIN Decoder</span>
                                    </div>
                                    <p className={styles.powerToolCardText}>Vehicle history</p>
                                </div>

                                <div className={styles.powerToolCard}>
                                    <div className={styles.powerToolCardHeader}>
                                        <FaBroadcastTower className={styles.powerToolIcon} />
                                        <span className={styles.powerToolCardTitle}>Marketplace Hub</span>
                                    </div>
                                    <p className={styles.powerToolCardText}>Auto-publish</p>
                                </div>

                                <div className={styles.powerToolCard}>
                                    <div className={styles.powerToolCardHeader}>
                                        <FaGavel className={styles.powerToolIcon} />
                                        <span className={styles.powerToolCardTitle}>Auction Access</span>
                                    </div>
                                    <p className={styles.powerToolCardText}>Live bidding</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className={styles.imageWrapper}>
                        <div className={styles.imageInner}>
                            <div className={styles.bgCard}></div>
                            <div className={styles.card}>
                                <div className={styles.cardImage}>
                                    <img src="https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/fguXjCi1OPQ4Am71VSwhbOnOEKCeBoyIzT6DTefU.jpg" alt="Luxury Car" />
                                </div>
                                <div className={styles.spaceY4}>
                                    <div className={styles.cardTitle}>
                                        <div>2025 Luxury Sedan</div>
                                        <div>$45,999</div>
                                        <div className={styles.cardTags}>
                                            <div className={styles.cardTag}>Low Miles</div>
                                            <div className={styles.cardTag}>Certified</div>
                                            <div className={styles.cardMeta}>
                                                <FaCheckCircle />
                                                <span>VIN Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.statsWrapper}>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>50+</div>
                                <div className={styles.statLabel}>Databases Integrated</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>8+</div>
                                <div className={styles.statLabel}>Marketplaces Supported</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>25+</div>
                                <div className={styles.statLabel}>Auctions Access</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
