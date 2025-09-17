"use client";

import { useState, FormEvent, useEffect } from "react";
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
import { ApplicationSuccesses } from "./ApplicationSuccesses";
import { useAuctionAccessRequestCreation, useProfile, useProfileModifying } from "@/hooks";
import type { ProfileData, UpdateProfilePayload } from "@/services";

export const ApplicationForm = () => {
    const { data: profileData } = useProfile()
    const { mutateAsync: updateProfile } = useProfileModifying()
    const { mutate: createAuctionAccessRequest } = useAuctionAccessRequestCreation()
    const [showStub, setShowStub] = useState(false);
    const [formData, setFormData] = useState<ProfileData>({
        // photo: null as File | null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
    });

    const emptyFields = profileData
        ? Object.keys(profileData).filter(field => !profileData[field as keyof ProfileData])
        : []

    useEffect(() => {
        if (profileData) {
            setFormData({
                bio: profileData.bio,
                email: profileData.email,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                // photo: null
            })
        }
    }, [profileData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as any;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const emptyFieldsData = emptyFields.map(x => ({ field: x, value: formData[x as keyof ProfileData] }))
        const notFilledFields = emptyFieldsData.filter(x => !x.value).map(x => x.field)
        if (notFilledFields.length) {
            alert(`Some fields are left not filled: ${notFilledFields.join(', ')}, fill them to request auction access`)
            return
        }
        if (emptyFieldsData.length) {
            const dataToUpdateProfile = Object.fromEntries(emptyFieldsData.map(x => [x.field, x.value] as const)) as UpdateProfilePayload
            await updateProfile({ body: dataToUpdateProfile })
        }
        await createAuctionAccessRequest({})
    };

    if (showStub) {
        return <ApplicationSuccesses />
    }
    return (
        <div className={styles.mainContainer}>
            {/* Left Section - Form */}
            <div className={styles.formSection}>
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
                                <label className={styles.label}>First Name</label>
                                <div className={styles.inputWrapper}>
                                    <FaUser className={styles.icon} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={styles.input}
                                        disabled={!!profileData?.firstName}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={styles.label}>Last Name</label>
                                <div className={styles.inputWrapper}>
                                    <FaUser className={styles.icon} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        disabled={!!profileData?.lastName}
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className={styles.label}>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <FaEnvelope className={styles.icon} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    disabled
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
                                    disabled={!!profileData?.phone}
                                    required
                                />
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <label>Tell us about yourself</label>
                            <textarea
                                name="bio"
                                rows={4}
                                placeholder="Share your experience with cars, auction interests..."
                                value={formData.bio}
                                onChange={handleChange}
                                className={styles.textarea}
                                disabled={!!profileData?.bio}
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" className={styles.submitBtn}>
                            Submit Application <FaArrowRight />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Section */}
            <div className={styles.infoSection}>
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
            </div>
        </div>
    );
}
