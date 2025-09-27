'use client'

import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import styles from "./ProfileForm.module.css";
import {Avatar, Button, Loader, Select, Text} from "@mantine/core";
import {FaCamera} from "react-icons/fa";
import {useProfile, useProfileModifying, useUploadPhoto} from "@/hooks";
import {notifications} from "@mantine/notifications";
import {ProfileFormSkeleton} from "@/app/settings/(ProfileForm)/ProfileFormSkeleton";
import {DateInput} from '@mantine/dates';
import {AiOutlineExclamationCircle} from "react-icons/ai";

export const STATES = [
    {value: "AL", label: "Alabama (AL)"},
    {value: "AK", label: "Alaska (AK)"},
    {value: "AZ", label: "Arizona (AZ)"},
    {value: "AR", label: "Arkansas (AR)"},
    {value: "CA", label: "California (CA)"},
    {value: "CO", label: "Colorado (CO)"},
    {value: "CT", label: "Connecticut (CT)"},
    {value: "DE", label: "Delaware (DE)"},
    {value: "FL", label: "Florida (FL)"},
    {value: "GA", label: "Georgia (GA)"},
    {value: "HI", label: "Hawaii (HI)"},
    {value: "ID", label: "Idaho (ID)"},
    {value: "IL", label: "Illinois (IL)"},
    {value: "IN", label: "Indiana (IN)"},
    {value: "IA", label: "Iowa (IA)"},
    {value: "KS", label: "Kansas (KS)"},
    {value: "KY", label: "Kentucky (KY)"},
    {value: "LA", label: "Louisiana (LA)"},
    {value: "ME", label: "Maine (ME)"},
    {value: "MD", label: "Maryland (MD)"},
    {value: "MA", label: "Massachusetts (MA)"},
    {value: "MI", label: "Michigan (MI)"},
    {value: "MN", label: "Minnesota (MN)"},
    {value: "MS", label: "Mississippi (MS)"},
    {value: "MO", label: "Missouri (MO)"},
    {value: "MT", label: "Montana (MT)"},
    {value: "NE", label: "Nebraska (NE)"},
    {value: "NV", label: "Nevada (NV)"},
    {value: "NH", label: "New Hampshire (NH)"},
    {value: "NJ", label: "New Jersey (NJ)"},
    {value: "NM", label: "New Mexico (NM)"},
    {value: "NY", label: "New York (NY)"},
    {value: "NC", label: "North Carolina (NC)"},
    {value: "ND", label: "North Dakota (ND)"},
    {value: "OH", label: "Ohio (OH)"},
    {value: "OK", label: "Oklahoma (OK)"},
    {value: "OR", label: "Oregon (OR)"},
    {value: "PA", label: "Pennsylvania (PA)"},
    {value: "RI", label: "Rhode Island (RI)"},
    {value: "SC", label: "South Carolina (SC)"},
    {value: "SD", label: "South Dakota (SD)"},
    {value: "TN", label: "Tennessee (TN)"},
    {value: "TX", label: "Texas (TX)"},
    {value: "UT", label: "Utah (UT)"},
    {value: "VT", label: "Vermont (VT)"},
    {value: "VA", label: "Virginia (VA)"},
    {value: "WA", label: "Washington (WA)"},
    {value: "WV", label: "West Virginia (WV)"},
    {value: "WI", label: "Wisconsin (WI)"},
    {value: "WY", label: "Wyoming (WY)"},
];

