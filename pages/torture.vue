<template>
    <div>
      <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
              <div class="flex content-start items-center">
                 <h1 class="text-sm md:text-xl lg:text-2xl">Types of Torture at Different Residence Locations</h1>
                  <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                    <!-- icon by feathericons.com -->
                    <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                       <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </span>
            </div>
 
        </div>
        <div>
       <style>.embed-container {position: relative; padding-bottom: 80%; height: 0; max-width: 100%;} .embed-container iframe, .embed-container object, .embed-container iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}</style><div class="embed-container"><iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Accused Witches - Manner of Torture" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=30ef7872b00a463db3f7e8a3d5e84b04&extent=-11.4527,52.0439,4.7741,57.4788&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=light"></iframe></div>
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
             title: 'Types of Torture at Different Residence Locations',
             html: '<div>This map shows the location of accused witches who are recorded to have suffered torture during their investigations. Data on this subject are far from complete, since in most cases nothing was written about torture in the trial records that form our main source. A witch’s confession would be recorded, but nothing would be said about how that confession was obtained. We have only a few scattered pieces of evidence about torture.</div>',
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