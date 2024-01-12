<template>
  <div style="height:100%;">
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl">People Associated with the Witch Trials: Residence and Occupation</h1>
        <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
          <!-- icon by feathericons.com -->
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
            <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
          </svg>
        </span>
      </div>

    </div >
    <div style="height:90%;">
      <style>
        .embed-container {
          position: relative;
          padding-bottom: 100%; /* Set padding-bottom to 100% to maintain aspect ratio */
          height: 0;
          max-width: 100%;
        }

        .embed-container iframe,
        .embed-container object,
        .embed-container iframe {
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
      <div class="embed-container" style="height:100%;">
        <iframe  frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="People Associated With Trial - Residence Location with Recorded Occupation" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=5d874d36222f45209a6faf7a348b5bd8&extent=-7.4825,54.0427,0.6309,56.7221&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=light"></iframe>
      </div>
    </div>
  </div>
</template>

<script>


 export default {
   data: () => ({

   }),
   methods: {
     showPageInfo() {
       this.$swal({
         title: 'People Associated with the Witch Trials: Residence and Occupation',
         html: '<div>This map shows the occupations of the people associated with the trials, where that is recorded. There are quite a few parish ministers and bailies (local magistrates in burghs), and a variety of other such occupations are recorded in smaller numbers. </div>',
         footer: 'witches.is.ed.ac.uk',
         confirmButtonText: 'Close',
         type: 'info',
         showCloseButton: true,
       });
     }
   },
   computed : {

   },
   mounted: function() {
   },
   layout: 'basic'
 };

</script>

<style>


</style>
