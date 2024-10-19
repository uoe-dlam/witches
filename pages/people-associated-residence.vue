<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1>
          People Associated with the Witch Trials: Residence and Occupation
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
      <div class="embed-location-people">
        <iframe
          width="500"
          height="400"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          title="People Associated With Trial - Residence Location with Recorded Occupation"
          src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=5d874d36222f45209a6faf7a348b5bd8&extent=-7.4825,54.0427,0.6309,56.7221&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=light"
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
        title:
          "People Associated with the Witch Trials: Residence and Occupation",
        html: "<div>This map shows the occupations of the people associated with the trials, where that is recorded. There are quite a few parish ministers and bailies (local magistrates in burghs), and a variety of other such occupations are recorded in smaller numbers.</div>",
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
.embed-location-people {
  position: relative;
  padding-bottom: 80%;
  height: 0;
  max-width: 100%;
}

.embed-location-people iframe,
.embed-location-people object,
.embed-location-people iframe {
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
