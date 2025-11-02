import styles from "./FooterWeb.module.css";
import { FaFacebook, FaLinkedin, FaTwitter} from "react-icons/fa";
import Link from "next/link";

export const FooterWeb =() => {
    return (
        <footer id="footer" className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.brandHeader}>
                            <h3 className={styles.brandTitle}>do-change</h3>
                        </div>
                        <p className={styles.description}>
                            Do-Change is your all-in-one platform for smart car ownership and trading. Instantly check real market values, scan VINs or license plates, explore detailed vehicle history reports, manage your profile and subscriptions, sell your cars, and access exclusive auctions — all in one convenient place.
                        </p>
                        <div className={styles.socialIcons}>
                            <FaTwitter />
                            <FaLinkedin />
                            <FaFacebook />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Product</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/#mob-section">Features</Link></li>
                            <li><Link href="/#pricing">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Support</h4>
                        <ul className={styles.linkList}>
                            <li><span>admin@do-change.com</span></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Legal</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/legal#terms">Terms of Service</Link></li>
                            <li><Link href="/legal#privacy">Privacy Policy</Link></li>
                            <li><Link href="/legal#refund">Refund Policy</Link></li>
                            <li><Link href="/legal#cookies">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; 2025 do-change. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
