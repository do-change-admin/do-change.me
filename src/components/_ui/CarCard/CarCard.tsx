"use client";

import { FC } from "react";
import { Card, Badge, Text } from "@mantine/core";
import {FaCar} from "react-icons/fa";
import styles from "./CarCard.module.css";
import { CardSlider } from "@/components";
import Link from "next/link";

export interface IDealer {
    id: number;
    website: string;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
    zip: string;
    msa_code: string;
    phone: string;
    seller_email: string;
}

export interface CarCardProps {
    car: {
        heading: string;
        build: { year: number; make: string; model: string };
        miles: number;
        price?: number;
        media: { photo_links: string[] };
        vdp_url: string;
        carfax_1_owner: boolean;
        carfax_clean_title: boolean;
        dealer: IDealer;
        vin: string;
    }
}

export const CarCard: FC<CarCardProps> = ({

                                              car,
                                          }) => {
    const { heading, build, miles, media, price, vdp_url } = car;
    const carfax1OwnerText = car.carfax_1_owner
        ? "Single Owner"
        : "Multiple Owners";

    const carfaxCleanTitleText = car.carfax_clean_title
        ? "Clean Title"
        : "Title Issues";

    const carfax1OwnerColor = car.carfax_1_owner ? "green" : "red";
    const carfaxCleanTitleColor = car.carfax_clean_title ? "green" : "red";
    return (
        <Card withBorder radius="lg" className={styles.container} target="_blank" component="a" href={car.vdp_url}>
            <Card.Section className={styles.imgWrapper}>
                <div className={styles.img}>
                    <CardSlider images={media?.photo_links} />
                </div>

                <div className={styles.badges}>
                    <Badge color="gray">
                        {car.dealer.state} / {car.dealer.city}
                    </Badge>
                    <Badge color="red">
                        {car.dealer.website}
                    </Badge>
                    <Badge color="yellow">
                        {car.dealer.phone}
                    </Badge>
                </div>

                {/*<ActionIcon*/}
                {/*    variant="filled"*/}
                {/*    color={isFavorited ? "red" : "gray"}*/}
                {/*    radius="lg"*/}
                {/*    size="md"*/}
                {/*    className={styles.like}*/}
                {/*>*/}
                {/*    <FaHeart color={isSelected ? "red" : "white"} />*/}
                {/*</ActionIcon>*/}
            </Card.Section>

            {/*<div className={styles.price}>*/}
            {/*    <Badge color={carfax1OwnerColor} variant="filled">*/}
            {/*        {carfax1OwnerText}*/}
            {/*    </Badge>*/}
            {/*    <Badge color={carfaxCleanTitleColor} variant="filled">*/}
            {/*        {carfaxCleanTitleText}*/}
            {/*    </Badge>*/}
            {/*</div>*/}

            <p className={styles.name}>
                {build.year} {build.make} {build.model}
            </p>

            <div className={styles.footer}>
                <div className={styles.review}>
                    <Badge
                        color="blue"
                        component={Link}
                        href={`/?vin=${car.vin}`}
                        leftSection={<FaCar size={14} />}
                        className={styles.checkVehicleHistory}
                    >
                        Check Vehicle History
                    </Badge>
                </div>
            </div>
        </Card>
    );
};
