'use client'

import React, { useEffect, useState } from 'react';
import styles from "./CarList.module.css";
import { CarCard } from "@/client/components";
import { AuctionParams, useAuctionListings } from "@/client/hooks";

export const CarList = () => {
    const [params, setParams] = useState<AuctionParams>({
        city: '',
        state: '',
        make: 'volkswagen',
        model: '',
        rows: 50
    });

    const { data } = useAuctionListings(params);


    return (
        <div className={styles.carList}>
            {data?.listings?.map((item: any) => (
                <CarCard
                    key={item.vin}
                    url={item.vdp_url}
                    title={`${item.build.year} ${item.build.make} ${item.build.model}`}
                    price="$129,900"
                    description="Revolutionary electric performance sedan with tri-motor setup. Autopilot capability and cutting-edge technology make this the future of luxury driving."
                    images={item.media?.photo_links}
                    vin={item.vin}
                    power="1020 HP"
                    range="405 mi"
                    year={item.build.year}
                    seller={{
                        name: item.dealer.name,
                        phone: item.dealer.phone,
                        seller_email: item.dealer.seller_email,
                        street: item.dealer.street,
                        state: item.dealer.state,
                        zip: item.dealer.zip,
                        website: item.dealer.website,
                    }}
                />
            ))}
        </div>
    );
};
