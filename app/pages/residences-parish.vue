<template>
    <div>
        <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
            <div class="flex">
                <h1>
                    Number of Accused Witches That Resided In Each Modern Civil
                    Parish
                    <div
                        class="inline-flex items-center justify-center align-middle w-6 h-6 hover:w-7 hover:h-7 mb-1.5 ml-1 cursor-pointer"
                    >
                        <img
                            alt="Page Information Popup"
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
            <div class="embed-container-parish">
                <iframe
                    frameborder="0"
                    height="400"
                    marginheight="0"
                    marginwidth="0"
                    scrolling="no"
                    src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=379dbfae89704e31ba67e1811bc33605&extent=-7.4748,55.2089,0.6386,57.8114&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"
                    title="Parish Boundary Residence Location of Accused Witches"
                    width="500"
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
        title: 'Number of Accused Witches That Resided In Each Modern Civil Parish',
        html: '<div>This map shows the number of accused witches who resided within each civil parish. The parish boundaries displayed (source: National Records of Scotland) are from the 1930s. These boundaries are sometimes different from the parish boundaries during the period of the witchcraft trials.</div>',
        footer: 'witches.is.ed.ac.uk',
        confirmButtonText: 'Close',
        type: 'info',
        showCloseButton: true,
    })
}
</script>

<style>
.embed-container-parish {
    position: relative;
    padding-bottom: 80%;
    height: 0;
    max-width: 100%;
}

.embed-container-parish iframe,
.embed-container-parish object,
.embed-container-parish iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

small {
    position: absolute;
    z-index: 40;
    bottom: 0;
    margin-bottom: -15px;
}
</style>
