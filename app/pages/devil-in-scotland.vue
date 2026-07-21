<template>
    <div>
        <div class="h-full">
            <iframe
                v-if="isLargeScreen"
                class="flourish-embed-iframe"
                frameborder="0"
                sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                scrolling="no"
                src="https://flo.uri.sh/visualisation/11211885/embed"
                style="width: 100%; height: 600px"
                title="Interactive or visual content"
            ></iframe>
            <iframe
                v-else
                class="flourish-embed-iframe"
                frameborder="0"
                sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                scrolling="no"
                src="https://flo.uri.sh/visualisation/19923204/embed"
                style="width: 100%; height: 600px"
                title="Interactive or visual content"
            ></iframe>
            <div
                style="
                    width: 100%;
                    margin-top: 4px !important;
                    text-align: right !important;
                "
            >
                <a
                    :href="
                        isLargeScreen
                            ? 'https://public.flourish.studio/visualisation/11211885/?utm_source=embed&utm_campaign=visualisation/11211885'
                            : 'https://public.flourish.studio/visualisation/19923204/?utm_source=embed&utm_campaign=visualisation/19923204'
                    "
                    class="flourish-credit"
                    style="text-decoration: none !important"
                    target="_top"
                >
                    <img
                        alt="Made with Flourish"
                        src="https://public.flourish.studio/resources/made_with_flourish.svg"
                        style="
                            width: 105px !important;
                            height: 16px !important;
                            border: none !important;
                            margin: 0 !important;
                        "
                    />
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
const isLargeScreen = ref(false)

const getScreenSize = () => {
    isLargeScreen.value = window.innerWidth > 768
}

onMounted(() => {
    getScreenSize()

    window.addEventListener('resize', getScreenSize.value)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenSize.value)
})
</script>
