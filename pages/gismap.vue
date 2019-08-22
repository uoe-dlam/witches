<template>
    <div>
      <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
              <div class="flex content-start items-center">
                 <h1 class="text-sm md:text-xl lg:text-2xl">Places of Residence Visualised using ArcGIS Online</h1>
                  <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                    <!-- icon by feathericons.com -->
                    <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                       <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </span>
            </div>
 
        </div>
        <div>
         <style>.embed-container {position: relative; padding-bottom: 71%; height: 0; max-width: 100%;} .embed-container iframe, .embed-container object, .embed-container iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}</style><div class="embed-container"><iframe width="900" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Residence Location of Accused Scottish Witches (1563-1736)" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=8dfea5b85a9c4dc1aee5b2e955c9da06&extent=-5.5964,54.9556,-1.5397,56.2876&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"></iframe></div>
        </div>
    </div>
</template>

<script>


export default {
    data: () => ({

    }),
    methods: {
     showPageInfo(){
        this.$swal({
            title: 'Places of Residence',
            html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3141</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',    
            footer: 'witches.is.ed.ac.uk',
            confirmButtonText: 'Close',
            type: 'info',
            showCloseButton: true,
        });

    },
    computed : {

    },
    mounted: function() {
    },
    layout: 'basic'
    }
};

</script>

<style>


</style>