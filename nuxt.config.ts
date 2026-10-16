// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
    compatibilityDate: '2026-06-12',
    devtools: { enabled: false },
    runtimeConfig: {
        public: {
            baseURL:
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:8181'
                    : 'https://witches.is.ed.ac.uk',
            supportEmail: 'ltw-apps-dev@ed.ac.uk',
        },
    },
    app: {
        head: {
            title: process.env.npm_package_name || '',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    name: 'description',
                    content: process.env.npm_package_description || '',
                },
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        },
    },
    css: ['~/assets/css/tailwind.css'],
    plugins: [
        { src: '~/plugins/vue-gtag', mode: 'client' },
        { src: '~/plugins/leaflet', mode: 'client' },
    ],
    modules: [
        'nuxt-font-loader',
        '@nuxtjs/leaflet',
        '@nuxt/eslint',
    ],
    build: {
        transpile: ['@vuepic/vue-datepicker'],
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: [
                '@vue-leaflet/vue-leaflet',
                '@vueform/slider',
                'leaflet',
                'leaflet.markercluster',
                'sweetalert2',
                'vue-gtag',],
        },
    },
    fontLoader: {
        external: [
            {
                src: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
                family: 'Roboto',
            },
            {
                src: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
                family: 'EB Garamond',
            },
        ],
    },
})
