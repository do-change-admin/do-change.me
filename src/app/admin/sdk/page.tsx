'use client';

import { Badge, Button, Card, Group, Image, Select, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { FaChevronDown, FaLink } from 'react-icons/fa6';
import { getColorByCarSaleStatus, getVisualDataByCarSaleMarketplaceLink } from '@/app/sdk/sdk.utils';
import { CarEditor } from '@/client/components/_admin/CarEditor/CarEditor';
import {
    useAdminSyndicationRequestFilters,
    useAdminSyndicationRequests
} from '@/client/queries/syndication-request-management.queries';
import type { SyndicationRequestStatus } from '@/entities/syndication-request';
import styles from './page.module.css';

export default function VehiclesPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [editingCarId, setEditingCarId] = useState<string | undefined>();
    const [vin, setVin] = useState('');
    const [debouncedVin] = useDebouncedValue(vin, 500);
    const [make, setMake] = useState<null | string>(null);
    const [model, setModel] = useState<null | string>(null);
    const [activeTab, setActiveTab] = useState<SyndicationRequestStatus>('pending publisher');

    const { data } = useAdminSyndicationRequests({
        make: make ?? '',
        model: model ?? '',
        status: activeTab,
        vin: debouncedVin
    });

    const { data: filters } = useAdminSyndicationRequestFilters();

    const handleClearFilters = () => {
        setVin('');
        setMake(null);
        setModel(null);
    };

    const handleClose = () => {
        setEditingCarId(undefined);
        close();
    };

    const handleEdit = (id: string) => {
        setEditingCarId(id);
        open();
    };

    const vehicles = data?.items ?? [];

    return (
        <div className={styles.container}>
            <Tabs mb="lg" onChange={(value) => setActiveTab(value as any)} value={activeTab}>
                <Tabs.List>
                    <Tabs.Tab value="pending publisher">
                        Pending Review{' '}
                        <Badge color="orange" ml={5} variant="light">
                            {/*vehicles.filter(v => v.status === 'Pending').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="active">
                        Active{' '}
                        <Badge color="green" ml={5} variant="light">
                            {/*vehicles.filter(v => v.status === 'Sold').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="pending sales">
                        Pending Sales{' '}
                        <Badge color="gray" ml={5} variant="light">
                            {/*vehicles.filter(v => v.status === 'Draft').length*/}
                        </Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="sold">
                        Sold{' '}
                        <Badge color="gray" ml={5} variant="light">
                            {/*vehicles.filter(v => v.status === 'Draft').length*/}
                        </Badge>
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            <Card className={styles.filtersCard} radius="md" shadow="sm" withBorder>
                <Stack>
                    <TextInput
                        label="Search by VIN Number"
                        leftSection={<FaSearch />}
                        onChange={(e) => setVin(e.currentTarget.value)}
                        placeholder="Enter VIN number..."
                        value={vin}
                    />
                    <Group>
                        <Select
                            data={filters?.makes}
                            label="Makes"
                            onChange={setMake}
                            placeholder="All Makes"
                            rightSection={<FaChevronDown />}
                            value={make}
                        />
                        <Select
                            data={filters?.models}
                            label="Models"
                            onChange={setModel}
                            placeholder="All Models"
                            rightSection={<FaChevronDown />}
                            value={model}
                        />
                    </Group>
                    <Group align="right">
                        <Button color="gray" leftSection={<FaTimes />} onClick={handleClearFilters} variant="outline">
                            Clear Filters
                        </Button>
                    </Group>
                </Stack>
            </Card>

            <div className={styles.vehicleGrid}>
                {vehicles.map((v) => {
                    return (
                        <Card
                            className={styles.vehicleCard}
                            onClick={() => handleEdit(v.id)}
                            radius="md"
                            shadow="sm"
                            withBorder
                        >
                            <Card.Section style={{ position: 'relative' }}>
                                <Image src={v.mainPhotoLink} />
                                {/* {<CardSlider images={photoLinks} />} */}
                                <Badge className={styles.statusBadge} color={getColorByCarSaleStatus(v.status)}>
                                    {v.status}
                                </Badge>
                            </Card.Section>
                            <Stack mt="sm">
                                <Text fw={600}>{v.make}</Text>
                                <Text c="dimmed" size="sm">
                                    {v.model} ({v.year})
                                </Text>
                                <Text c="dimmed" size="xs" style={{ fontFamily: 'monospace' }}>
                                    VIN: {v.vin}
                                </Text>
                                <Stack gap="xs" mt="xs">
                                    {v.marketplaceLinks.map((link) => {
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
                            </Stack>
                        </Card>
                    );
                })}
            </div>
            {opened && editingCarId && <CarEditor carId={editingCarId} onClose={handleClose} opened={opened} />}
        </div>
    );
}
