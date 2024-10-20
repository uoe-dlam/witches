<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex">
        <h1>
          Number of Accused Witches That Resided In Each Modern Civil Parish
          <div
            class="inline-flex items-center justify-center align-middle w-6 h-6 hover:w-7 hover:h-7 mb-1.5 ml-1 cursor-pointer"
          >
            <img
              src="/images/infoIcon.svg"
              class="w-full h-full pt-0.5"
              alt="Page Information Popup"
              @click="showPageInfo()"
            />
          </div>
        </h1>
      </div>
    </div>
    <div>
      <div class="embed-container-parish">
        <iframe
          width="500"
          height="400"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          title="Parish Boundary Residence Location of Accused Witches"
          src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=379dbfae89704e31ba67e1811bc33605&extent=-7.4748,55.2089,0.6386,57.8114&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"
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
        title:
          "Number of Accused Witches That Resided In Each Modern Civil Parish",
        html: "<div>This map shows the number of accused witches who resided within each civil parish. The parish boundaries displayed (source: National Records of Scotland) are from the 1930s. These boundaries are sometimes different from the parish boundaries during the period of the witchcraft trials.</div>",
        footer: "witches.is.ed.ac.uk",
        confirmButtonText: "Close",
        type: "info",
        showCloseButton: true,
      });
    },
  },
  computed: {},
  mounted() {},
};
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
