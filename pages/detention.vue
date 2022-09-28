<template>
  <loading-message v-if="loading"/>
  <map-component v-else
                 :pageInfo="pageInfo"                
                 :originalMarkers="originalMarkers"
                 :filtersGeneralInfo="filtersGeneralInfo"
                 :filterProperties="filterProperties"
                 iconBehaviour="changing"
                 :includeTimeline="false">
  </map-component>
</template>

<script>

 import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher';
 import APIDataHandler from '~/assets/js/APIDataHandler';
 import json from '../big-query-output.json';
 import FilteringMethods from '../assets/js/FilteringMethods';
 import MapComponent from '../components/MapComponent.vue';
 import LoadingMessage from '../components/LoadingMessage.vue';

 export default {
   components: { MapComponent, LoadingMessage },
   data: () => ({
     pageInfo: {
       title: 'Places of Detention for Accused Witches',
       html: '<div>This map shows the different locations for accused witches place of detention. These people were imprisoned either before or after their witchcraft trial and could be <b class="font-bold">imprisoned multiple times and in different locations</b>. This dataset has records for only <b class="font-bold">560</b> instances of imprisonment for the <b class="font-bold">3212</b> named witches. Again, for most of the accused witches, the surviving documentation does not provide information about their imprisonment.</div>',
       footer: 'witches.is.ed.ac.uk',
       confirmButtonText: 'Close',
       type: 'info',
       showCloseButton: true,
     },
     queryOutput: json,
     sparqlUrl: 'https://query.wikidata.org/sparql',
     wikiPages: [],
     loading: true,
     originalMarkers: [],
     filtersToFind: [
       ["socialClass", "changing"],
       ["occupation", "changing"],
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
         showing: false
       }
     }
   }),
   methods: {
     loadWikiEntries: function () {
       const sparqlQuery = `SELECT DISTINCT ?item ?LabelEN ?page_title
            WHERE {
              ?item wdt:P4478 ?witch .
              ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ;  schema:name ?page_title .
              ?item rdfs:label ?LabelEN filter (lang(?LabelEN) = "en") .
            }`;

       const queryDispatcher = new SPARQLQueryDispatcher(this.sparqlUrl);
       queryDispatcher.query(sparqlQuery).then(result => {

         for (let i = 0; i < result.results.bindings.length; i++) {
           let item = result.results.bindings[i];

           let wikiPage = {
             id: item.item.value,
             pageTitle: item.page_title.value,
           }

           this.wikiPages.push(wikiPage);
         }

       });
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
     hasLocalStorageExpired: function () {
       let hours = 24; // Reset when storage is more than 24hours
       let now = new Date().getTime();
       let setupTime = localStorage.getItem('setupTime');

       return setupTime === null || (now - setupTime > hours * 60 * 60 * 1000);
     },
     loadDataFromLocalStorage: function () {
       let allFilters = JSON.parse(localStorage.getItem('allFilters'));
       this.filterProperties.socialClass.filters = allFilters.socialClass;
       this.filterProperties.occupation.filters = allFilters.occupation;
     },
     loadData: async function () {
       this.loadWikiEntries();
       let icons = this.$store.getters['icons/getIcons'];

       let response = await this.$axios.get('/main.php')
       this.queryOutput = response.data

       let getData = new APIDataHandler(
         this.queryOutput, this.wikiPages,
         icons, null
       );
       let filtersFound = null;

       [
         this.originalMarkers,
         filtersFound
       ] = getData.loadAccussed('detention', this.filtersToFind);
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
