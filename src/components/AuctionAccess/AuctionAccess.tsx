"use client";

import styles from "./AuctionAccess.module.css";
import { FaQrcode, FaHashtag } from "react-icons/fa";
import {useProfile, useProfileModifying} from "@/hooks";
import {Avatar, Button, FileInput, Modal, Text, TextInput, Title} from "@mantine/core";
import {FormEvent, useState} from "react";
import {notifications} from "@mantine/notifications";


export const AuctionAccess = () => {
    const { data: profileData } = useProfile()
    const [opened, setOpened] = useState(false);
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [number, setNumber] = useState("");
    const {mutate: modifyProfile, isPending: profileIsModifying} = useProfileModifying();

    const handleSave = (e: FormEvent) => {
    };

    return (
        <main className={styles.main}>
            <Modal
                radius="lg"
                opened={opened}
                onClose={() => setOpened(false)}
                title="Auction Access"
                centered
                classNames={{ title: styles.title }}
            >
                <form className={styles.form}>
                    <FileInput
                        label="Upload QR Code"
                        placeholder="Choose QR code image"
                        leftSection={<FaQrcode size={18} />}
                        value={qrFile}
                        onChange={setQrFile}
                        accept="image/*"
                        radius="lg"
                        className={styles.input}
                    />

                    <TextInput
                        radius="lg"
                        label="Enter Access Number"
                        placeholder="Enter your number"
                        leftSection={<FaHashtag size={18} />}
                        value={number}
                        onChange={(e) => setNumber(e.currentTarget.value)}
                        className={styles.input}
                    />

                    <Button radius="lg" type="submit" fullWidth className={styles.submitButton}>
                        Confirm
                    </Button>
                </form>
            </Modal>
            {/* QR Section */}
            <Avatar radius="lg"  w="100%" h={200} className={styles.photo} src={profileData?.photoLink || ''} alt=""/>
            <Text fw="bold" fs="lg">{profileData?.firstName} {profileData?.lastName}</Text>
            <div className={styles.accessNumber}>
                <p className={styles.accessLabel}>Auction Access Number</p>
                <p className={styles.accessValue}>{profileData?.auctionAccessNumber ?? "__-____-____"}</p>
            </div>
            <div className={styles.qrBox}>
                {profileData?.auctionAccessQRLink ?? <FaQrcode className={styles.qrIcon} />}
            </div>
            {!profileData?.auctionAccessNumber && (
                <>
                    <Button radius="lg" fullWidth variant="outline" onClick={() => setOpened(true)}>Add Auction Access</Button>
                    <Button radius="lg" fullWidth bg="pink" >Get Access</Button>
                </>
            )}
        </main>
    );
}
