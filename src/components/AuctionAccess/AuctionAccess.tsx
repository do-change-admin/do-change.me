"use client";

import {FaQrcode} from "react-icons/fa";
import styles from "./AuctionAccess.module.css";
import {useProfile} from "@/hooks";
import {Avatar, Button, Text, Title} from "@mantine/core";


export const AuctionAccess = () => {
    const { data: profileData } = useProfile()
    return (
        <main className={styles.main}>
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
                    <Button fullWidth variant="outline">Add Auction Access</Button>
                    <Button fullWidth bg="pink" >Get Access</Button>
                </>
            )}
        </main>
    );
}