export const ProfileForm: FC<{ isNotSettings?: boolean }> = ({isNotSettings = false}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [birthDate, setBirthDate] = useState<Date>();
    const [address, setAddress] = useState<string | null>(null)
    const [state, setState] = useState<string | null>(null)
    const [zipCode, setZipCode] = useState<string | null>(null)
    const {data: profileData, isLoading: profileIsLoading} = useProfile();
    const {mutate: modifyProfile, isPending: profileIsModifying} = useProfileModifying();
    const {mutate: uploadPhoto, isPending: isPendingUploadPhoto} = useUploadPhoto();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) return;
        uploadPhoto(event.target.files[0]);
    };

    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() - 18);

    useEffect(() => {
        if (!profileIsLoading && profileData) {
            setFirstName(profileData.firstName)
            setLastName(profileData.lastName)
            setPhone(profileData.phone)
            setBio(profileData.bio)
            setState(profileData.state)
            setAddress(profileData.address)
            setZipCode(profileData.zipCode)
            if (profileData.birthDate) {
                setBirthDate(new Date(profileData.birthDate))
            }
        }
    }, [profileIsLoading])


    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        modifyProfile(
            {body: {bio, firstName, lastName, phone, birthDate: birthDate!, address, state, zipCode}},
            {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'New profile data was successfully saved!',
                        color: 'green',
                    });
                },
                onError: (e) => {
                    notifications.show({
                        title: 'Error',
                        message: `Error while saving`,
                        color: 'red',
                    });
                },
            }
        );
    };

    if (profileIsLoading || isPendingUploadPhoto || profileIsModifying) {
        return <ProfileFormSkeleton/>
    }

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Profile Information</h2>
                <Button
                    onClick={handleSave}
                    disabled={profileIsModifying}
                    leftSection={profileIsModifying ? <Loader size="xs" color="white"/> : null}
                >
                    {profileIsModifying ? 'Saving...' : 'Save'}
                </Button>
            </div>
            <div className={styles.avatarRow}>
                <div className={styles.avatarWrap}>
                    <Avatar
                        src={profileData?.photoLink}
                        alt="User avatar"
                        className={styles.avatar}
                    />
                    <button className={styles.avatarBtn} aria-label="Change photo">
                        <FaCamera className={styles.avatarIcon}/>
                    </button>
                </div>

                <div className={styles.avatarInfo}>
                    <h3 className={styles.userName}>{profileData?.firstName} {profileData?.lastName}</h3>
                    <p className={styles.userEmail}>{profileData?.email}</p>
                    <label htmlFor='photo-upload'>
                        <p className={styles.linkBtn}>Change Avatar</p>
                    </label>
                    <input style={{display: 'none'}} id='photo-upload' type='file' onChange={handleFileChange}/>
                    {(isNotSettings && !Boolean(profileData?.photoLink)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>
            </div>

            <form className={styles.grid} onSubmit={handleSave}>
                <div className={styles.field}>
                    <label className={styles.label}>First Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {(isNotSettings && !Boolean(profileData?.firstName)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Last Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={profileData?.lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {(isNotSettings && !Boolean(profileData?.lastName)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Date of birth</label>
                    <DateInput
                        placeholder="Pick date"
                        value={birthDate ? birthDate.toISOString().split("T")[0] : null}
                        onChange={(x) => setBirthDate(new Date(x!))}
                        classNames={{
                            input: styles.inputDateInput,
                        }}
                        maxDate={maxAllowedDate}
                        m={0}
                        p={0}
                    />
                    {(isNotSettings && !Boolean(profileData?.birthDate)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        className={`${styles.input} ${styles.disabled}`}
                        value={profileData?.email}
                        disabled
                    />
                    {(isNotSettings && !Boolean(profileData?.email)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <input
                        type="tel"
                        className={styles.input}
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {(isNotSettings && !Boolean(profileData?.phone)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Address</label>
                    <input
                        type="tel"
                        className={styles.input}
                        placeholder="Enter your street address"
                        value={address || ''}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {(isNotSettings && !Boolean(profileData?.address)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Zip Code</label>
                    <input
                        type="tel"
                        className={styles.input}
                        placeholder="Enter Zip Code"
                        value={zipCode || ''}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    {(isNotSettings &&  !Boolean(profileData?.zipCode)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>State</label>
                    <Select
                        data={STATES}
                        value={state}
                        onChange={setState}
                        placeholder="Select a state"
                        searchable
                        nothingFoundMessage="No state found"
                        radius="lg"
                        p={0}
                        m={0}
                        classNames={{
                            input: styles.inputDateInput,
                        }}
                    />
                    {(isNotSettings &&  !Boolean(profileData?.state)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>
                <div className={styles.fieldFull}>
                    <label className={styles.label}>Bio</label>
                    <textarea
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className={`${styles.input} ${styles.textarea}`}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    {(isNotSettings && !Boolean(profileData?.bio)) && (
                        <Text c="red" size="sm" style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <AiOutlineExclamationCircle/>
                            This field is required
                        </Text>
                    )}
                </div>
            </form>
        </section>
    );
};