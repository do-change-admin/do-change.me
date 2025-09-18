"use client";

import { motion } from "framer-motion";
import {
    FaArrowRight,
    FaEnvelope,
    FaUserCheck,
    FaCloudUploadAlt,
    FaHashtag,
    FaIdCard,
    FaCamera,
    FaImage,
    FaCheckCircle, FaArrowDown, FaApple, FaGooglePlay, FaCheck, FaFileAlt,
} from "react-icons/fa";
import styles from './RegistrationAuctionAcceess.module.css';
import { Image } from "@mantine/core";
import UploadForm from "../../upload-form";

export const RegistrationSteps = () => {
    return (
        <main className={styles.container}>
            {/* Steps Section */}
            <section className={styles.stepsSection}>
                <div className={styles.stepsContainer}>
                    {/* Step 1 */}
                    <div className={`${styles.stepCard} ${styles.blue}`}>
                        <div className={styles.textBox}>
                            <div className={styles.stepTitle}>
                                <div className={`${styles.stepNumber} ${styles.bgBlue}`}>1</div>
                                <h3>Mobile App</h3>
                            </div>

                            <p>
                                To get started, you need to download the <strong>Auction Access</strong> mobile application.
                                It is available for free on both the <strong>App Store (iOS)</strong> and <strong>Google Play (Android)</strong>.
                                Once downloaded, install the app on your device and be ready to create your account directly through it.
                                Please note that <strong>Auction Access charges an annual registration fee of $103 per user</strong>
                            </p>

                            <div className={styles.stepAction}>
                                <a
                                    href="https://apps.apple.com/us/app/auctionaccess-mobile/id561969130"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.storeButton}
                                >
                                    <FaApple className={styles.storeIcon} />
                                    <span>App Store</span>
                                </a>

                                <a
                                    href="https://play.google.com/store/apps/details?id=com.autotec&hl=en_US&pli=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.storeButton}
                                >
                                    <FaGooglePlay className={styles.storeIcon} />
                                    <span>Google Play</span>
                                </a>
                            </div>

                        </div>
                        <div className={styles.imageBox}>
                            <Image
                                src="/AAStore.png"
                                alt="registration form"
                            />
                        </div>
                    </div>

                    <div className={styles.arrowDown}>
                        <FaArrowDown />
                    </div>

                    {/* Step 2 */}
                    <div className={`${styles.stepCard} ${styles.purple} ${styles.reverse}`}>
                        <div className={styles.textBox}>
                            <div className={styles.stepTitle}>
                                <div className={`${styles.stepNumber} ${styles.bgPurple}`}>
                                    2
                                </div>
                                <h3>Enrollment</h3>
                            </div>
                            <p>
                                In the Auction Access Mobile app, tap <strong>Enroll</strong> to start the process.
                                Then answer the prompts by selecting <strong>Yes</strong> for the first question and <strong>No</strong> for the second to continue.
                            </p>
                            <div className={styles.stepAction}>
                                <FaCheck className={styles.iconPurple} />
                                <span>Tap "Enroll", select "Yes" for the first prompt, and "No" for the second</span>
                            </div>
                        </div>


                        <div className={styles.imageBox}>
                            <Image
                                src="/AAStore2.png"
                                alt="email verification"
                            />
                        </div>
                    </div>

                    <div className={styles.arrowDown}>
                        <FaArrowDown />
                    </div>

                    {/* Step 3 */}
                    <div className={`${styles.stepCard} ${styles.green}`}>
                        <div className={styles.textBox}>
                            <div className={styles.stepTitle}>
                                <div className={`${styles.stepNumber} ${styles.bgGreen}`}>
                                    3
                                </div>
                                <h3>Profile Setup</h3>
                            </div>
                            <p>
                                Log into your account and navigate to profile settings. Tap <strong>Continue</strong>, then go to <strong>Documents</strong>, select both properties, and check the two boxes indicated to complete your profile for auction participation.
                            </p>
                            <div className={styles.stepAction}>
                                <FaUserCheck className={styles.iconGreen} />
                                <span>Tap "Continue", go to "Documents", and select both properties with the checkboxes</span>
                            </div>
                        </div>

                        <div className={styles.imageBox}>
                            <Image
                                src="/AAStore3.png"
                                alt="profile setup"
                            />
                        </div>
                    </div>
                    <div className={styles.arrowDown}>
                        <FaArrowDown />
                    </div>
                    {/* Step 4 */}
                    <div className={`${styles.stepCard} ${styles.orange} ${styles.reverse}`}>
                        <form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>
                                    <FaHashtag className={styles.iconBlue} /> Auction Access Number
                                </label>
                                <input type="text" placeholder="Enter your Auction Access number" />
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    <FaIdCard className={styles.iconPurple} /> Driver's License
                                </label>
                                <div className={styles.uploadZone}>
                                    <FaCloudUploadAlt size={40} className={styles.iconGray} />
                                    {/* <p>Click to upload or drag and drop</p> */}
                                    {/* <input type="file" accept=".png,.jpg,.jpeg,.pdf" /> */}
                                    <UploadForm variant="license" />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    <FaFileAlt className={styles.iconPurple} />{' '}
                                    <a
                                        href="/your-individual-agreement.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link} // <-- добавляем стиль
                                    >
                                        Agreement
                                    </a>
                                </label>
                                <div className={styles.uploadZone}>
                                    <FaCloudUploadAlt size={40} className={styles.iconGray} />
                                    {/* <p>Download, sign, and upload this file by clicking or dragging it here</p> */}
                                    {/* <input type="file" accept=".png,.jpg,.jpeg,.pdf" /> */}
                                    <UploadForm variant="agreement" />
                                </div>
                            </div>


                            <div className={styles.submitSection}>
                                <button type="submit">
                                    <FaCheckCircle /> Complete Registration
                                </button>
                                <p>
                                    By submitting, you agree to our terms of service and privacy
                                    policy
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
