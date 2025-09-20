"use client";

import { motion } from "framer-motion";
import { FaGavel, FaHammer, FaEye, FaKey } from "react-icons/fa";
import styles from "./AuctionServicesCards.module.css";
import {useRouter} from "next/navigation";
import {useSlideMenu} from "@/contexts";


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

const AuctionCard = ({
                         title,
                         subtitle,
                         img,
                         icon,
                         buttonText,
                         buttonIcon,
                         btnClass,
                         headerClass,
                         highlight,
                         onClick,
                     }: any) => (
    <motion.div
        className={`${styles.card} ${highlight ? styles.highlight : ""}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
    >
        <div className={`${styles.header} ${headerClass}`}>
            <img className={styles.bgImage} src={img} alt={title} />
            <div className={styles.headerContent}>
                <div className={styles.iconWrapper}>{icon}</div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
        </div>
        <div className={styles.footer}>
            <motion.button whileHover={{ scale: 1.05 }} className={`${styles.button} ${btnClass}`} onClick={onClick}>
                {buttonIcon}
                {buttonText}
            </motion.button>
        </div>
    </motion.div>
);


export const AuctionServicesCards = () => {
    const router = useRouter();
    const { closeMenu } = useSlideMenu();
    return (
        <section className={styles.grid}>
            {AUCTION_CARDS.map((card) => (
                <AuctionCard onClick={() => {
                    router.push(card.id)
                    closeMenu()

                }} key={card.id} {...card} />
            ))}
        </section>
    );
};
