<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl">People Associated with the Witch Trials: Residence</h1>
        <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
          <!-- icon by feathericons.com -->
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="8"></line>
          </svg>
        </span>
      </div>
    </div>
    <div>
      <div class="embed-location-peopleloc">
        <iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="People Associated With Trial" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=c752892fbd774cbe96eb2ce673b90507&extent=-11.5008,52.0176,4.726,57.4558&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=light"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'default'
});

export default {
  data: () => ({}),
  methods: {
    showPageInfo() {
      Swal.fire({
        title: 'People Associated with the Witch Trials: Residence',
        html: '<div>The people on this map were not accused of witchcraft; instead they played other roles in the trials, typically as accusers, judges or investigators of some kind. This map shows the residence location for those people for whom that can be determined. There are currently another 600 recorded people that are yet to have their residence located.</div>',
        footer: 'witches.is.ed.ac.uk',
        confirmButtonText: 'Close',
        type: 'info',
        showCloseButton: true,
      });
    }
  },
  computed: {},
  mounted() {}
};
</script>

<style>
.embed-location-peopleloc {
  position: relative;
  padding-bottom: 80%;
  height: 0;
  max-width: 100%;
}

.embed-location-peopleloc iframe,
.embed-location-peopleloc object,
.embed-location-peopleloc iframe {
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
