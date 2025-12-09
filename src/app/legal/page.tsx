'use client';

import { Anchor, Container, Divider, Flex, Group, Paper, ScrollArea, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import { FaBalanceScale, FaCookieBite, FaShieldAlt, FaUndo } from 'react-icons/fa';
import styles from './page.module.css';

const sections = [
    { id: 'terms', title: 'Terms of Service', icon: <FaBalanceScale /> },
    { id: 'privacy', title: 'Privacy Policy', icon: <FaShieldAlt /> },
    { id: 'refund', title: 'Refund Policy', icon: <FaUndo /> },
    { id: 'cookies', title: 'Cookie Policy', icon: <FaCookieBite /> }
];

export default function LegalPage() {
    useEffect(() => {
        const handleClick = (e: Event) => {
            const target = e.target as HTMLAnchorElement;
            if (target.tagName === 'A' && target.hash) {
                e.preventDefault();
                const el = document.querySelector(target.hash);
                el?.scrollIntoView({ behavior: 'smooth' });
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <Container className={styles['lp-container']} fluid>
            {/* HEADER */}
            <Flex align="center" className={styles['lp-header']} justify="space-between">
                <Title className={styles['lp-logo']} order={3}>
                    Do-Change
                </Title>

                <Group className={styles['lp-nav']} gap="md">
                    {sections.map((s) => (
                        <Anchor className={styles['lp-nav-link']} href={`#${s.id}`} key={s.id}>
                            {s.icon}
                            <span>{s.title}</span>
                        </Anchor>
                    ))}
                </Group>
            </Flex>

            {/* CONTENT */}
            <ScrollArea className={styles['lp-scroll']} type="never">
                <Container className={styles['lp-content']} size="md">
                    {sections.map((s) => (
                        <section className={styles['lp-section']} id={s.id} key={s.id}>
                            <Title className={styles['lp-section-title']} order={2}>
                                {s.icon} {s.title}
                            </Title>
                            <Text c="dimmed" mb="md" size="sm">
                                Effective Date: October 15, 2025
                            </Text>

                            <Paper p="lg" radius="md" shadow="sm" withBorder>
                                {s.id === 'terms' && (
                                    <>
                                        <Text mb="sm">
                                            Welcome to Do-Change (“we,” “us,” “our”). These Terms of Service (“Terms”)
                                            constitute a legally binding agreement between you (“User,” “you,” “your”)
                                            and Do-Change regarding your access to and use of our subscription-based
                                            platform and services (collectively, the “Service”). By accessing or using
                                            the Service, you acknowledge that you have read, understood, and agree to be
                                            bound by these Terms.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Eligibility:</strong> You must be at least 18 years of age and
                                            capable of entering into a legally binding agreement under the laws of
                                            Texas. By using the Service, you represent and warrant that you meet these
                                            eligibility requirements.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Subscription and Payment:</strong> Access to the Service requires a
                                            paid subscription. All subscription fees are stated in USD and billed in
                                            advance according to the chosen plan. Subscriptions automatically renew
                                            unless canceled prior to the next billing cycle. Payment processing is
                                            handled securely through third-party providers.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Refunds:</strong> All subscription fees are generally
                                            non-refundable. Refunds may be issued at our sole discretion only in cases
                                            of technical failure, duplicate charges, or billing errors, in accordance
                                            with our Refund Policy.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Use of Service:</strong> Users are granted a limited, non-exclusive,
                                            non-transferable license to access and use the Service for lawful, personal
                                            purposes. You agree not to: (i) reproduce, copy, modify, or distribute the
                                            Service or its content; (ii) attempt to gain unauthorized access to our
                                            systems; (iii) use the Service for any illegal, fraudulent, or harmful
                                            purposes; or (iv) interfere with the operation or security of the Service.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Intellectual Property:</strong> All content, features,
                                            functionality, and materials provided through the Service, including but not
                                            limited to software, graphics, text, logos, and trademarks, are the
                                            exclusive property of Do-Change and are protected by U.S. and international
                                            intellectual property laws. Nothing in these Terms grants you any ownership
                                            or license to the Service, except as explicitly stated herein.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Termination:</strong> We reserve the right to suspend or terminate
                                            your access to the Service immediately, without prior notice, for violations
                                            of these Terms, suspected fraudulent activity, or any other conduct that may
                                            harm Do-Change or other users. Upon termination, your right to access the
                                            Service ceases immediately, and any subscription fees paid are
                                            non-refundable unless otherwise required by law.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Limitation of Liability:</strong> To the maximum extent permitted by
                                            law, Do-Change shall not be liable for any indirect, incidental, special,
                                            consequential, or punitive damages arising from your use of the Service,
                                            including loss of profits, data, or business opportunities. Our total
                                            liability to you for any claim arising out of or relating to these Terms
                                            shall not exceed the amount you paid for the subscription within the 12
                                            months preceding the claim.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Indemnification:</strong> You agree to indemnify, defend, and hold
                                            harmless Do-Change, its affiliates, officers, directors, employees, and
                                            agents from and against any claims, liabilities, damages, losses, and
                                            expenses arising from your use of the Service, violation of these Terms, or
                                            infringement of any rights of a third party.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Governing Law and Dispute Resolution:</strong> These Terms shall be
                                            governed by and construed in accordance with the laws of the State of Texas,
                                            without regard to its conflict of law provisions. Any disputes arising under
                                            or in connection with these Terms shall be resolved exclusively in the state
                                            or federal courts located in Harris County, Texas, and you consent to the
                                            jurisdiction of such courts.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Changes to Terms:</strong> We reserve the right to modify these
                                            Terms at any time. Any changes will be effective immediately upon posting to
                                            the Service. Continued use of the Service constitutes acceptance of the
                                            updated Terms.
                                        </Text>

                                        <Text>
                                            <strong>Contact:</strong> For questions regarding these Terms, please
                                            contact us at{' '}
                                            <Anchor href="mailto:admin@do-change.com">admin@do-change.com</Anchor>.
                                        </Text>
                                    </>
                                )}

                                {s.id === 'privacy' && (
                                    <>
                                        <Text mb="sm">
                                            <strong>Privacy Policy of Do-Change</strong> (“we,” “us,” “our”) describes
                                            how we collect, use, store, and protect your personal information when you
                                            access or use our subscription-based platform and services (the “Service”).
                                            By using the Service, you consent to the practices described herein.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Information We Collect:</strong> We collect information you provide
                                            directly (e.g., name, email, phone number, driver’s license, payment
                                            information) and information collected automatically when you use the
                                            Service (e.g., IP address, device type, browser, usage patterns).
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Use of Information:</strong> We use your information to provide and
                                            improve the Service, process payments, communicate with you regarding
                                            subscriptions or technical issues, ensure security, and comply with
                                            applicable laws.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Data Sharing:</strong> We do not sell personal information. We may
                                            share information with trusted service providers solely for operating the
                                            Service, payment processing, analytics, and security purposes.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Data Security:</strong> We implement commercially reasonable
                                            administrative, technical, and physical safeguards to protect personal
                                            information from unauthorized access, use, or disclosure. However, no system
                                            is completely secure, and we cannot guarantee absolute protection.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Retention:</strong> We retain personal information only as long as
                                            necessary to provide the Service or as required by law.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Cookies and Tracking:</strong> We use cookies and similar
                                            technologies to improve functionality, analyze usage, and personalize your
                                            experience. You may disable cookies in your browser settings, but some
                                            features of the Service may not function properly.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Children:</strong> The Service is not directed to individuals under
                                            18, and we do not knowingly collect personal information from minors.
                                        </Text>

                                        <Text>
                                            <strong>Contact:</strong> For questions about this Privacy Policy or your
                                            personal information, contact us at{' '}
                                            <Anchor href="mailto:admin@do-change.com">admin@do-change.com</Anchor>.
                                        </Text>
                                    </>
                                )}

                                {s.id === 'refund' && (
                                    <>
                                        <Text mb="sm">
                                            <strong>Refund Policy of Do-Change</strong> (“we,” “us,” “our”) governs the
                                            conditions under which subscription fees may be refunded. By using the
                                            Service, you agree to these terms.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>General Policy:</strong> All subscription fees are generally
                                            non-refundable. Refunds may be granted solely at our discretion in cases of
                                            technical failure, duplicate charges, or billing errors.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Eligibility for Refunds:</strong> You may request a refund if:
                                        </Text>

                                        <ul className={styles['lp-list']}>
                                            <li>
                                                • You experience technical issues that prevent access to the Service
                                            </li>
                                            <li>
                                                • Your account was billed incorrectly or multiple times for the same
                                                period
                                            </li>
                                            <li>
                                                • You cancel your subscription within 48 hours of purchase, provided
                                                minimal usage
                                            </li>
                                        </ul>

                                        <Text mb="sm">
                                            <strong>Processing:</strong> Approved refunds will be issued within 5–10
                                            business days to the original payment method. Refunds are evaluated case by
                                            case at Do-Change’s sole discretion.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Limitations:</strong> Except as required by law, no other refunds
                                            will be provided. Do-Change reserves the right to deny any refund request
                                            that does not meet the criteria above.
                                        </Text>

                                        <Text>
                                            <strong>Contact:</strong> Questions about refunds can be sent to{' '}
                                            <Anchor href="mailto:admin@do-change.com">admin@do-change.com</Anchor>.
                                        </Text>
                                    </>
                                )}

                                {s.id === 'cookies' && (
                                    <>
                                        <Text mb="sm">
                                            <strong>Cookie Policy of Do-Change</strong> (“we,” “us,” “our”) explains our
                                            use of cookies and similar technologies when you access our
                                            subscription-based platform and services.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>What Are Cookies:</strong> Cookies are small text files stored on
                                            your device that allow us to recognize your browser, improve functionality,
                                            and analyze traffic.
                                        </Text>

                                        <Text mb="sm">
                                            <strong>Types of Cookies We Use:</strong>
                                        </Text>

                                        <ul className={styles['lp-list']}>
                                            <li>
                                                • <strong>Essential Cookies:</strong> Required for the operation and
                                                security of the Service.
                                            </li>
                                            <li>
                                                • <strong>Analytics Cookies:</strong> Collect information about user
                                                behavior to improve the Service.
                                            </li>
                                            <li>
                                                • <strong>Marketing Cookies:</strong> Used to deliver content and
                                                promotions relevant to your interests.
                                            </li>
                                        </ul>

                                        <Text mb="sm">
                                            <strong>Managing Cookies:</strong> You can disable cookies in your browser
                                            settings, but some parts of the Service may not function properly.
                                        </Text>

                                        <Text>
                                            <strong>Contact:</strong> For questions regarding our use of cookies,
                                            contact{' '}
                                            <Anchor href="mailto:admin@do-change.com">admin@do-change.com</Anchor>.
                                        </Text>
                                    </>
                                )}
                            </Paper>

                            <Divider my="xl" />
                        </section>
                    ))}
                </Container>
            </ScrollArea>

            {/* FOOTER */}
            <footer className={styles['lp-footer']}>
                <Text c="white" size="sm">
                    © 2025 Do-Change. All rights reserved.
                </Text>
                <Anchor c="#cce1ff" href="mailto:admin@do-change.com" size="sm">
                    admin@do-change.com
                </Anchor>
            </footer>
        </Container>
    );
}
