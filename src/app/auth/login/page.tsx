import React from 'react';
import {CookieBanner, Login} from "@/components";

const Page = () => {
    return (
        <div>
            <Login/>
            <CookieBanner />
        </div>
    );
};

export default Page;