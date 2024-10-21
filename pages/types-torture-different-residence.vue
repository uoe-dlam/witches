<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1>Types of Torture at Different Residence Locations</h1>
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
      <div class="embed-container-torture">
        <iframe
          width="500"
          height="400"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          title="Accused Witches - Manner of Torture"
          src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=30ef7872b00a463db3f7e8a3d5e84b04&extent=-11.4527,52.0439,4.7741,57.4788&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=light"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

definePageMeta({
  layout: "basic",
});

export default {
  data: () => ({}),
  methods: {
    showPageInfo() {
      Swal.fire({
        title: "Types of Torture at Different Residence Locations",
        html: "<div>This map shows the location of accused witches who are recorded to have suffered torture during their investigations. Data on this subject are far from complete, since in most cases nothing was written about torture in the trial records that form our main source. A witch’s confession would be recorded, but nothing would be said about how that confession was obtained. We have only a few scattered pieces of evidence about torture.</div>",
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
.embed-container-torture {
  position: relative;
  padding-bottom: 80%;
  height: 0;
  max-width: 100%;
}

.embed-container-torture iframe,
.embed-container-torture object,
.embed-container-torture iframe {
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
