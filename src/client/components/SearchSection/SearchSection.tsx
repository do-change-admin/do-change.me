'use client';

import cn from 'classnames';
import {useRouter, useSearchParams} from 'next/navigation';
import { type FC, useEffect, useState } from 'react';
import { FaHashtag } from 'react-icons/fa';
import {LoadingMinute, MarketAnalytics, Salvage} from '@/client/components';
import {useActionsHistory, useBaseInfoByVIN, useOdometer, useProfile, useSalvageCheck} from '@/client/hooks';
import { useVINAnalysisState } from '@/client/states/vin-analysis.state';
import { SampleResults } from './SampleResults/SampleResults';
import { SearchHistory } from './SearchHistory/SearchHistory';
import styles from './SearchSection.module.css';
import { VinSearch } from './VinSearch/VinSearch';
import {useVehiclePriceQuery} from "@/client/components/MarketAnalytics/useVehiclePriceQuery";
import {Odometer} from "@/client/components/SearchSection/Odometer/Odometer";
import {CarInfo} from "@/client/components/SearchSection/CarInfo/CarInfo";
import {ReportsProvider} from "@/client/components/ReportsProvider/ReportsProvider";
import {useDebouncedValue} from "@mantine/hooks";

interface SearchSectionProps {
    openSubscription?: () => void;
}

const MOCK_DATA = {
    "status": true,
    "code": 200,
    "data": {
        "vin": "SCBFR7ZA5CC072256",
        "success": true,
        "id": "2012_bentley_continental-gt_",
        "vehicle": "2012 Bentley Continental  GT ",
        "mean": 38059.99,
        "stdev": 10641,
        "count": 59,
        "mileage": 100000,
        "certainty": 99,
        "period": [
            "2025-08-18",
            "2026-01-04"
        ],
        "prices": {
            "above": 47081.26,
            "average": 38059.99,
            "below": 29038.72,
            "distribution": [
                {
                    "group": {
                        "count": 6,
                        "max": 33886,
                        "min": 28821
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 36368,
                        "min": 33886
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 38646,
                        "min": 36368
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 41531,
                        "min": 38646
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 42385,
                        "min": 41531
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 46456,
                        "min": 42385
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 50012,
                        "min": 46456
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 50860,
                        "min": 50012
                    }
                },
                {
                    "group": {
                        "count": 6,
                        "max": 59341,
                        "min": 50860
                    }
                },
                {
                    "group": {
                        "count": 5,
                        "max": 63580,
                        "min": 59341
                    }
                }
            ]
        },
        "adjustments": {
            "mileage": {
                "adjustment": -8037,
                "average": 46418.53,
                "input": 100000
            },
            "history": {
                "records": [
                    {
                        "type": "accident",
                        "date": "2012-05-19"
                    },
                    {
                        "type": "accident",
                        "date": "2016-01-03"
                    },
                    {
                        "type": "salvage",
                        "date": "2019-09-27"
                    }
                ],
                "adjustment": -6836
            },
            "condition": {
                "input": null,
                "adjustment": 0
            },
            "known_damage": {
                "input": null,
                "adjustment": 0
            }
        },
        "type": "retail"
    },
    "message": "Data Fetched Successfully!"
}

export const SearchSection: FC<SearchSectionProps> = ({ openSubscription }) => {
    const searchParams = useSearchParams();
    const { data: profileData } = useProfile();
    const { data: actionsHistory, isLoading: isActionsHistoryLoading } = useActionsHistory();
    const lastCarVin = Object.keys(actionsHistory || {})?.[0];
    const initialVIN = searchParams.get('vin') || (isActionsHistoryLoading ? null : lastCarVin || '1C6RD6FT1CS310366');

    const setRequestVIN = useVINAnalysisState((x) => x.setRequestVIN);
    const requestVIN = useVINAnalysisState((x) => x.requestVIN);

    useEffect(() => {
        if (initialVIN) {
            setRequestVIN(initialVIN);
        }
    }, [initialVIN]);

    const [activeTab, setActiveTab] = useState<'vin' | 'plate'>('vin');
    const { data: baseInfo, isLoading } = useBaseInfoByVIN(requestVIN);
    const { data: odometerData, isFetching: isoOometerDataLoading } = useOdometer(requestVIN);
    const lastMileageRecord = odometerData?.at()?.miles;
    const [miles, setMiles] = useState<string>('');
    const [debouncedMiles] = useDebouncedValue(miles, 1500);
    const { data: marketData, isLoading: isMarketDataLoading } = useVehiclePriceQuery({
        vin: requestVIN || '',
        mileage: debouncedMiles,
    })

    const isAdmin = (process.env.ADMIN_EMAILS?.split(',') ?? []).includes(profileData?.email ?? '');
    const route = useRouter()

    console.log('lastMileageRecord', lastMileageRecord)

    useEffect(() => {
        if (!!lastMileageRecord && !isMarketDataLoading && !miles) {
            setMiles(lastMileageRecord);
            return;
        }
    }, [lastMileageRecord, isMarketDataLoading, isoOometerDataLoading]);

    return (
        <section className={styles.searchSection}>
            {(isLoading || isActionsHistoryLoading || isMarketDataLoading || isoOometerDataLoading) && <LoadingMinute />}
            <div className={styles.container}>
                <div className={styles.glass}>
                    <VinSearch />
                </div>
                <MarketAnalytics miles={miles} setMiles={setMiles} data={marketData}/>
                {odometerData && <Odometer records={odometerData}/>}
                {baseInfo && <CarInfo {...baseInfo} />}
                <ReportsProvider openSubscription={openSubscription} />
                <SearchHistory isLoading={isActionsHistoryLoading} searches={actionsHistory} />
            </div>
        </section>
    );
};
