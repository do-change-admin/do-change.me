'use client';

import {useState, useEffect} from 'react';
import {Stack, MultiSelect, Group, RangeSlider, Button, Box, Text} from '@mantine/core';
import {FaFilter, FaCity, FaMapMarkerAlt, FaCar, FaDollarSign, FaIndustry} from 'react-icons/fa';
import styles from './InsuranceFilter.module.css';

const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const makeOptions = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi',
    'Tesla', 'Volkswagen', 'Hyundai', 'Kia', 'Lexus', 'Jeep', 'Subaru', 'Mazda',
    'Porsche', 'Dodge', 'GMC', 'Ram', 'Cadillac', 'Buick', 'Chrysler', 'Acura', 'Infiniti'
];

export const InsuranceFilter = () => {
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

    useEffect(() => {
        const storedStates = localStorage.getItem('states');
        const storedCities = localStorage.getItem('cities');
        const storedMakes = localStorage.getItem('makes');
        const storedPrice = localStorage.getItem('priceRange');

        if (storedStates) setSelectedStates(JSON.parse(storedStates));
        if (storedCities) setSelectedCities(JSON.parse(storedCities));
        if (storedMakes) setSelectedMakes(JSON.parse(storedMakes));
        if (storedPrice) setPriceRange(JSON.parse(storedPrice));
    }, []);

    const handleApply = () => {
        localStorage.setItem('states', JSON.stringify(selectedStates));
        localStorage.setItem('cities', JSON.stringify(selectedCities));
        localStorage.setItem('makes', JSON.stringify(selectedMakes));
        localStorage.setItem('priceRange', JSON.stringify(priceRange));
    };

    const handleClear = () => {
        setSelectedStates([]);
        setSelectedCities([]);
        setSelectedMakes([]);
        setPriceRange([0, 5000]);
        localStorage.removeItem('states');
        localStorage.removeItem('cities');
        localStorage.removeItem('makes');
        localStorage.removeItem('priceRange');
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h2>Filters</h2>
                <p>Find your perfect vehicle</p>
            </div>

            <Stack gap="md" className={styles.filters} justify="space-between">
                <Stack>
                    <MultiSelect
                        label={
                            <Group gap={5}>
                                <FaMapMarkerAlt/>
                                <span>State</span>
                            </Group>
                        }
                        placeholder="Select states..."
                        data={stateOptions}
                        value={selectedStates}
                        onChange={setSelectedStates}
                        searchable
                        clearable
                        radius="md"
                    />

                    <MultiSelect
                        label={
                            <Group gap={5}>
                                <FaCity/>
                                <span>City</span>
                            </Group>
                        }
                        placeholder="Select cities..."
                        data={[]} // Можно заменить на список городов
                        value={selectedCities}
                        onChange={setSelectedCities}
                        searchable
                        clearable
                        radius="md"
                    />

                    <MultiSelect
                        label={
                            <Group gap={5}>
                                <FaCar/>
                                <span>Make</span>
                            </Group>
                        }
                        placeholder="Select makes..."
                        data={makeOptions}
                        value={selectedMakes}
                        onChange={setSelectedMakes}
                        searchable
                        clearable
                        radius="md"
                    />

                    <Box>
                        <Group mb={5}>
                            <Group gap={5}>
                                <FaDollarSign/>
                                <Text size="sm" fw={500}>Price Range</Text>
                            </Group>
                            <Text size="sm" color="dimmed">
                                ${priceRange[0]} - ${priceRange[1]}
                            </Text>
                        </Group>
                        <RangeSlider
                            min={0}
                            max={5000}
                            step={50}
                            value={priceRange}
                            onChange={setPriceRange}
                            label={(val) => `$${val}`}
                            color="blue"
                            radius="md"
                        />
                    </Box>
                </Stack>
                <Group mt="md" grow>
                    <Button leftSection={<FaFilter/>} radius="md" onClick={handleApply}>
                        Apply Filters
                    </Button>
                    <Button leftSection={<FaIndustry/>} radius="md" variant="outline" onClick={handleClear}>
                        Reset Filters
                    </Button>
                </Group>
            </Stack>
        </div>
    );
};
