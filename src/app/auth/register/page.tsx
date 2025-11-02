import React from 'react';
import { CookieBanner, Register } from "@/client/components";

const RegisterPage = () => {
    return (
        <div>
            <Register />
            <CookieBanner />
        </div>
    );
};

export default RegisterPage;