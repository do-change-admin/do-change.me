'use client'

import React from 'react';
import { ApplicationDetails } from "@/components";
import { useParams } from 'next/navigation';
import {UserCard} from "@/app/admin/[userId]/UserCard/UserCard";

const Page = () => {
    const params = useParams()
    const applicationId = params.userId as string;
    return (
        // <ApplicationDetails applicationId={requestId as string} />
        <UserCard applicationId={applicationId}/>
    );
};

export default Page;