"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCamera,
    FaArrowRight,
    FaFileAlt,
    FaCheck,
    FaCar,
    FaKey,
} from "react-icons/fa";
import styles from "./ApplicationForm.module.css";

export const  ApplicationForm = ()=> {
    const [formData, setFormData] = useState({
        photo: null as File | null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        about: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as any;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <div className={styles.mainContainer}>
            {/* Left Section - Form */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.formSection}
            >
                <div className={styles.formContent}>
                    <div className={styles.formHeader}>
                        <h1>Join Our Auction Network</h1>
                        <p>
                            Complete your application to get exclusive access to premium car auctions
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Photo Upload */}
                        <div className={styles.uploadWrapper}>
                            <label className={styles.label}>Profile Photo</label>
                            <div className={styles.uploadZone}>
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                                <FaCamera className={styles.uploadIcon} />
                                <p>Click to upload your photo</p>
                                <span>PNG, JPG up to 5MB</span>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className={styles.row}>
                            <div>
                                <label  className={styles.label}>First Name</label>
                                <div className={styles.inputWrapper}>
                                    <FaUser className={styles.icon} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label  className={styles.label}>Last Name</label>
                                <div className={styles.inputWrapper}>
                                    <FaUser className={styles.icon} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label  className={styles.label}>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <FaEnvelope className={styles.icon} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label>Phone Number</label>
                            <div className={styles.inputWrapper}>
                                <FaPhone className={styles.icon} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <label>Tell us about yourself</label>
                            <textarea
                                name="about"
                                rows={4}
                                placeholder="Share your experience with cars, auction interests..."
                                value={formData.about}
                                onChange={handleChange}
                                className={styles.textarea}
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" className={styles.submitBtn}>
                            Submit Application <FaArrowRight />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Right Section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.infoSection}
            >
                <div className={styles.infoContent}>
                    <div className={styles.infoHeader}>
                        <h2>Exclusive Car Auctions Await</h2>
                        <p>
                            Join thousands of dealers and collectors accessing premium vehicles through our curated auction platform.
                        </p>
                    </div>

                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><FaFileAlt /></div>
                            <div>
                                <h3>Submit Application</h3>
                                <p>Complete the form with your details and background</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><FaPhone /></div>
                            <div>
                                <h3>Admin Review & Call</h3>
                                <p>Our team reviews your application and schedules a verification call</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><FaCheck /></div>
                            <div>
                                <h3>Get Access</h3>
                                <p>Start bidding on exclusive vehicles within 24-48 hours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative */}
                <FaCar className={styles.decorCar} />
                <FaKey className={styles.decorKey} />
            </motion.div>
        </div>
    );
}
