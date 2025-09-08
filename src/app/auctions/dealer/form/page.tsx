'use client';

import { useState } from "react";
import { FaCloudUploadAlt, FaPaperPlane } from "react-icons/fa";
import styles from "./page.module.css";

export default function RequestAccessPage() {
    const [charCount, setCharCount] = useState(0);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.accessFormCard}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Auction Access</h1>
                    <p className={styles.subtitle}>
                        Fill out the form below to get access to our platform
                    </p>
                </div>

                <form className={styles.accessForm}>
                    {/* Photo Upload */}
                    <div className={styles.photoUploadSection}>
                        <label className={styles.label}>Upload Photo</label>
                        <div className={styles.photoWrapper}>
                            <input type="file" id="photo-upload" accept="image/*" className={styles.fileInput} />
                            <label htmlFor="photo-upload" className={styles.photoLabel}>
                                <FaCloudUploadAlt className={styles.uploadIcon} />
                                <span className={styles.uploadText}>Click to upload photo</span>
                                <span className={styles.uploadNote}>PNG, JPG up to 10MB</span>
                            </label>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className={styles.formGrid}>
                        <div className={styles.leftColumn}>
                            <div className={styles.nameFields}>
                                <div className={styles.nameField}>
                                    <label htmlFor="first-name" className={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        name="first-name"
                                        placeholder="John"
                                        required
                                        className={styles.inputField}
                                    />
                                </div>
                                <div className={styles.nameField}>
                                    <label htmlFor="last-name" className={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="last-name"
                                        placeholder="Doe"
                                        required
                                        className={styles.inputField}
                                    />
                                </div>
                            </div>

                            <div className={styles.ageField}>
                                <label htmlFor="age" className={styles.label}>Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    min={18}
                                    max={99}
                                    placeholder="25"
                                    required
                                    className={styles.inputField}
                                />
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.descriptionField}>
                                <label htmlFor="description" className={styles.label}>Brief Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={6}
                                    maxLength={500}
                                    placeholder="Tell us a bit about yourself and why you'd like access..."
                                    required
                                    className={styles.textareaField}
                                    onChange={(e) => setCharCount(e.target.value.length)}
                                />
                                <div className={styles.charCount}>{charCount}/500 characters</div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className={styles.submitSection}>
                        <button type="submit" className={styles.submitBtn}>
                            <FaPaperPlane className={styles.submitIcon} />
                            Submit Request
                        </button>
                    </div>
                </form>

                <div className={styles.formFooter}>
                    <p>
                        By submitting this form, you agree to our{" "}
                        <span className={styles.link}>Terms of Service</span> and{" "}
                        <span className={styles.link}>Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
