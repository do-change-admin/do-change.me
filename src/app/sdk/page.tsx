'use client';

import { ActionIcon, Badge, Button, Group, Loader, Select, Stack, TextInput } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { type FC, useState } from 'react';
import { FaChevronDown, FaLink, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { TbFilter } from 'react-icons/tb';
import { getColorByCarSaleStatus, getVisualDataByCarSaleMarketplaceLink } from '@/app/sdk/sdk.utils';
import { PlaceholderSDK } from '@/client/components';
import { CarAdder } from '@/client/components/CarAdder/CarAdder';
import { useCurrentSubscriptionInfo } from '@/client/queries/subscription.queries';
import { useSyndicationRequestFilters, useSyndicationRequests } from '@/client/queries/syndication-requests.queries';
import type { SyndicationRequestStatus } from '@/entities/syndication-request';
import styles from './page.module.css';

const STATUS_OPTIONS = ['draft', 'all active', 'pending publisher', 'active', 'pending sales', 'sold'];

const CarSyndicationSection: FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [openedFilters, openFilters] = useState(false);
    const [vin, setVin] = useState('');
    const [debouncedVin] = useDebouncedValue(vin, 500);
    const [make, setMake] = useState<null | string>(null);
    const [model, setModel] = useState<null | string>(null);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState<SyndicationRequestStatus | 'draft' | 'all active'>('all active');

    const { data: subscriptionInfo, isFetching: subscriptionLevelIsFetching } = useCurrentSubscriptionInfo();

    const { data, isLoading } = useSyndicationRequests({
        make: make ?? '',
        model: model ?? '',
        status: activeTab,
        vin: debouncedVin
    });
    const { data: filters, isLoading: isLoadingFilters } = useSyndicationRequestFilters();

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
        setVin('');
        setMake(null);
        setModel(null);
    };

    if (isLoading || isLoadingFilters || subscriptionLevelIsFetching) {
        return (
            <div className={styles.loader}>
                <Loader />
            </div>
        );
    }

    const _subscriptionLevel = subscriptionInfo?.level ?? 'no subscription';

    // if (subscriptionLevel !== "premium plan") {
    //     return (
    //         <div className={styles.container}>
    //             <NoAccessPage />
    //         </div>
    //     )
    // }

    //todo: убрать после полного тестирования
    if (!subscriptionInfo?.isAdmin) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.container}>
                    <PlaceholderSDK
                        description="This page is currently unavailable. Please try again later."
                        title="Page Temporarily Unavailable"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                {/* Header */}
                <motion.div
                    animate={{ opacity: 1 }}
                    className={styles.header}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.headerLeft}>
                        <div>
                            <h1 className={styles.title}>Vehicle Syndication</h1>
                            <p className={styles.subtitle}>
                                Manage and publish your inventory across multiple platforms
                            </p>
                        </div>
                    </div>
                </motion.div>
                {/* Filters Section */}
                <div className={styles.actionLeft}>
                    <Button bg="var(--cl-fio)" fullWidth leftSection={<FaPlus />} onClick={open} radius="lg">
                        Add Car
                    </Button>
                    <Group>
                        <Select
                            data={STATUS_OPTIONS}
                            onChange={(value) => setActiveTab(value as any)}
                            placeholder="Select Status"
                            radius="lg"
                            value={activeTab}
                        />
                        <ActionIcon
                            color="var(--cl-fio)"
                            onClick={() => openFilters((prev) => !prev)}
                            radius="lg"
                            size="lg"
                            variant={openedFilters ? 'filled' : 'outline'}
                        >
                            <TbFilter />
                        </ActionIcon>
                    </Group>
                </div>
                {openedFilters && (
                    <div
                        className={cn(styles.filtersSection, {
                            [styles.openFilters]: openedFilters
                        })}
                    >
                        <div className={styles.filtersGrid}>
                            <div className={styles.filterItem}>
                                <TextInput
                                    label="Search by VIN Number"
                                    leftSection={<FaSearch />}
                                    onChange={(e) => setVin(e.currentTarget.value)}
                                    placeholder="Enter VIN number..."
                                    radius="lg"
                                    value={vin}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <Select
                                    data={filters?.makes}
                                    label="Makes"
                                    onChange={setMake}
                                    placeholder="All Makes"
                                    radius="lg"
                                    rightSection={<FaChevronDown />}
                                    value={make}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <Select
                                    data={filters?.models}
                                    label="Model"
                                    onChange={setModel}
                                    placeholder="All Makes"
                                    radius="lg"
                                    rightSection={<FaChevronDown />}
                                    value={model}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <Button
                                    leftSection={<FaTimes />}
                                    onClick={handleClearFilters}
                                    radius="lg"
                                    variant="outline"
                                >
                                    Clean
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vehicle Cards Grid */}
                {!vehicles.length && <PlaceholderSDK />}
                <div className={styles.vehicleGrid}>
                    {(vehicles ?? []).map((car, i) => (
                        <motion.div className={styles.vehicleCard} key={i} whileHover={{ scale: 1.03 }}>
                            <div className={styles.vehicleImageWrapper}>
                                <img alt="" src={car.mainPhotoLink} />
                            </div>
                            <div className={styles.vehicleContent}>
                                <div className={styles.vehicleTop}>
                                    <Badge className={styles.statusBadge} color={getColorByCarSaleStatus(car.status)}>
                                        {car.status}
                                    </Badge>
                                    <span className={styles.vin}>VIN: {car.vin}</span>
                                </div>
                                <h3>
                                    {' '}
                                    {car.make} {car.model} ({car.year})
                                </h3>
                                <div className={styles.vehicleBottom}>
                                    <span className={styles.price}>${(car?.price / 1000).toFixed(3)}</span>
                                </div>
                            </div>
                            <Stack gap="xs" p="lg">
                                {car.marketplaceLinks.map((link) => {
                                    const { color, label } = getVisualDataByCarSaleMarketplaceLink(link);
                                    return (
                                        <Button
                                            color={color}
                                            fullWidth
                                            key={link}
                                            rightSection={<FaLink />}
                                            styles={{
                                                root: {
                                                    justifyContent: 'space-between'
                                                }
                                            }}
                                            variant="light"
                                        >
                                            {label}
                                        </Button>
                                    );
                                })}
                            </Stack>
                            <Stack>
                                {
                                    // @ts-expect-error
                                    car.status === 'draft' && <Button onClick={() => handleEdit(car.id)}>Edit</Button>
                                }
                            </Stack>
                        </motion.div>
                    ))}
                </div>
                {opened && <CarAdder draftId={editingId} onClose={handleClose} opened={opened} />}
            </div>
        </div>
    );
};

export default CarSyndicationSection;
