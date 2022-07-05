<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl">Social Class with Unknown Values</h1>
        <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
          <!-- icon by feathericons.com -->
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
            <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
          </svg>
        </span>
      </div>

    </div>
    <div>
      <iframe style="width: 80vw; height: 70vh; border: none;" src="https://query.wikidata.org/embed.html#%23Social%20class%20of%20the%20accused%20witches%20in%20the%20Survey%20of%20Scottish%20witchcraft%0A%0A%23defaultView%3ABubbleChart%0ASELECT%20(IF(BOUND(%3Fsocialclass)%2C%20%3FsocialclassLabel%2C%20%22unknown%22)%20as%20%3Flabel)%20%3Fcount%0A%3Fsocialclass%20%3FsocialclassLabel%20%0A%0AWHERE%0A%7B%0A%20%20%7B%0A%20%20%20%20SELECT%20%3Fsocialclass%20(COUNT(%3Fperson)%20AS%20%3Fcount)%20WHERE%20%7B%0A%20%20%20%20%20%20%3Fperson%20wdt%3AP4478%20%3Faccused%20.%0A%20%20%20%20%20%20OPTIONAL%20%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%3Fperson%20wdt%3AP3716%20%3Fsocialclass.%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20GROUP%20BY%20%3Fsocialclass%0A%20%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%7D%0A%7D%0AORDER%20BY%20DESC(%3Fcount)%0ALIMIT%204000" referrerpolicy="origin" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
    </div>
    <h1 class="text-sm md:text-xl lg:text-2xl">Social Class without Unknown Values</h1>
    <iframe style="width: 80vw; height: 70vh; border: none;" src="https://query.wikidata.org/embed.html#%23Social%20class%20of%20the%20accused%20witches%20in%20the%20Survey%20of%20Scottish%20witchcraft%0A%0A%23defaultView%3ABubbleChart%0ASELECT%20%3Fclass%20%3FclassLabel%20%3Fcount%0AWHERE%0A%7B%0A%20%20%7B%0A%20%20%20%20SELECT%20%3Fclass%20(COUNT(%3Fperson)%20AS%20%3Fcount)%20WHERE%20%7B%0A%20%20%20%20%20%20%3Fperson%20wdt%3AP4478%20%3Faccused%20.%0A%20%20%20%20%20%20%3Fperson%20wdt%3AP3716%20%3Fclass.%0A%20%20%20%20%7D%0A%20%20%20%20GROUP%20BY%20%3Fclass%0A%20%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%7D%0A%7D%0AORDER%20BY%20DESC(%3Fcount)%0ALIMIT%204000" referrerpolicy="origin" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
  </div>

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
         title: 'Social Class Bubble Charts',
         html: '<div>It is difficult to classify early modern people into socio-economic categories, but of those individuals whose status was indicated the majority fell into the middle range—64%. The total of those who came from lower socio-economic categories—lower, very poor and landless—accounted for 29%, with upper, lairds and nobility accounting for 6%. We do not know this information for the majority of those accused, but these figures may be typical.</div>',
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
