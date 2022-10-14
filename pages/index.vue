<template>
  <loading-message v-if="loading"/>
  <map-component v-else
                 :pageInfo="pageInfo"            
                 :originalMarkers="originalMarkers"
                 :filtersGeneralInfo="filtersGeneralInfo"
                 :filterProperties="filterProperties"
                 iconBehaviour="changing">
  </map-component>
</template>

<script>
 import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher'
 import APIDataHandler from '~/assets/js/ApiDataHandler';
 import FilteringMethods from '../assets/js/FilteringMethods';
 import MapComponent from '../components/MapComponent.vue';
 import LoadingMessage from '../components/LoadingMessage.vue';
 import WitchesStorage from 'assets/js/WitchesStorage'

 export default {
   components: { MapComponent, LoadingMessage },
   data: () => ({
     pageInfo: {
       title: 'Witchcraft Prosecutions In Time and Place',
       html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3142</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',
       footer: 'witches.is.ed.ac.uk',
       confirmButtonText: 'Close',
       type: 'info',
       showCloseButton: true,
     },
     queryOutput: '',
     sparqlUrl: 'https://query.wikidata.org/sparql',
     wikiPages: [],
     loading: true,
     originalMarkers: [],
     filtersToFind: [
       ["socialClass", "changing"],
       ["occupation", "changing"],
       ["demonicPact", "constant"],
       ["propertyDamage", "constant"],
       ["meetingsPlaces", "constant"],
       ["meetingsInfo", "constant"],
       ["shapeshifting", "constant"],
       ["ritualObjects", "constant"],
       ["primary", "constant"],
       ["secondary", "constant"]
     ],
     filtersGeneralInfo: {
       title: "Accused witch filters",
       filtersShowing: true
     },
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
         showing: true
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
         showing: false,
         mainJson: ''
       }
     }
   }),
   methods: {
     loadWikiEntries: async function () {
       const sparqlQuery = `SELECT DISTINCT ?item ?LabelEN ?page_title
            WHERE {
              ?item wdt:P4478 ?witch .
              ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ;  schema:name ?page_title .
              ?item rdfs:label ?LabelEN filter (lang(?LabelEN) = "en") .
            }`;

       const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
       let result = await queryDispatcher.query( sparqlQuery )

       for (let i = 0; i < result.results.bindings.length; i++) {
         let item = result.results.bindings[i];

         let wikiPage = {
           id: item.item.value,
           pageTitle: item.page_title.value,
         }

         this.wikiPages.push(wikiPage);
       }
     },
     setMarkersIcons: function () {
       let Filtering = new FilteringMethods(this.filterProperties, "sex");

       for (let i = 0; i < this.originalMarkers.length; i++) {
         let marker = this.originalMarkers[i];
         [
           marker.markerIcon,
           marker.active
         ] = Filtering.getMarkerStateIconDependant(marker);
       }
     },
     loadData: async function () {
       let icons = this.$store.getters['icons/getIcons'];

       if(WitchesStorage.hasLocalStorageExpired()) {
         localStorage.clear();

         try {
           let response = await this.$axios.get('/main.php')
           this.queryOutput = response.data
           await this.loadWikiEntries();
         } catch (e) {
           this.$swal({
             title: 'Server Error',
             html: '<div>We are unable to connect to the server to pull in map info. Please refresh the page and try again. If this error persists, please contact <a href="mailto:ltw-apps-dev.ed.ac.uk">ltw-apps-dev.ed.ac.uk</a></div>',
             footer: 'witches.is.ed.ac.uk',
             confirmButtonText: 'Close',
             type: 'error',
             showCloseButton: true,
           });

           return
         }
         WitchesStorage.saveDataToLocalStorage(this.queryOutput, this.wikiPages);
       } else {
         [this.queryOutput, this.wikiPages] = WitchesStorage.loadDataFromLocalStorage();
       }

       let getData = new APIDataHandler(
         this.queryOutput, this.wikiPages,
         icons, null
       );
       let filtersFound = null;

       [
        this.originalMarkers, 
        filtersFound
       ] = getData.loadAccussed('residence', this.filtersToFind);

       this.filterProperties.socialClass.filters = filtersFound.socialClass;
       this.filterProperties.occupation.filters = filtersFound.occupation;
       this.setMarkersIcons();
       this.loading = false;
     }
   },

   mounted: function () {
     this.loadData();
   }
 };
</script>

<style>
</style>

