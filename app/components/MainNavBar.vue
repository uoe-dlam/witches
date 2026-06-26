<template>
    <div id="main-nav">
        <nav
            class="flex items-center justify-betweern flex-wrap bg-white pl-5 pr-5 pt-5 pb-3 w-full"
        >
            <NuxtLink to="/">
                <div class="flex items-center mr-3">
                    <div class="mr-4">
                        <h1>Witches</h1>
                        <span class="text-xs -mt-5"
                            >Survey of Scottish Witchcraft</span
                        >
                    </div>
                    <img
                        alt="logo"
                        src="/images/witches-cluster-composite.png"
                        width="90"
                    />
                    <img
                        alt="logo"
                        class="block lg:hidden"
                        src="~/assets/img/main-logo-badge.png"
                        width="75"
                    />
                </div>
            </NuxtLink>
            <div class="block lg:hidden">
                <button
                    class="flex items-center px-3 py-2 border rounded text-grey border-grey hover:text-grey hover:border-grey-dark"
                    @click="toggle"
                >
                    <svg
                        class="fill-current h-3 w-3"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>
            <div
                :class="open ? 'block' : 'hidden'"
                class="w-full block flex-grow lg:flex lg:items-center lg:w-auto"
                style="z-index: 1000"
            >
                <div class="text-md lg:flex-grow">
                    <main-nav-bar-item
                        v-for="link in links"
                        :key="link.url"
                        :external="link.external"
                        :subpages="link.subpages"
                        :url="link.url"
                    >
                        {{ link.name }}
                        <img
                            v-if="link.subpages.length"
                            class="w-4 h-4 inline-block"
                            src="/images/arrow-down.svg"
                        />
                    </main-nav-bar-item>
                </div>
            </div>
            <div class="flex items-center text-white mr-6 hidden xl:block">
                <img alt="logo" src="~/assets/img/main-logo.png" width="225" />
            </div>
        </nav>
        <div
            class="pr-12 border border-gray-200 bg-white pt-1 pb-1 text-xs w-full block float-left"
        >
            <NuxtLink
                class="font-sans float-right text-gray-500"
                to="/accessibility-statement"
                >Accessibility</NuxtLink
            >
        </div>
    </div>
</template>

<script setup>
import MainNavBarItem from '~/components/MainNavBarItem.vue'

const open = ref(false)
const links = ref([
    {
        name: 'Accused Witches',
        url: '#',
        external: false,
        subpages: [
            {
                name: 'Witchcraft Prosecutions In Time and Place',
                url: '/',
                external: false,
            },
            {
                name: 'Timeline Search',
                url: '/timeline-search',
                external: false,
            },
            {
                name: 'Residences on ArcGIS',
                url: '/residences-on-argis',
                external: false,
            },
            {
                name: 'Residences Within Each Parish',
                url: '/residences-parish',
                external: false,
            },
            {
                name: 'Death Locations',
                url: '/death-locations',
                external: false,
            },
            {
                name: 'Linking Residence to Place of Death',
                url: '/link-residence-death',
                external: false,
            },
        ],
    },
    {
        name: 'Investigations',
        url: '#',
        external: false,
        subpages: [
            {
                name: 'Case Characterisations',
                url: '/case-characterisations',
                external: false,
            },
            {
                name: 'Witches Meetings',
                url: '/witches-meetings',
                external: false,
            },
            {
                name: 'Shapeshifting and Ritual Objects',
                url: '/shapeshifting-ritual-objects',
                external: false,
            },
        ],
    },
    {
        name: 'Trials',
        url: '#',
        external: false,
        subpages: [
            {
                name: 'Named Witches',
                url: '/named-witches',
                external: false,
            },
            {
                name: 'Detention Locations',
                url: '/detention-locations',
                external: false,
            },
            {
                name: 'Trial Locations',
                url: '/trial-locations',
                external: false,
            },
            {
                name: 'Trials in Each Modern Authority',
                url: '/trials-in-each-modern-authority',
                external: false,
            },
            {
                name: 'Types of Torture at Different Residence Locations',
                url: '/types-torture-different-residence',
                external: false,
            },
            {
                name: 'Trial Procedures',
                url: '/trial-procedures',
                external: false,
            },
        ],
    },
    {
        name: 'People Involved',
        url: '#',
        external: false,
        subpages: [
            {
                name: 'People Associated with the Witch Trials: Residence and Occupation',
                url: '/people-associated-residence',
                external: false,
            },
            {
                name: 'A Witch-Prickers Journey',
                url: '/witch-pricker',
                external: false,
            },
        ],
    },
    {
        name: 'Extra Visualisations',
        url: '#',
        external: false,
        subpages: [
            {
                name: "Accused Witches' Occupations",
                url: '/accused-witches-occupations',
                external: false,
            },
            {
                name: 'The Story of Isobel Young',
                url: '/story-isobel-young',
                external: false,
            },
            {
                name: 'Ordeal Bubble Chart',
                url: '/ordeal-bubble-chart',
                external: false,
            },
            {
                name: 'Social Bubble Chart',
                url: '/social-bubble-chart',
                external: false,
            },
            {
                name: 'A Witch Tour of Edinburgh',
                url: '/witch-tour-edinburgh',
                external: false,
            },
            {
                name: 'The Devil in Scotland',
                url: '/devil-in-scotland',
                external: false,
            },
        ],
    },
    {
        name: 'Memorials & Sites of Interest',
        url: '/memorials',
        external: false,
        subpages: [],
    },
    {
        name: 'About',
        url: '#',
        external: false,
        subpages: [
            { name: 'Overview', url: '/about', external: false },
            {
                name: 'Introduction to Scottish Witchcraft',
                url: '/introduction',
                external: false,
            },
            { name: 'Glossary', url: '/glossary', external: false },
            {
                name: 'References',
                url: '/references',
                external: false,
            },
            {
                name: 'Resources',
                url: '/resources',
                external: false,
            },
            {
                name: 'Interview with Prof. Julian Goodare',
                url: '/interview',
                external: false,
            },
            {
                name: 'Further Reading',
                url: '/further-reading',
                external: false,
            },
            { name: 'Contact', url: '/contact', external: false },
        ],
    },
    {
        name: 'Blog',
        url: 'https://blogs.ed.ac.uk/witchcraft_visualisation/',
        external: true,
        subpages: [],
    },
])

const toggle = () => {
    open.value = !open.value
}
</script>
