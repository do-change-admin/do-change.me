import React from 'react';
import { CookieBanner, Login } from "@/client/components";

const Page = () => {
    return (
        <div>
            <Login />
            <CookieBanner />
        </div>
    );
};

export default Page;