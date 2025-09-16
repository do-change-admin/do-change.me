'use client'

import React from 'react';
import { ApplicationDetails } from "@/components";
import { useParams } from 'next/navigation';

const Page = () => {
    const params = useParams()
    const requestId = params.userId
    return (
        <ApplicationDetails applicationId={requestId as string} />
    );
};

export default Page;