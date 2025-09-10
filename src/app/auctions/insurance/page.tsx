"use client";

import React from "react";
import { useSlideMenu } from "@/contexts";
import {InsuranceHeader} from "@/components/Insurance/InsuranceHeader";
import {InsuranceFilter} from "@/components/Insurance/InsuranceFilter";
import {CarList} from "@/components/Insurance/CarList";

export default function Insurance() {
    const { openMenu } = useSlideMenu();
    const handleOpenMenu = () => {
        openMenu(<InsuranceFilter />);
    };


    return (
        <>
            <InsuranceHeader openFilters={handleOpenMenu} />
            <CarList/>
        </>
    );
}
