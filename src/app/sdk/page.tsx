'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaCar, FaChartLine, FaPlus, FaChevronDown, FaSyncAlt, FaDownload, FaFilter,
    FaTimes, FaEdit, FaClock, FaCheckCircle, FaHandshake, FaTrophy, FaEye, FaSearch, FaLink
} from 'react-icons/fa';
import styles from './page.module.css';
import { ActionIcon, Badge, Button, Input, Select, Stack, TextInput } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { SyndicationRequestStatusNames } from "@/entities/sindycation-request-status.entity";
import { useSyndicationRequestFilters, useSyndicationRequests } from "@/client/queries/syndication-requests.queries";
import { CarAdder } from "@/client/components/CarAdder/CarAdder";
import { getColorByCarSaleStatus, getVisualDataByCarSaleMarketplaceLink } from "@/app/sdk/sdk.utils";
import { PlaceholderSDK } from "@/client/components";

const cars = [
    {
        status: 'Active',
        vin: '1HGBH41JXMN109186',
        name: '2023 Honda Accord',
        price: '$28,500',
        views: 234,
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d1dfebe3ad-f49c7d201569260847c1.png',
        icon: <FaEye />,
        color: 'green'
    },
    {
        status: 'Pending Publisher',
        vin: '5NPE34AF4GH012345',
        name: '2024 BMW X5',
        price: '$65,900',
        views: null,
        processing: true,
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c8b1449594-d1f9f4473d74c96137ad.png',
        icon: <FaClock />,
        color: 'orange'
    },
    {
        status: 'Draft',
        vin: '1FTFW1ET5DFC12345',
        name: '2023 Ford F-150',
        price: '$42,750',
        views: null,
        editing: true,
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8682136f25-6f16f60c695c8551fc00.png',
        icon: <FaEdit />,
        color: 'yellow'
    }
];

const STATUS_OPTIONS = [
    'All Status',
    'Draft',
    'Pending Publisher',
    'Active',
    'Pending Sales',
    'Sold',
];

const CarSyndicationSection: FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [vin, setVin] = useState("");
    const [debouncedVin] = useDebouncedValue(vin, 500);
    const [make, setMake] = useState<null | string>(null);
    const [model, setModel] = useState<null | string>(null);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [activeTab, setActiveTab] =
        useState<SyndicationRequestStatusNames>("active");

    const { data } = useSyndicationRequests({
        make: make ?? "",
        model: model ?? "",
        status: activeTab,
        vin: debouncedVin,
    });
    const { data: filters } = useSyndicationRequestFilters();

    const vehicles = data?.items ?? [];

    const handleEdit = (id: string) => {
        setEditingId(id);
        open();
    };

    const handleClose = () => {
        setEditingId(undefined);
        close();
    };

    const handleClearFilters = () => {
        setVin("");
        setMake(null);
        setModel(null);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>

                {/* Header */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div>
                            <h1 className={styles.title}>Vehicle Syndication</h1>
                            <p className={styles.subtitle}>Manage and publish your inventory across multiple platforms</p>
                        </div>
                    </div>
                </motion.div>
                {/* Filters Section */}
                <div className={styles.actionLeft}>
                    <Button className={styles.addButton}
                        radius="lg"
                        leftSection={<FaPlus />}
                        onClick={open}
                    >
                        Add Car
                    </Button>
                    <div className={styles.selectWrapper}>
                        <Select
                            radius="lg"
                            placeholder="Select Status"
                            data={STATUS_OPTIONS}
                            value={activeTab}
                            onChange={(value) => setActiveTab(value as any)}
                        />
                    </div>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className={styles.filtersSection}>
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterItem}>
                            <TextInput
                                placeholder="Enter VIN number..."
                                label="Search by VIN Number"
                                radius="lg"
                                value={vin}
                                onChange={(e) => setVin(e.currentTarget.value)}
                                leftSection={<FaSearch />}
                            />
                        </div>

                        <div className={styles.filterItem}>
                            <Select
                                radius="lg"
                                label="Makes"
                                placeholder="All Makes"
                                value={make}
                                onChange={setMake}
                                data={filters?.makes}
                                rightSection={<FaChevronDown />}
                            />
                        </div>

                        <div className={styles.filterItem}>
                            <Select
                                radius="lg"
                                label="Model"
                                placeholder="All Makes"
                                value={model}
                                onChange={setModel}
                                data={filters?.models}
                                rightSection={<FaChevronDown />}
                            />
                        </div>

                        <div className={styles.filterItem}>
                            <Button leftSection={<FaTimes />}
                                onClick={handleClearFilters}
                                radius="lg"
                                variant="outline"
                            >
                                Clean
                            </Button>
                        </div>
                    </div>
                </motion.div>
                {/* Vehicle Cards Grid */}
                {!vehicles.length && <PlaceholderSDK />}
                <div className={styles.vehicleGrid}>

                    {(vehicles ?? []).map((car, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.03 }} className={styles.vehicleCard}>
                            <div className={styles.vehicleImageWrapper}>
                                <img src={car.photoLinks[0]} alt="" />
                            </div>
                            <div className={styles.vehicleContent}>
                                <div className={styles.vehicleTop}>
                                    <Badge
                                        color={getColorByCarSaleStatus(car.status)}
                                        className={styles.statusBadge}
                                    >
                                        {car.status}
                                    </Badge>
                                    <span className={styles.vin}>VIN: {car.vin}</span>
                                </div>
                                <h3> {car.make} {car.model} ({car.year})</h3>
                                <div className={styles.vehicleBottom}>
                                    <span className={styles.price}>${(car?.price / 100).toFixed(2)}</span>
                                </div>
                            </div>
                            <Stack gap="xs" p="lg">
                                {car.marketplaceLinks.map((link) => {
                                    const { color, label } =
                                        getVisualDataByCarSaleMarketplaceLink(
                                            link
                                        );
                                    return (
                                        <Button
                                            key={link}
                                            variant="light"
                                            color={color}
                                            fullWidth
                                            rightSection={<FaLink />}
                                            styles={{
                                                root: {
                                                    justifyContent:
                                                        "space-between",
                                                },
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    );
                                })}
                            </Stack>
                        </motion.div>
                    ))}
                </div>
                {opened && (
                    <CarAdder
                        draftId={editingId}
                        opened={opened}
                        onClose={handleClose}
                    />
                )}
            </div>
        </div>
    );
};

export default CarSyndicationSection;
