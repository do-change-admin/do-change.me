'use client';

import { Card, Badge, Button, Text, Group, Anchor } from '@mantine/core';
import {
    FaBarcode,
} from 'react-icons/fa';
import styles from './CarCard.module.css';
import { FC } from "react";
import { CardSlider } from "@/client/components";
import Link from "next/link";

interface SellerInfo {
    name: string;
    phone: string;
    seller_email: string;
    street: string;
    state: string;
    zip: string;
    website: string;
}

interface CarCardProps {
    title: string;
    price: string;
    description: string;
    images: string[];
    power: string;
    url: string;
    range: string;
    year: string;
    vin: string;
    seller: SellerInfo
}

export const CarCard: FC<CarCardProps> = ({
    title,
    price,
    seller,
    images,
    power,
    range,
    vin,
    url,
    year,
}) => {
    return (
        <Card radius="md" className={styles.card} component={Link} href={url} target="_blank">
            <Card.Section className={styles.imageWrapper}>
                <CardSlider images={images} />
            </Card.Section>
            {seller.website && (
                <Badge color="pink" className={styles.badgeWeb}>
                    <Anchor c="white" href={`https://${seller.website}`} target="_blank" size="xs" className={styles.badgeLink}>
                        {seller.website}
                    </Anchor>
                </Badge>
            )}
            <div className={styles.content}>
                <div className={styles.header} >
                    <Text fw={700} className={styles.title}>
                        {title}
                    </Text>
                    {/*<Text fw={700} size="lg" className={styles.price} c="blue">*/}
                    {/*    {price}*/}
                    {/*</Text>*/}
                </div>

                <div className={styles.description}>
                    <div className={styles.badgeGroup}>
                        {seller.phone && (
                            <Badge color="blue" variant="light" className={styles.badge}>
                                {seller.phone}
                            </Badge>
                        )}
                        {seller.seller_email && (
                            <Badge color="green" variant="light" className={styles.badge}>
                                {seller.seller_email}
                            </Badge>
                        )}
                        {(seller.street || seller.state || seller.zip) && (
                            <Badge color="gray" variant="light" className={styles.badge}>
                                {`${seller.street}, ${seller.state}, ${seller.zip}`}
                            </Badge>
                        )}
                    </div>
                </div>

                {/*<div className={styles.stats}>*/}
                {/*    <div className={styles.stat}>*/}
                {/*        <FaBolt className={styles.icon} />*/}
                {/*        <Text size="xs" c="dimmed">*/}
                {/*            Power*/}
                {/*        </Text>*/}
                {/*        <Text fw={600} size="sm">*/}
                {/*            {power}*/}
                {/*        </Text>*/}
                {/*    </div>*/}
                {/*    <div className={styles.stat}>*/}
                {/*        <FaBatteryFull className={styles.icon} />*/}
                {/*        <Text size="xs" c="dimmed">*/}
                {/*            Range*/}
                {/*        </Text>*/}
                {/*        <Text fw={600} size="sm">*/}
                {/*            {range}*/}
                {/*        </Text>*/}
                {/*    </div>*/}
                {/*    <div className={styles.stat}>*/}
                {/*        <FaCalendar className={styles.icon} />*/}
                {/*        <Text size="xs" c="dimmed">*/}
                {/*            Year*/}
                {/*        </Text>*/}
                {/*        <Text fw={600} size="sm">*/}
                {/*            {year}*/}
                {/*        </Text>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <Group grow className={styles.buttons}>
                    <Button
                        component={Link}
                        href={`/?vin=${vin}`}
                        variant="light"
                        color="pink"
                        radius="md"
                        fullWidth
                        leftSection={<FaBarcode size={18} />}
                    >
                        Check Vin: {vin}
                    </Button>
                </Group>
            </div>
        </Card>
    );
}
