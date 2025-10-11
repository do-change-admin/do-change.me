"use client";

import { motion } from "framer-motion";
import {FaGavel, FaHammer, FaEye, FaKey, FaShieldAlt, FaChevronRight, FaCar, FaQrcode} from "react-icons/fa";
import styles from "./AuctionServicesCards.module.css";
import {useRouter} from "next/navigation";
import {useSlideMenu} from "@/contexts";
import Link from "next/link";


const AUCTION_CARDS = [
    {
        id: "/auctions/dealer",
        title: "Dealer's Auction",
        subtitle: "Manheim, ADESA",
        img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/1a6351382e-642c12c15611243e9255.png",
        icon: <FaHammer color="white"  />,
        buttonText: "Request Access",
        buttonIcon: <FaKey />,
        btnClass: styles.dealersBtn,
        headerClass: styles.dealers,
        highlight: false,
    },
    // {
    //     id: "/auctions/insurance",
    //     title: "Insurance Auction",
    //     subtitle: "Copart, IAAI and 140+ auctions",
    //     img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/bc77c00253-df52ce3651ba8510878a.png",
    //     icon: <FaGavel color="white" />,
    //     buttonText: "View Cars",
    //     buttonIcon: <FaEye />,
    //     btnClass: styles.insuranceBtn,
    //     headerClass: styles.insurance,
    //     highlight: true,
    // }
];

export const AuctionsServicesCards = () => {
    const router = useRouter();
    const { closeMenu } = useSlideMenu();
    return (
        <div className={styles.main}>
            <div className={styles.menuOptions}>
                {/* Dealer Auctions */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={styles.card}
                    onClick={() => {
                        router.push("/auctions/dealer");
                        closeMenu()
                    }}
                >
                    <div className={styles.cardContent}>
                        <div className={`${styles.iconBox} ${styles.green}`}>
                            <FaCar className={styles.icon} />
                        </div>
                        <div className={styles.cardText}>
                            <h3 className={styles.cardTitle}>Dealer Auctions</h3>
                            <p className={styles.cardDesc}>
                                Manheim, ADESA
                            </p>
                        </div>
                        <FaChevronRight className={styles.chevron} />
                    </div>
                </motion.div>
                {/* Insurance Auctions */}
                {/*<motion.div*/}
                {/*    whileHover={{ scale: 1.02 }}*/}
                {/*    className={styles.card}*/}
                {/*    onClick={() => {*/}
                {/*        router.push("/auctions/insurance");*/}
                {/*        closeMenu()*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <div className={styles.cardContent}>*/}
                {/*        <div className={`${styles.iconBox} ${styles.blue}`}>*/}
                {/*            <FaShieldAlt className={styles.icon} />*/}
                {/*        </div>*/}
                {/*        <div className={styles.cardText}>*/}
                {/*            <h3 className={styles.cardTitle}>Insurance Auctions</h3>*/}
                {/*            <p className={styles.cardDesc}>*/}
                {/*                Copart, IAAI and 140+*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*        <FaChevronRight className={styles.chevron} />*/}
                {/*    </div>*/}
                {/*</motion.div>*/}
            </div>
        </div>
    );
}
