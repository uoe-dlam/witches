<template>
  <div class="flex flex-col h-full w-full">
    <!-- Page intro -->
    <div class="flex content-start items-center bg-slate-50 
                pl-5 pr-5 pt-3 pb-5 w-full">
      <h1 class="text-sm md:text-xl lg:text-2xl">
        Places of Residence for Accused Witches
        <template v-if="!loading">
          (total named accused witches: {{numberOfWitches}})
        </template>
      </h1>
      <span class="rounded-full border-r border-l border-gray-400
                    w-6 h-6 flex items-center justify-center ml-2">
        <!-- icon by feathericons.com -->
        <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
          xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="8"></line>
        </svg>
      </span>
    </div>
    <!-- Map and filters. -->
    <div class="relative h-full w-full">
      <map-filters v-if="!loading" :startingMarkers="originalMarkers"
                  :startingFilters="filterProperties"
                  @updatedMarkers="markers = $event"
                  @updatedTile="url = $event">
      </map-filters>
      <leaflet-map :isLoading="loading" :mapUrl="url" 
                  :mapMarkers="markers" :clustersInitial="true">
      </leaflet-map>
    </div>
  </div>
</template>

<script>
 import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher'
 import MarkerDataHandler from '~/assets/js/MarkerDataHandler';
 import LeafletMap from '../components/leafletMap.vue';
 import MapFilters from '../components/MapFilters.vue';

 export default {
   components: { LeafletMap, MapFilters },
   data: () => ({
     loading: true,
     noItems: 0,
     sparqlUrl: 'https://query.wikidata.org/sparql',
     url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
     sliderYear: [1550, 1750],
     sliderYears: [1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750],
     wikiPages: [],
     markers: [],
     originalMarkers: [],
     currentTileName: 'Modern Map',
     filterProperties: {
       sex: {
         label: "Gender",
         filters: {
           "male": {
             "label": "Male",
             "active": true,
             "iconUrl": "/images/witch-single-blue.png"
           },
           "female": {
             "label": "Female",
             "active": true,
             "iconUrl": "/images/witch-single-orange.png"
           },
           "unknown": {
             "label": "Unknown",
             "active": true,
             "iconUrl": "/images/witch-single-BW.png"
           }
         },
         showing: false
       },
       socialClass: {
        label: "Social Classification",
        filters: {},
        showing: false
       },
       occupation: {
         label: "Occupations",
         filters: {},
         showing: false
       },
       hasWikiPage: {
         label: "Wikipedia Page",
         filters: {
           "hasWiki": {
             "label": "Has wiki",
             "active": true,
             "iconUrl": "/images/witch-single-blue.png"
           },
           "noWiki": {
             "label": "No wiki",
             "active": true,
             "iconUrl": "/images/witch-single-orange.png"
           }
         },
         showing: false
       }
     }
   }),
   methods: {
     convertPointToLongLatArray: function (pointString) {
       pointString = pointString.substr(6);
       pointString = pointString.slice(0,-1);
       let pointArray = pointString.split(' ');
       let longLatArray = [pointArray[1], pointArray[0]];

       return longLatArray;
     },
     loadWikiEntries: function () {
       const sparqlQuery = `SELECT DISTINCT ?item ?LabelEN ?page_title
            WHERE {
              ?item wdt:P4478 ?witch .
              ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ;  schema:name ?page_title .
              ?item rdfs:label ?LabelEN filter (lang(?LabelEN) = "en") .
            }`;

       const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
       queryDispatcher.query( sparqlQuery ).then( result => {

         for (let i = 0; i < result.results.bindings.length; i++) {
           let item = result.results.bindings[i];

           let wikiPage = {
             id: item.item.value,
             pageTitle: item.page_title.value,
           }

           this.wikiPages.push(wikiPage);
         }

         this.loadAccussed();
       });
     },
     loadAccussed : function() {

       const sparqlQuery = `SELECT distinct ?item ?itemLabel ?investigationDate
            ?residenceLabel ?residenceCoords ?sexLabel ?link ?occupationLabel ?socialClassificationLabel
            ?placeOfDeathLabel ?placeOfDeathCoords ?mannerOfDeathLabel ?detentionLocationLabel ?detentionLocationCoords
            WHERE
            {
              ?item wdt:P4478 ?witch .
              ?item wdt:P551 ?residence .
              ?residence wdt:P625 ?residenceCoords .
              optional { ?item wdt:P21 ?sex } .
              ?item wdt:P4478 ?link .
              optional { ?item wdt:P106 ?occupation .}
              optional { ?item wdt:P3716 ?socialClassification .}
              optional {
                ?item wdt:P20 ?placeOfDeath .
                ?placeOfDeath wdt:P625 ?placeOfDeathCoords .}
              optional { ?item wdt:P1196 ?mannerOfDeath .}
              optional { ?item p:P793 ?significantEventStatement .
              ?significantEventStatement ps:P793 wd:Q66458810 .
              OPTIONAL {?significantEventStatement pq:P585 ?investigationPoint }.
              OPTIONAL {?significantEventStatement pq:P580 ?investigationStart }
              }
              BIND(IF(BOUND(?investigationPoint), ?investigationPoint, ?investigationStart) as ?investigationDate)
              optional {  ?item wdt:P2632 ?detentionLocation .
                ?detentionLocation wdt:P625 ?detentionLocationCoords .}

              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`;

       const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
       queryDispatcher.query( sparqlQuery ).then( result => {

         let witches = [];

         for (let i = 0; i < result.results.bindings.length; i++) {

           let item = result.results.bindings[i];
           let id = item.item.value;
           let sex = item.hasOwnProperty('sexLabel') ? item.sexLabel.value : 'unknown';
           let occupation = item.hasOwnProperty('occupationLabel') ? item.occupationLabel.value : 'unknown';
           let residence = item.hasOwnProperty('residenceLabel') ? item.residenceLabel.value : '';
           let residenceCoords = item.hasOwnProperty('residenceCoords') ? this.convertPointToLongLatArray(item.residenceCoords.value) : '';
           let socialClassification = item.hasOwnProperty('socialClassificationLabel') ? item.socialClassificationLabel.value : 'unknown';
           let placeOfDeath = item.hasOwnProperty('placeOfDeathLabel') ? item.placeOfDeathLabel.value : '';
           let placeOfDeathCoords = item.hasOwnProperty('placeOfDeathCoords') ? this.convertPointToLongLatArray(item.placeOfDeathCoords.value) : '';
           let mannerOfDeath = item.hasOwnProperty('mannerOfDeathLabel') ? item.mannerOfDeathLabel.value : '';
           let detentionLocation = item.hasOwnProperty('detentionLocationLabel') ? item.detentionLocationLabel.value : '';
           let detentionLocationCoords = item.hasOwnProperty('detentionLocationCoords') ? this.convertPointToLongLatArray(item.detentionLocationCoords.value) : '';
           let wikiPage = this.getItemWikiPage(item);
           let investigationDate = item.hasOwnProperty('investigationDate') ? item.investigationDate.value : 'N/A';
           let year = 1650;

           if(investigationDate!=='N/A') {
             year = this.getYearFromWikiDate(investigationDate);
             investigationDate = this.convertWikiDateToFriendlyDate(investigationDate);
           }
           
           let icons = this.$store.getters['icons/getIcons'];
           let currentSocials = Object.keys(this.filterProperties.socialClass.filters);
           let currentOccupations = Object.keys(this.filterProperties.occupation.filters);

           let newSocial = MarkerDataHandler.checkFilters(socialClassification, currentSocials, icons);
           let newOccupation = MarkerDataHandler.checkFilters(occupation, currentOccupations, icons);

           if (newSocial) { 
             this.filterProperties.socialClass.filters[newSocial.label] = newSocial;
           }

           if (newOccupation) { 
             this.filterProperties.occupation.filters[newOccupation.label] = newOccupation;
           }

           // find if witch has already exists
           let witch = witches.find( witch => {
             return witch.id ===  id;
           });

           // if witch exists we have a duplicate. this witch must have either multiple residence or multiple detentions
           // push
           if(witch){

             if(detentionLocation !== ''){
               if(!witch.detentions.find( obj => obj.location === detentionLocation)) {
                 witch.detentions.push({location: detentionLocation, coords: detentionLocationCoords});
                 continue;
               }
             }

             if(residence !== ''){
               if(!witch.residences.find( obj => obj.location === residence)) {
                 witch.residences.push({location: residence, coords: residenceCoords});
                 this.addWitchToMarkers(witch, residence, residenceCoords);
                 continue;
               }
             }

             if(investigationDate !== 'N/A' && witch.investigationDate === 'N/A') {
               witch.investigationDate = investigationDate;
               witch.year = year;
             }

           } else {

             witch = {
               id: id,
               location: residence,
               name: item.itemLabel.value,
               link: 'http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.accusedrecord&accusedref=' + item.link.value + '&search_string=lastname',
               longLat: residenceCoords,
               sex: sex,
               occupation: occupation,
               socialClass: socialClassification,
               wikiPage: wikiPage,
               hasWikiPage: wikiPage === '' ? 'noWiki' : 'hasWiki',
               residences: [],
               placeOfDeath: placeOfDeath,
               placeOfDeathCoords: placeOfDeathCoords,
               mannerOfDeath: mannerOfDeath,
               detentions: [],
               investigationDate: investigationDate,
               year: year,
               witchState: {
                 onOff: true,
                 activeFilters: []
               }
             }

             if(residence !== ''){
               witch.residences.push({location: residence, coords : residenceCoords});
             }

             if(detentionLocation !== ''){
               witch.detentions.push({location: detentionLocation, coords : detentionLocationCoords});
             }

             witches.push(witch);
             this.addWitchToMarkers(witch, residence, residenceCoords);
           }

         }

         this.noItems = witches.length;
         this.originalMarkers = JSON.parse(JSON.stringify(this.markers));
         this.saveDataToLocalStorage();
         console.log('still loading');
         this.loading = false;
       });


     },
     addWitchToMarkers: function (witch, location, locationCoords) {
       // find marker for current location so you can add witch
       let marker = this.markers.find( marker => {
         return marker.location === location;
       });

       // if a marker exists for the witche's location add the witch to it. if not create a new marker for the location and add the witch.
       let filterProperty = 'sex';
      
       if (marker) {
         marker.witches.push(witch);

         for (let i = 0; i < marker.witches.length; i++) {
           if (marker.witches[i][filterProperty] !== witch[filterProperty]){
             marker.markerIcon = '/images/witch-single-purple.png';
           }
         }
       } else {
         let markerType = witch[filterProperty];
         let marker = {
           location: location,
           longLat: locationCoords,
           witches: [witch],
           markerIcon: this.filterProperties[filterProperty].filters[markerType].iconUrl,
           onOff: true
         }
         this.markers.push(marker);
       }
     },
     // Local storage functions:
     hasLocalStorageExpired: function () {
       let hours = 24; // Reset when storage is more than 24hours
       let now = new Date().getTime();
       let setupTime = localStorage.getItem('setupTime');

       return setupTime === null || (now - setupTime > hours*60*60*1000);
     },
     loadDataFromLocalStorage: function () {
       this.originalMarkers = JSON.parse(localStorage.getItem('markers'));
       this.markers = JSON.parse(JSON.stringify(this.originalMarkers));
       this.noItems = localStorage.getItem('noItems');
       this.filterProperties.socialClass.filters = JSON.parse(localStorage.getItem('socialFilters'));
       this.filterProperties.occupation.filters = JSON.parse(localStorage.getItem('occupationFilters'));
     },
     saveDataToLocalStorage: function () {
       let now = new Date().getTime();
       localStorage.setItem('setupTime', now);
       localStorage.setItem('markers', JSON.stringify(this.originalMarkers));
       localStorage.setItem('noItems', this.noItems);
       localStorage.setItem('socialFilters', JSON.stringify(this.filterProperties.socialClass.filters));
       localStorage.setItem('occupationFilters', JSON.stringify(this.filterProperties.occupation.filters));
     },
     // Wiki functions:
     showPageInfo: function () {
       this.$swal({
         title: 'Places of Residence for Accused Witches (total named accused witches: 3141)',
         html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3141</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',

         footer: 'witches.is.ed.ac.uk',
         confirmButtonText: 'Close',
         type: 'info',
         showCloseButton: true,
       });
     },
     getItemWikiPage: function (item) {
       let wikiPage = ''; 

       for(let i = 0; i < this.wikiPages.length; i++){

         if(this.wikiPages[i].id === item.item.value){
           wikiPage = this.wikiPages[i].pageTitle;
           wikiPage.split(' ').join('_');
           wikiPage = 'https://en.wikipedia.org/wiki/' + wikiPage;
         }
       }

       return wikiPage;
     },
     convertWikiDateToFriendlyDate: function (wikiDate) {
       let dateYear = wikiDate.substr(0, 4);
       let dateMonth = wikiDate.substr(5, 2);
       let dateDay = wikiDate.substr(8, 2);

       return dateDay + '/' + dateMonth + '/' + dateYear;
     },
     getYearFromWikiDate: function (wikiDate) {
       return wikiDate.substr(0, 4);
     },
   },

   computed: {
     shadowUrl: function () {
       return '/images/North-Berwick-witch-shadow.png';
     },
     numberOfWitches: function () {
       let noWitches = 0;

       this.markers.map(marker => {
         noWitches += marker.witches.length;
       })

       return noWitches
     }
   },

   mounted: function () {
     if(this.hasLocalStorageExpired()){
       localStorage.clear();
       this.loadWikiEntries();
     } else {
       this.loadDataFromLocalStorage();
       this.loading = false;
     }
   }
 };
</script>

<style>
.cluster-img {
    float: left;
    width: 72px;
    height: 55px;
}

.zoomed-in-img {
    float: left;
    width: 25px;
    height: 38px;
}

.icon-shadow{
    position: absolute;
    top: 15px !important;
    left: 0;
    z-index: -1;
    width: 32px;
    height: 22px !important;
}

</style>

