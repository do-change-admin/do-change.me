'use client';

import { useState } from 'react';
import {
    Button,
    Tabs,
    TextInput,
    Select,
    Card,
    Grid,
    Badge,
    Group,
    Text,
    Stack, Image,
} from '@mantine/core';
import { FaPlus, FaSearch, FaLink, FaTimes, FaChevronDown } from 'react-icons/fa';
import styles from './page.module.css';

type Vehicle = {
    id: number;
    name: string;
    make: string;
    model: string;
    vin: string;
    status: 'Active' | 'Pending' | 'Sold' | 'Draft';
    links: { label: string; color: 'blue' | 'orange' | 'green' }[];
    img: string;
    alt: string;
};

const vehicles: Vehicle[] = [
    {
        id: 1,
        name: 'BMW 3 Series',
        make: 'BMW',
        model: '3 Series',
        vin: '1HGCM82633A123456',
        status: 'Active',
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c75ec488ca-7683147cb5c26bb93038.png',
        alt: 'luxury sedan BMW 3 series silver metallic parked professional automotive photography',
        links: [
            { label: 'cruz.com', color: 'blue' },
            { label: 'carsforsale.com', color: 'orange' },
            { label: 'cargurus.com', color: 'green' },
        ],
    },
    {
        id: 2,
        name: 'Toyota Camry',
        make: 'Toyota',
        model: 'Camry',
        vin: '4T1BF1FK8CU789012',
        status: 'Active',
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b8b282106d-769655c6e870fa30e5cc.png',
        alt: 'red Toyota Camry sedan parked dealership lot professional automotive photography',
        links: [
            { label: 'cruz.com', color: 'blue' },
            { label: 'carsforsale.com', color: 'orange' },
        ],
    },
    {
        id: 3,
        name: 'Honda Accord',
        make: 'Honda',
        model: 'Accord',
        vin: '1HGCV1F30JA345678',
        status: 'Active',
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/dc74777fdc-a44fff8b028386cfef01.png',
        alt: 'white Honda Accord sedan modern design professional automotive photography',
        links: [
            { label: 'cruz.com', color: 'blue' },
            { label: 'cargurus.com', color: 'green' },
        ],
    },
    {
        id: 4,
        name: 'Ford F-150',
        make: 'Ford',
        model: 'F-150',
        vin: '1FTFW1ET5DFC901234',
        status: 'Active',
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/71312bcbc3-08e64ac694302364e300.png',
        alt: 'blue Ford F-150 pickup truck dealership professional automotive photography',
        links: [
            { label: 'carsforsale.com', color: 'orange' },
            { label: 'cargurus.com', color: 'green' },
        ],
    },
    {
        id: 5,
        name: 'Mercedes C-Class',
        make: 'Mercedes',
        model: 'C-Class',
        vin: '55SWF4KB5FU567890',
        status: 'Active',
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b28529d10d-66904b6fe4286563ac5c.png',
        alt: 'black Mercedes C-Class luxury sedan professional automotive photography',
        links: [
            { label: 'cruz.com', color: 'blue' },
            { label: 'carsforsale.com', color: 'orange' },
            { label: 'cargurus.com', color: 'green' },
        ],
    },
    {
        id: 6,
        name: 'Chevrolet Silverado',
        make: 'Chevrolet',
        model: 'Silverado',
        vin: '1GCRYDED5JZ123456',
        status: 'Active',
        img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/21bc379681-fa6d587cc28f98ca84c6.png',
        alt: 'gray Chevrolet Silverado pickup truck professional automotive photography',
        links: [
            { label: 'cruz.com', color: 'blue' },
            { label: 'cargurus.com', color: 'green' },
        ],
    },
];

export default function VehiclesPage() {
    const [vin, setVin] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [activeTab, setActiveTab] = useState<'Active' | 'Pending' | 'Sold' | 'Draft'>('Active');

    const filteredVehicles = vehicles.filter(
        (v) =>
            v.status === activeTab &&
            v.vin.toLowerCase().includes(vin.toLowerCase()) &&
            (make ? v.make === make : true) &&
            (model ? v.model === model : true)
    );

    return (
        <main className={styles.container}>
            {/* Add Vehicle Button */}
            <Group mb="lg">
                <Button leftSection={<FaPlus />} color="blue" radius="md" className={styles.addButton}>
                    Add Vehicle
                </Button>
            </Group>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value as any)} mb="lg">
                <Tabs.List>
                    <Tabs.Tab value="Active">
                        Active <Badge color="blue" variant="light" ml={5}>{vehicles.filter(v => v.status==='Active').length}</Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="Pending">
                        Pending Publisher <Badge color="orange" variant="light" ml={5}>{vehicles.filter(v => v.status==='Pending').length}</Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="Sold">
                        Sold <Badge color="green" variant="light" ml={5}>{vehicles.filter(v => v.status==='Sold').length}</Badge>
                    </Tabs.Tab>
                    <Tabs.Tab value="Draft">
                        Draft <Badge color="gray" variant="light" ml={5}>{vehicles.filter(v => v.status==='Draft').length}</Badge>
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {/* Filters */}
            <Card shadow="sm" radius="md" withBorder className={styles.filtersCard}>
                <Stack>
                    <TextInput
                        placeholder="Enter VIN number..."
                        label="Search by VIN Number"
                        value={vin}
                        onChange={(e) => setVin(e.currentTarget.value)}
                        leftSection={<FaSearch />}
                    />
                    <Group>
                        <Select
                            label="Makes"
                            placeholder="All Makes"
                            value={make}
                            onChange={setMake}
                            data={Array.from(new Set(vehicles.map(v => v.make)))}
                            rightSection={<FaChevronDown />}
                        />
                        <Select
                            label="Models"
                            placeholder="All Models"
                            value={model}
                            onChange={setModel}
                            data={Array.from(new Set(vehicles.map(v => v.model)))}
                            rightSection={<FaChevronDown />}
                        />
                    </Group>
                    <Group align="right">
                        <Button variant="outline" color="gray" leftSection={<FaTimes />} onClick={() => {setVin(''); setMake(''); setModel('');}}>
                            Clear Filters
                        </Button>
                    </Group>
                </Stack>
            </Card>

            {/* Vehicles Grid */}
            <div className={styles.vehicleGrid}>
                {filteredVehicles.map((v) => (
                        <Card shadow="sm" radius="md" withBorder className={styles.vehicleCard}>
                            <Card.Section style={{ position: 'relative' }}>
                                <Image src={v.img} alt={v.alt} className={styles.vehicleImg} />
                                <Badge
                                    color={v.status === 'Active' ? 'green' : v.status === 'Pending' ? 'orange' : v.status==='Sold'?'blue':'gray'}
                                    className={styles.statusBadge}
                                >
                                    {v.status}
                                </Badge>
                            </Card.Section>
                            <Stack mt="sm">
                                <Text fw={600}>{v.name}</Text>
                                <Text size="sm" c="dimmed">{v.make}</Text>
                                <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>VIN: {v.vin}</Text>
                                <Stack gap="xs" mt="xs">
                                    {v.links.map((link) => (
                                        <Button
                                            key={link.label}
                                            variant="light"
                                            color={link.color}
                                            fullWidth
                                            rightSection={<FaLink />}
                                            styles={{ root: { justifyContent: 'space-between' } }}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Stack>
                        </Card>
                ))}
            </div>
        </main>
    );
}
