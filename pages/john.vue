<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl">
          The Journey of a Witch-Pricker - John Kincaid of Tranent
        </h1>
        <span
          class="
            rounded-full
            border-r border-l border-gray-400
            w-6
            h-6
            flex
            items-center
            justify-center
            ml-2
          "
        >
          <!-- icon by feathericons.com -->
          <svg
            aria-hidden="true"
            class=""
            data-reactid="266"
            fill="none"
            height="24"
            stroke="#606F7B"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            @click="showPageInfo()"
          >
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="8"></line>
          </svg>
        </span>
      </div>
    </div>
    <div>
      <div class="embed-container-john">
        <iframe
          width="500"
          height="400"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          title="The Story of John Kincaid"
          src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=6c3d5b6e5bf34189879f44ed69fc6391&extent=-7.5921,53.4613,0.4554,56.148&zoom=true&previewImage=false&scale=true&disable_scroll=false&theme=light"
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
        title: "The Journey of a Witch-Pricker",
        html: '<div>John Kincaid was a notorious witch-pricker who was skilled in finding the Devil’s mark on witchcraft suspects. The mark was believed to be an insensitive spot made by the Devil; it was detected by pricking with a pin until a spot was found where the pin could be inserted without pain. Kincaid resided in Tranent and mainly worked in Lothian, but he also moved through the east coast of Scotland and even down to England. He was an active witch-pricker from 1649 onwards. In 1662 he was arrested on suspicion of fraud, and released on promising not to do any more pricking. This is the last that we hear of him.<b class="font-bold">Move around the map and read about the different cases that John Kincaid was involved in by clicking on the different symbols on the map.</b></div>',
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
.embed-container-john {
  position: relative;
  padding-bottom: 80%;
  height: 0;
  max-width: 100%;
}

.embed-container-john iframe,
.embed-container-john object,
.embed-container-john iframe {
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
