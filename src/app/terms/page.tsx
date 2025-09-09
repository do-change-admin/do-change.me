"use client";

import { Tabs } from "@mantine/core";
import { FaFileContract, FaUserShield } from "react-icons/fa";
import styles from "./TermsPage.module.css";

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Legal Documents</h1>
            <Tabs defaultValue="terms" className={styles.tabs}>
                <Tabs.List className={styles.tabList}>
                    <Tabs.Tab
                        value="terms"
                        leftSection={<FaFileContract />}
                        className={styles.tab}
                    >
                        Terms of Service
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="privacy"
                        leftSection={<FaUserShield />}
                        className={styles.tab}
                    >
                        Privacy Policy
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="terms" className={styles.panel}>
                    <h2>Terms of Service</h2>
                    <p><strong>Last updated:</strong> 09.09.2025</p>

                    <p>
                        By accessing or using our platform (“Service”), you agree to be
                        bound by these Terms of Service. If you do not agree, you may not
                        use the Service.
                    </p>

                    <h3>1. Eligibility</h3>
                    <ul>
                        <li>You must be at least 18 years old.</li>
                        <li>You must provide accurate and complete information during registration.</li>
                    </ul>

                    <h3>2. Subscriptions and Payments</h3>
                    <ul>
                        <li>Certain features require a paid subscription.</li>
                        <li>All payments are non-refundable unless required by law.</li>
                        <li>We reserve the right to change prices with prior notice.</li>
                    </ul>

                    <h3>3. VIN Decoder and Vehicle Information</h3>
                    <ul>
                        <li>Information provided through the VIN decoder and market data is for informational purposes only.</li>
                        <li>We do not guarantee accuracy, completeness, or fitness for any particular purpose.</li>
                        <li>You agree not to rely solely on the Service when making purchasing or selling decisions.</li>
                    </ul>

                    <h3>4. Auctions and Listings</h3>
                    <ul>
                        <li>Users may access vehicle auctions and list vehicles for sale.</li>
                        <li>You are solely responsible for the accuracy and legality of your listings.</li>
                        <li>Any fraudulent or misleading activity will result in suspension and possible legal action.</li>
                    </ul>

                    <h3>5. Marketplace Syndication</h3>
                    <ul>
                        <li>Our Service may syndicate your listings to third-party marketplaces.</li>
                        <li>We do not guarantee acceptance, display, or sale through these third parties.</li>
                        <li>Each third-party marketplace may require compliance with their own terms.</li>
                    </ul>

                    <h3>6. Prohibited Conduct</h3>
                    <ul>
                        <li>Use the Service for unlawful purposes.</li>
                        <li>Attempt to hack, disrupt, or reverse-engineer the platform.</li>
                        <li>Post misleading, fraudulent, or illegal content.</li>
                    </ul>

                    <h3>7. Limitation of Liability</h3>
                    <p>
                        The Service is provided “AS IS” without warranties of any kind. We
                        are not liable for damages, losses, or claims arising from use of
                        the Service, except as required by law.
                    </p>

                    <h3>8. Termination</h3>
                    <p>
                        We may suspend or terminate your account for violations of these
                        Terms. You may cancel your subscription at any time, but no refunds
                        will be issued.
                    </p>

                    <h3>9. Contact</h3>
                    <p>If you have questions, contact us at admin@do-change.com.</p>
                </Tabs.Panel>

                <Tabs.Panel value="privacy" className={styles.panel}>
                    <h2>Privacy Policy</h2>
                    <p><strong>Last updated:</strong> 09.09.2025</p>

                    <h3>1. Information We Collect</h3>
                    <ul>
                        <li>Registration data (name, email, payment details).</li>
                        <li>Vehicle search data, VIN queries, listings.</li>
                        <li>Technical data (IP address, browser, cookies).</li>
                    </ul>

                    <h3>2. How We Use Your Data</h3>
                    <ul>
                        <li>To provide and improve the Service.</li>
                        <li>To process payments and subscriptions.</li>
                        <li>To detect and prevent fraud.</li>
                        <li>To communicate important updates.</li>
                    </ul>

                    <h3>3. Data Sharing</h3>
                    <p>
                        We may share data with payment processors, marketplace partners, and
                        service providers. We do not sell personal data to third parties.
                    </p>

                    <h3>4. Data Retention</h3>
                    <p>
                        We retain user data as long as your account is active or as required
                        by law.
                    </p>

                    <h3>5. User Rights</h3>
                    <ul>
                        <li>You may request access, correction, or deletion of your personal data.</li>
                        <li>You may opt-out of marketing communications.</li>
                    </ul>

                    <h3>6. Security</h3>
                    <p>
                        We implement reasonable security measures but cannot guarantee
                        absolute protection.
                    </p>

                    <h3>7. Contact</h3>
                    <p>If you have questions, contact us at admin@do-change.com.</p>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}
