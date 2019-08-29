<template>
    <div>
        <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
              <div class="flex content-start items-center">
                 <h1 class="text-sm md:text-xl lg:text-2xl">Linking Residence to Place of Death</h1>
                  <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                    <!-- icon by feathericons.com -->
                    <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                       <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </span>
            </div>

        </div>
        <div>
<iframe style="width: 100vw; height: 70vh; border: none;" src="https://query.wikidata.org/embed.html#%23defaultView%3AMap%7B%22hide%22%3A%5B%22%3FresCoords%22%2C%20%22%3FdetCoords%22%2C%20%20%22%3Fline%22%2C%20%22%3Flayer%22%5D%2C%20%22markercluster%22%3A%20true%7D%0A%23%20%20%24print%20p%3AP921%20%3Fprintstmt%20.%0A%23%20%20%3Fprintstmt%20ps%3AP921%20%3Fsubject%20.%0A%23%20%20%20%20%3Fres%20rdfs%3Alabel%20%3Fresidence.%0A%23%20%20%20%20%3Fdet%20rdfs%3Alabel%20%3Fdetained.%0ASELECT%20DISTINCT%20%3Fperson%20%3FpersonLabel%20%3Fres%20%3FresLabel%20%3FresCoords%20%3Fdet%20%3FdetLabel%20%3FdetCoords%20%3Fline%20%3Flayer%20WHERE%20%7B%0A%20%20%3Fperson%20wdt%3AP4478%20%3Faccusedwitch%3B%0A%20%20%20%20wdt%3AP551%20%3Fres%3B%0A%20%20%20%20wdt%3AP20%20%3Fdet.%0A%20%20%3Fres%20wdt%3AP625%20%3FresCoords%3B%0A%20%20%20%20p%3AP625%20_%3Ab8.%0A%20%20_%3Ab8%20ps%3AP625%20_%3Ab6%3B%0A%20%20%20%20psv%3AP625%20_%3Ab7.%0A%20%20_%3Ab7%20wikibase%3AgeoLongitude%20%3FresLon%3B%0A%20%20%20%20wikibase%3AgeoLatitude%20%3FresLat.%0A%20%20%3Fdet%20wdt%3AP625%20%3FdetCoords%3B%0A%20%20%20%20p%3AP625%20_%3Ab11.%0A%20%20_%3Ab11%20ps%3AP625%20_%3Ab9%3B%0A%20%20%20%20psv%3AP625%20_%3Ab10.%0A%20%20_%3Ab10%20wikibase%3AgeoLongitude%20%3FdetLon%3B%0A%20%20%20%20wikibase%3AgeoLatitude%20%3FdetLat.%0A%20%20%3Fdet%20rdfs%3Alabel%20%3Flayer.%0A%20%20FILTER%28%28LANG%28%3Flayer%29%29%20%3D%20%22en%22%29%0A%20%20BIND%28CONCAT%28%22LINESTRING%20%28%22%2C%20STR%28%3FresLon%29%2C%20%22%20%22%2C%20STR%28%3FresLat%29%2C%20%22%2C%22%2C%20STR%28%3FdetLon%29%2C%20%22%20%22%2C%20STR%28%3FdetLat%29%2C%20%22%29%22%29%20AS%20%3Fstr%29%0A%20%20BIND%28STRDT%28%3Fstr%2C%20geo%3AwktLiteral%29%20AS%20%3Fline%29%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%0A%7D" referrerpolicy="origin" sandbox="allow-scripts allow-same-origin allow-popups" ></iframe>
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
             title: 'Linking Residence to Place of Death',
             html: '<div>This map shows the geographical relationship between an accused witch’s place of residence and place of death. There are only 111 places of death recorded within the dataset. When selecting a coloured line, the recorded  <b class="font-bold">first location</b> is where the <b class="font-bold">person died, second location</b> is where the <b class="font-bold">accused witch resided</b> and <b class="font-bold">below</b> these places is the <b class="font-bold">name</b> of the accused witch </div>',
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