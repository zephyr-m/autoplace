import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        origin: 'http://autoplace.127.0.0.1.sslip.io:5173',
        cors: {
            origin: [
                'http://autoplace.127.0.0.1.sslip.io:8080',
                'http://admin.autoplace.127.0.0.1.sslip.io:8080',
            ],
        },
        hmr: {
            host: 'autoplace.127.0.0.1.sslip.io',
            port: 5173,
            protocol: 'ws',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
