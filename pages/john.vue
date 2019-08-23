<template>
    <div>
      <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
              <div class="flex content-start items-center">
                 <h1 class="text-sm md:text-xl lg:text-2xl">The Journey of a Witch-Pricker - John Kincaid of Tranent</h1>
                  <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                    <!-- icon by feathericons.com -->
                    <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                       <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </span>
            </div>
 
        </div>
        <div>
       <style>.embed-container {position: relative; padding-bottom: 80%; height: 0; max-width: 100%;} .embed-container iframe, .embed-container object, .embed-container iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}</style><div class="embed-container"><iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="John Kincaid" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=cd05ac44369d49899b167c60be733f73&extent=-7.9894,53.5124,0.124,56.2264&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&disable_scroll=false&theme=light"></iframe></div>
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
             title: 'The Journey of a Witch-Pricker',
             html: '<div>John Kincaid was a famous Witch-pricker in the 17th century known for this cruel ordeals in search for evidence of witchcraft. Although John Kincaid resided in Tranent and mainly worked in Lothian, he moved through the east coast of Scotland and even down to England. Kincaid was an active Witch-pricker from 1649 to 1662 and was involved with many different cases over this time. <b class="font-bold">Move around the map and read about the different cases that John Kincaid was involved in by clicking on the different symbols on the map.</b></div>',
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