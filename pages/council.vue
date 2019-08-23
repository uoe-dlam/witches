<template>
    <div>
      <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
              <div class="flex content-start items-center">
                 <h1 class="text-sm md:text-xl lg:text-2xl">Number of Trials Recorded in Each Modern Council Authority</h1>
                  <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                    <!-- icon by feathericons.com -->
                    <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                       <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </span>
            </div>

        </div>
        <div>
      <style>.embed-container {position: relative; padding-bottom: 71%; height: 0; max-width: 100%;} .embed-container iframe, .embed-container object, .embed-container iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}</style><div class="embed-container"><iframe width="900" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Choropleth Map of Trial Location" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=18afc056bff34ae3a7d76fade8cd195d&extent=-5.6973,55.3553,-1.6406,56.674&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"></iframe></div>
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
             title: 'Number of Trials Recorded in Each Modern Council Authority',
             html: '<div>This map indicates the number of trials which have taken place in each authority in Scotland. The authority boundaries have been all been in place since 1996 (source: Ordnance Survey Boundary-Line Map). Thus, the authority boundaries and names greatly differ from the burghs and counties recorded within the original dataset. </div>',
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
    layout: 'basic',

};

</script>

<style>


</style>