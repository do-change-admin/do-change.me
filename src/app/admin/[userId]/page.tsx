import React, { FC } from 'react';
import { ApplicationDetails } from "@/components";

type PageProps = {
    params: {
        userId: string;
    }
}
const Page: FC<PageProps> = ({ params }) => {
    const requestId = params.userId
    return (
        <ApplicationDetails applicationId={requestId} />
    );
};

export default Page;