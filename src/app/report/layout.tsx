'use client'

import React, { Suspense } from 'react';

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <div>{children}</div>
        </Suspense>
    );
}
