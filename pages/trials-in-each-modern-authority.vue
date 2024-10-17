<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl">
          Number of Trials Recorded in Each Modern Council Authority
        </h1>
        <div
          class="inline-flex items-center justify-center align-middle rounded-full border-r-2 border-l-2 border-gray-400 w-6 h-6 hover:w-7 hover:h-7 mb-0.5 ml-1 cursor-pointer"
        >
          <img
            src="/images/infoIcon.svg"
            class="w-full h-full pt-0.5"
            alt="Page Information Popup"
            @click="showPageInfo()"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="embed-container-council">
        <iframe
          width="900"
          height="640"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          title="Choropleth Map of Trial Location"
          src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=18afc056bff34ae3a7d76fade8cd195d&extent=-5.6973,55.3553,-1.6406,56.674&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

definePageMeta({
  layout: "default",
});

export default {
  data: () => ({}),
  methods: {
    showPageInfo() {
      Swal.fire({
        title: "Number of Trials Recorded in Each Modern Council Authority",
        html: "<div>This map indicates the number of trials which took place in each local authority area in Scotland. The local authority boundaries date from 1996 (source: Ordnance Survey Boundary-Line Map). These are not the same as the counties, presbyteries and burghs that existed during the period of the witchcraft trials.</div>",
        footer: "witches.is.ed.ac.uk",
        confirmButtonText: "Close",
        type: "info",
        showCloseButton: true,
      });
    },
  },
  computed: {},
  mounted: function () {},
};
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
