import type { NextConfig } from "next";
import withPWA from 'next-pwa';


const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            mysql: false,
            mariadb: false,
            sqlite3: false,
            better_sqlite3: false,
            typeorm: false,
            'react-native-sqlite-storage': false,
            '@sap/hana-client': false,
        };
        return config;
    },
    images: {
        domains: ['storage.googleapis.com', 'i.pravatar.cc'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    i18n: {
        locales: ['en', 'ru', 'es', 'hy'],
        defaultLocale: 'en',
        localeDetection: false
    },
};

export default withPWA({
    dest: 'public',
    disable: false,
    register: true,
    skipWaiting: true,
    sw: 'worker.js'
    // @ts-ignore
})(nextConfig);
