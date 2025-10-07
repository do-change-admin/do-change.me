import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.spec.ts'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        coverage: {
            reporter: ['text', 'html', 'json-summary'],
            include: ['src/services/**/*.ts'],
            exclude: ['**/*.mappers.ts', '**/*.models.ts', '**/index.ts'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});

