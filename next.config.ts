import type { NextConfig } from "next";

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
};

export default nextConfig;
