"use client";

import React from "react";
import { useSlideMenu } from "@/client/contexts";
import { InsuranceHeader } from "@/client/components/Insurance/InsuranceHeader";
import { InsuranceFilter } from "@/client/components/Insurance/InsuranceFilter";
import { CarList } from "@/client/components/Insurance/CarList";

export default function Insurance() {
    const { openMenu } = useSlideMenu();
    const handleOpenMenu = () => {
        openMenu(<InsuranceFilter />);
    };


    return (
        <>
            <InsuranceHeader openFilters={handleOpenMenu} />
            <CarList />
        </>
    );
}
