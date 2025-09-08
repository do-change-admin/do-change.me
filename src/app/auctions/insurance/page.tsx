"use client";

import React, {useEffect, useState} from "react";
import styles from "./page.module.css";
import {
    FaBell,
} from "react-icons/fa";
import {CarCard} from "@/components";
import {AuctionParams, useAuctionListings} from "@/hooks";

export default function Insurance() {
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [price, setPrice] = useState<number>(500);

    const [params, setParams] = useState<AuctionParams>()

    useEffect(() => {
        const params: AuctionParams = {
            city: city,
            state: state,
            make: make,
            model: model,
            price_range: price ? `0-${price}` : ``
        };
        setParams(params);
    }, [city, state, make, model, price, setParams]);

    const handleReset = () => {
        setCity('');
        setState('');
        setMake('');
        setModel('');
        setPrice(500);
    };

    const { data, isLoading, isError, error } = useAuctionListings({ rows: 50, state: "CA", make: 'Toyota' });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <section className={styles.insurance}>
            <div className={styles.overlay}></div>
            <img
                className={styles.bgImage}
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/bc77c00253-df52ce3651ba8510878a.png"
                alt="background"
            />

            <div className={styles.content}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <div className={styles.logoNav}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>Insurance Auctions</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.buttons}>
                            <button className={styles.iconButton}>
                                <FaBell/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>


            <div className={styles.carList}>
                {data?.listings && data?.listings?.map((item: any) => (
                    <CarCard key={item.id} car={item}/>
                ))}
            </div>
            </>
    );
};
