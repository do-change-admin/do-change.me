"use client";

import styles from "./AuctionAccess.module.css";
import { FaQrcode, FaHashtag } from "react-icons/fa";
import { useProfile } from "@/hooks";
import {Avatar, Button, FileInput, Image, Modal, Text, TextInput, Title} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSlideMenu } from "@/contexts";


export const AuctionAccess = () => {
    const router = useRouter();
    const { closeMenu } = useSlideMenu();
    const { data: profileData } = useProfile()
    const [opened, setOpened] = useState(false);
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [number, setNumber] = useState("");



    return (
        <div className={styles.main}>
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
            <Avatar radius="0" w={250} h={200} className={styles.photo} src={profileData?.photoLink || ''} alt="" />
            <Text fw="bold" style={{ fontSize: '1.5rem' }} c="#005BAA">{profileData?.firstName.toUpperCase()} {profileData?.lastName.toUpperCase()}</Text>
            <Text mb="xl" fw="bold" fs="lg"c="#005BAA">{profileData?.auctionAccessNumber ?? "__-____-____"}</Text>
            {profileData?.auctionAccessQRLink ? <Image
                    height={300}
                    width={300}
                    className={styles.qrIcon}
                    src={profileData?.auctionAccessQRLink}
                    alt="Profile auction access QR code"
                /> :
            <div className={styles.qrBox}>
                 <FaQrcode className={styles.qrIcon} />
            </div>}
            {(!profileData?.auctionAccessNumber! && !profileData?.auctionAccessQRLink) && (
                <>
                    <Button h={40} mt={10} radius="lg" fullWidth bg="pink" onClick={() => {
                        router.push('/auctions/dealer')
                        closeMenu()
                    }}>Get Access</Button>
                </>
            )}
        </div>
    );
}
