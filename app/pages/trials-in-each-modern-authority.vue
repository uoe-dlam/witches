<template>
    <div>
        <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
            <div class="flex">
                <h1>
                    Number of Trials Recorded in Each Modern Council Authority
                    <div
                        class="inline-flex items-center justify-center align-middle w-6 h-6 hover:w-7 hover:h-7 mb-1.5 ml-1 cursor-pointer"
                    >
                        <img
                            aria-label="Page Information Popup"
                            class="w-full h-full pt-0.5"
                            src="/images/infoIcon.svg"
                            @click="showPageInfo()"
                        />
                        <span class="visually-hidden"
                            >Page Information Pop Up</span
                        >
                    </div>
                </h1>
            </div>
        </div>
        <div>
            <div class="embed-container-council">
                <iframe
                    frameborder="0"
                    height="640"
                    marginheight="0"
                    marginwidth="0"
                    scrolling="no"
                    src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=18afc056bff34ae3a7d76fade8cd195d&extent=-5.6973,55.3553,-1.6406,56.674&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"
                    title="Choropleth Map of Trial Location"
                    width="900"
                ></iframe>
            </div>
        </div>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'default',
})

const showPageInfo = () => {
    Swal.fire({
        title: 'Number of Trials Recorded in Each Modern Council Authority',
        html: '<div>This map indicates the number of trials which took place in each local authority area in Scotland. The local authority boundaries date from 1996 (source: Ordnance Survey Boundary-Line Map). These are not the same as the counties, presbyteries and burghs that existed during the period of the witchcraft trials.</div>',
        footer: 'witches.is.ed.ac.uk',
        confirmButtonText: 'Close',
        type: 'info',
        showCloseButton: true,
    })
}
</script>

<style scoped>
.embed-container-council {
    position: relative;
    padding-bottom: 71%;
    height: 0;
    max-width: 100%;
}

.embed-container-council iframe,
.embed-container-council object,
.embed-container-council iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
