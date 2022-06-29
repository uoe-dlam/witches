<template>
  <div id="outer">
    <div id="inner">

      <div id="page-intro" class="pl-5 pr-5 pt-3 pb-3">
        <div class="flex content-start items-center">
          <h1 class="text-sm md:text-xl lg:text-2xl">
            Places of Residence for Accused Witches
            <template v-if="noItems > 0">
              (total named accused witches: 3141)
            </template>
          </h1>
          <span class="rounded-full border-r border-l border-gray-400
                       w-6 h-6 flex items-center justify-center ml-2">
            <!-- icon by feathericons.com -->
            <svg aria-hidden="true" class="" data-reactid="266"
                 fill="none" height="24" stroke="#606F7B" stroke-linecap="round"
                 stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                 width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="8"></line>
            </svg>
          </span>
        </div>
      </div>

      <map-filters :startingMarkers="originalMarkers"
                   :filterLayers="filterLayers"
                   :isLoading="loading"
                   @updatedMarkers="markers = $event"
                   @updatedTile="url = $event">

      </map-filters>
      <leaflet-map :isLoading="loading" :mapUrl="url"
                   :mapMarkers="activeMarkers" :clustersInitial="true">
      </leaflet-map>
    </div>
  </div>
</template>

<script>
 import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher';
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
     startingLayer: 0, // The first layer to be showing.
     currentTileName : 'Modern Map',
     filterLayers: [
       {
         label: 'Gender', property : 'sex',
         filters: {
           male: {
             label: 'Male', active: true,
             iconUrl: '/images/witch-single-blue.png'
           },
           female: {
             label: 'Female', active: true,
             iconUrl: '/images/witch-single-orange.png'
           },
           unknown: {
             label: 'Unknown', active: true,
             iconUrl: '/images/witch-single-BW.png'
           }
         }
       },
       {
         label: 'Social Classification', property : 'socialClassification',
         filters: {}
       },
       {
         label: 'Occupations', property : 'occupation',
         filters: {}
       },
       {
         label: 'Wikipedia Page', property : 'hasWikiPage',
         filters: {
           hasWiki: {
             label: "Has wiki", active: true,
             iconUrl: '/images/witch-single-blue.png'
           },
           noWiki: {
             label: "No wiki", active: true,
             iconUrl: '/images/witch-single-orange.png'
           }
         }
       }
     ],
     icons: ['/images/witch-single-blue.png',
             '/images/witch-single-orange.png',
             '/images/witch-single-pink.png',
             '/images/witch-single-red.png',
             '/images/witch-single-brown.png',
             '/images/witch-single-green.png',
             '/images/witch-single-pale-blue.png',
             '/images/witch-single-yellow.png',
             '/images/witch-single-blue.png',
             '/images/witch-single-orange.png',
             '/images/witch-single-pink.png',
             '/images/witch-single-red.png',
             '/images/witch-single-brown.png',
             '/images/witch-single-green.png',
             '/images/witch-single-pale-blue.png',
             '/images/witch-single-yellow.png',
             '/images/witch-single-blue.png',
             '/images/witch-single-orange.png',
             '/images/witch-single-pink.png',
             '/images/witch-single-red.png',
             '/images/witch-single-brown.png',
             '/images/witch-single-green.png',
             '/images/witch-single-pale-blue.png',
             '/images/witch-single-yellow.png',
             '/images/witch-single-blue.png',
             '/images/witch-single-orange.png',
             '/images/witch-single-pink.png',
             '/images/witch-single-red.png',
             '/images/witch-single-brown.png',
             '/images/witch-single-green.png',
             '/images/witch-single-pale-blue.png',
             '/images/witch-single-yellow.png',
             '/images/witch-single-blue.png',
             '/images/witch-single-orange.png',
             '/images/witch-single-pink.png',
             '/images/witch-single-red.png',
             '/images/witch-single-brown.png',
             '/images/witch-single-green.png',
             '/images/witch-single-pale-blue.png',
             '/images/witch-single-yellow.png',
             '/images/witch-single-blue.png',
             '/images/witch-single-orange.png',
             '/images/witch-single-pink.png',
             '/images/witch-single-red.png',
             '/images/witch-single-brown.png',
             '/images/witch-single-green.png',
             '/images/witch-single-pale-blue.png',
             '/images/witch-single-yellow.png',
     ]
   }),

   methods: {
     convertPointToLongLatArray: function(pointString) {
       pointString = pointString.substr(6);
       pointString = pointString.slice(0,-1);
       let pointArray = pointString.split(' ');
       let longLatArray = [pointArray[1], pointArray[0]];
       return longLatArray;

     },
     loadWikiEntries : function() {
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


           // add to social class filter if doesn't exist already.
           let socialsFound = Object.keys(this.filterLayers[1].filters);
           if(!socialsFound.find(socialFound => socialFound === socialClassification)){
             this.filterLayers[1].filters[socialClassification] = {label:socialClassification, active: true, iconUrl: this.icons[socialsFound.length]};
           }

           // add to occupations filters if doesn't exist already.
           let occupationsFound = Object.keys(this.filterLayers[2].filters);
           if(!occupationsFound.find(occupationFound => occupationFound === occupation)){
             this.filterLayers[2].filters[occupation] = {label:occupation, active: true, iconUrl: this.icons[occupationsFound.length]};
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
               socialClassification: socialClassification,
               wikiPage: wikiPage,
               hasWikiPage: wikiPage === '' ? 'noWiki' : 'hasWiki',
               residences: [],
               placeOfDeath: placeOfDeath,
               placeOfDeathCoords: placeOfDeathCoords,
               mannerOfDeath: mannerOfDeath,
               detentions: [],
               investigationDate: investigationDate,
               year: year,
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
         this.loading = false;
       });


     },
     addWitchToMarkers: function( witch, location, locationCoords ){
       // find marker for current location so you can add witch
       let marker = this.markers.find( marker => {
         return marker.location === location;
       });

       // if a marker exists for the witche's location add the witch to it. if not create a new marker for the location and add the witch.
       let startingProperty = this.filterLayers[this.startingLayer].property;
       if(marker){
         marker.witches.push(witch);
         for (let i = 0, len = marker.witches.length; i < len; i++) {
           if (marker.witches[i][startingProperty] !== witch[startingProperty]){
             marker.markerIcon = '/images/witch-single-purple.png'
           }
         }
       } else {
         let markerType = witch[startingProperty];
         let marker = {
           location: location,
           longLat: locationCoords,
           witches: [witch],
           markerIcon: this.filterLayers[this.startingLayer].filters[markerType].iconUrl,
           onOff: true // Determines whether the marker is showing.
         }
         this.markers.push(marker);
       }
     },
     // Local storage functions:
     hasLocalStorageExpired : function(){
       let hours = 24; // Reset when storage is more than 24hours
       let now = new Date().getTime();
       let setupTime = localStorage.getItem('setupTime');
       return setupTime === null || (now - setupTime > hours*60*60*1000);
     },
     loadDataFromLocalStorage : function(){
       this.filterLayers[2].filters = JSON.parse(localStorage.getItem('occupations'));
       this.filterLayers[1].filters = JSON.parse(localStorage.getItem('socials'));
       this.markers = JSON.parse(localStorage.getItem('markers'));
       this.originalMarkers = JSON.parse(JSON.stringify(this.markers));
       this.noItems = localStorage.getItem('noItems');
     },
     saveDataToLocalStorage : function(){
       let now = new Date().getTime();
       localStorage.setItem('setupTime', now);
       localStorage.setItem('markers', JSON.stringify(this.markers));
       localStorage.setItem('noItems', this.noItems);
       localStorage.setItem('occupations', JSON.stringify(this.filterLayers[2].filters));
       localStorage.setItem('socials', JSON.stringify(this.filterLayers[1].filters));
     },
     // Wiki functions:
     showPageInfo(){
       this.$swal({
         title: 'Places of Residence for Accused Witches (total named accused witches: 3141)',
         html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3141</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',

         footer: 'witches.is.ed.ac.uk',
         confirmButtonText: 'Close',
         type: 'info',
         showCloseButton: true,
       });
     },
     hasWikiEntry : function( marker ){
       let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
       return witchesWithEntry.length > 0;
     },
     getItemWikiPage : function( item ){
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
     convertWikiDateToFriendlyDate(wikiDate){
       let dateYear = wikiDate.substr(0, 4);
       let dateMonth = wikiDate.substr(5, 2);
       let dateDay = wikiDate.substr(8, 2);
       return dateDay + '/' + dateMonth + '/' + dateYear;
     },
     getYearFromWikiDate(wikiDate){
       return wikiDate.substr(0, 4);
     },
   },

   computed : {
     activeMarkers: function() {
       return this.markers.filter(function(marker) {
         return marker.onOff === true;
       });
     },
     shadowUrl : function() {
       return '/images/North-Berwick-witch-shadow.png';
     }
   },
   mounted: function() {
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
</style>
