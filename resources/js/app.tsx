import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob<{ default: ComponentType }>('./pages/*/ui/*Page.tsx', { eager: true });
        const pageName = name.toLowerCase();

        return pages[`./pages/${pageName}/ui/${name}Page.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
