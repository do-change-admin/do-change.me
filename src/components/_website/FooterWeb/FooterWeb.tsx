import styles from "./FooterWeb.module.css";
import {FaCar, FaFacebook, FaLinkedin, FaTwitter} from "react-icons/fa";
import Link from "next/link";

export const FooterWeb =() => {
    return (
        <footer id="footer" className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.brandHeader}>
                            <div className={styles.iconWrapper}>
                                <FaCar className={styles.icon} />
                            </div>
                            <h3 className={styles.brandTitle}>LotSpace</h3>
                        </div>
                        <p className={styles.description}>
                            The most trusted VIN scanning and vehicle report platform for professionals.
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
                            <li><span>Features</span></li>
                            <li><span>Pricing</span></li>
                            <li><span>API</span></li>
                            <li><span>Mobile App</span></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Support</h4>
                        <ul className={styles.linkList}>
                            <li><span>Help Center</span></li>
                            <li><span>Contact Us</span></li>
                            <li><span>Status</span></li>
                            <li><span>Documentation</span></li>
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
                    <p>&copy; 2024 LotSpace. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
