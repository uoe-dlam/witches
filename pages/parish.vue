<template>
    <div>
        <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
            
            <div class="flex content-start items-center">
                 <h1 class="text-sm md:text-xl lg:text-2xl">Number of Accused Witches That Resided In Each Modern Civil Parish</h1>
                 <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                    <!-- icon by feathericons.com -->
                    <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                       <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </span>
            </div>
            
        </div>
        <div>
         <style>.embed-container {position: relative; padding-bottom: 80%; height: 0; max-width: 100%;} .embed-container iframe, .embed-container object, .embed-container iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}</style><div class="embed-container"><iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Parish Boundary Residence Location of Accused Witches" src="//edinuniv.maps.arcgis.com/apps/Embed/index.html?webmap=379dbfae89704e31ba67e1811bc33605&extent=-7.4748,55.2089,0.6386,57.8114&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&legend=true&disable_scroll=false&theme=dark"></iframe></div>
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
            title: 'Number of Accused Witches That Resided In Each Modern Civil Parish',
            html: '<div>This map shows the number of accused witches who resided within each civil parish. The parish boundaries displayed (source: National Records of Scotland) are from the 1930s. These boundaries are sometimes different from the parish boundaries during the period of the witchcraft trials. </div>',
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