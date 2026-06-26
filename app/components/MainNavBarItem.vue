<template>
    <span class="dropdown block lg:inline-block">
        <a
            v-if="external"
            :href="url"
            class="block mt-4 xl:pt-1 xl:pb-1 xl:inline-block lg:mt-0 text-gray-500 hover:text-black lg:mr-2 xl:mr-4"
        >
            <slot></slot>
        </a>
        <NuxtLink
            v-else
            :class="{ menuBarItemActive: isSubpageActive(subpages) }"
            :to="url"
            class="block xl:pt-1 xl:pb-1 mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-black lg:mr-2 xl:mr-4"
        >
            <slot></slot>
        </NuxtLink>
        <div
            v-if="subpages.length > 0"
            class="block dropdown-content lg:absolute lg:hidden lg:bg-gray-200 lg:shadow-xl text-gray-500"
        >
            <a
                v-for="page in subpages"
                :class="{ subMenuItemActive: isSubActive(page.url) }"
                :href="page.url"
                class="block pt-3 pb-0 pl-2 pr-2 lg:p-2 hover:text-black"
                >{{ page.name }}</a
            >
        </div>
    </span>
</template>

<script setup>
defineProps(['url', 'external', 'subpages'])

const route = useRoute()

const isSubActive = (url) => {
    return url === route.path || url + '/' === route.path
}

const isSubpageActive = (subpages) => {
    return subpages.some(
        (page) => page.url === route.path || page.url + '/' === route.path
    )
}
</script>

<style>
.menuBarItemActive {
    color: #000;
    text-decoration-line: underline;
}

.subMenuItemActive {
    color: #000;
}

.dropdown-content {
    min-width: 160px;
    z-index: 1;
}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>
