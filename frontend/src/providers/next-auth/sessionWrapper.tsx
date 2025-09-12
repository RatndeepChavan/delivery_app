'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function SessionWrapper({ children }: React.PropsWithChildren) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
