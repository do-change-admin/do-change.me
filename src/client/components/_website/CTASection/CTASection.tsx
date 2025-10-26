import styles from "./CTASection.module.css";
import Link from "next/link";

export const CTASection = ()=> {
    return (
        <section id="cta" className={styles.ctaSection}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Ready to Get Started?</h2>
                <p className={styles.subheading}>
                    Join thousands of professionals who trust LotSpace for accurate vehicle reports.
                </p>
                <div className={styles.buttons}>
                    <Link href="#" className={styles.primaryButton}>
                        Start Free Trial
                    </Link>
                    <Link href="#" className={styles.secondaryButton}>
                        Contact Sales
                    </Link>
                </div>
            </div>
        </section>
    );
}
