'use client'

import React, { FC } from "react";
import styles from "./SearchSection.module.css";
import { SearchHistory } from "./SearchHistory/SearchHistory";
import { SampleResults } from "./SampleResults/SampleResults";
import { LoadingMinute, Salvage } from "@/components";
import { useSearchParams } from "next/navigation";
import { useBaseInfoByVIN, useActionsHistory, useSalvageCheck, useCachedInfo, useProfile } from "@/hooks";
import { VinSearch } from "./VinSearch/VinSearch";
import cn from "classnames";

interface SearchSectionProps {
    openSubscription?: () => void
}

export const SearchSection: FC<SearchSectionProps> = ({ openSubscription }) => {
    const searchParams = useSearchParams();
    const { data: profileData } = useProfile()
    const vin = searchParams.get("vin") || '1C6RD6FT1CS310366';

    const actionsHistoryResponse = useActionsHistory({ skip: 0, take: 10 })

    const { data: cachedInfo, isLoading: isLoadingCarInfo } = useCachedInfo(vin)
    const { data: baseInfo, isLoading } = useBaseInfoByVIN(vin, cachedInfo?.cachedDataStatus);
    const { data: refetchedHasSalvage, isLoading: salvageIsLoading } = useSalvageCheck(vin, cachedInfo?.cachedDataStatus);

    const hasSalvage = cachedInfo?.cachedDataStatus.salvageInfoWasFound ? !!cachedInfo.salvage : !!refetchedHasSalvage

    return (
        <section className={styles.searchSection}>
            <div className={styles.container}>
                <div className={cn(styles.glass, {
                    [styles.bgClean]: !hasSalvage,
                    [styles.bgSalvage]: hasSalvage,
                })}>

                    <Salvage hasSalvage={hasSalvage} isPending={salvageIsLoading} />
                    {(isLoading || salvageIsLoading || isLoadingCarInfo) && <LoadingMinute label="We’re compiling the Vehicle History Report" />}
                    <div className={styles.searchSectionHeader}>
                        <div className={styles.header}>
                            <div className={styles.headerFlex}>
                                <div>
                                    <h1 className={styles.title}>{baseInfo?.Make} {baseInfo?.Model} {baseInfo?.Trim}</h1>
                                    <p className={styles.subtitle}>{baseInfo?.BodyClass} {baseInfo?.ModelYear}</p>
                                </div>
                                <div className={styles.textRight}>
                                    <div className={styles.vin}>VIN: {baseInfo?.VIN}</div>
                                    <div className={styles.country}>Made in {baseInfo?.PlantCountry}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <VinSearch openSubscription={openSubscription} />
                </div>
                <SampleResults baseInfo={baseInfo} reportsLeft={profileData?.subscriptionDetails.reportsLeft ?? 0} vin={vin} cacheStatus={cachedInfo?.cachedDataStatus}
                    cachedPricesInfo={cachedInfo?.marketAnalysis ?? []} />
                <SearchHistory searches={actionsHistoryResponse.data} isLoading={actionsHistoryResponse.isFetching || actionsHistoryResponse.isLoading} />
            </div>
        </section>
    );
}

