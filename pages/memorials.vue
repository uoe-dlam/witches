<template>
    <div>
    <loading-message v-if="loading"/>
    <leaflet-map-main :mapUrl="url" 
                        :mapMarkers="Filtering.getOutputMarkers(originalMarkers)" 
                        :clustersInitial="clustersOn">
    </leaflet-map-main>
    </div>
  </template>

<script>
import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher'
import APIDataHandler from '~/assets/js/ApiDataHandler';
import FilteringMethods from '../assets/js/FilteringMethods';
import json from '../big-query-output.json'
import MapComponent from '../components/MapComponent.vue';
import LoadingMessage from '../components/LoadingMessage.vue';

export default {
  components: { MapComponent, LoadingMessage },
  data: () => ({
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    markers:[],
    originalMarkers:[],
    pageInfo: {
      title: 'Witchcraft Memomorails by Location',
      html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3142</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',
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
      ["instanceOf", "changing"],
    ],
    
    filterProperties: {
      instanceOf: {
        label: "Instance Of",
        filters: {},
        showing: false
      }
    }
  }),
  methods: {

    loadMemorials: function(){
        const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel ?instanceLabel ?image ?coords ?locationLabel
            WHERE 
            {
                ?item wdt:P361 wd:Q123249004 .
                OPTIONAL { ?item wdt:P31 ?instance .}
                OPTIONAL { ?item wdt:P131 ?location .}
                OPTIONAL { ?item wdt:P625 ?coords . }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`; 

        const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
        queryDispatcher.query( sparqlQuery ).then( result => {
            let memorials =[];

            for (let i = 0; i < result.results.bindings.length; i++) {
                let item = result.results.bindings[i];
                let id = item.item.value;
                let instance = item.hasOwnProperty('instanceLabel') ? item.instanceLabel.value : 'unknown';
                let memorialCoords = item.hasOwnProperty('coords') ? this.convertPointToLongLatArray(item.coords.value) : '';
                let memorialLocation = item.hasOwnProperty('locationLabel') ? item.locationLabel.value : '';

            
            //add to list of instances???

            memorial = {
                id: id,
                name: item.itemLabel.value,
                longLat: memorialCoords,
                location: memorialLocation,
                instanceOf: instance
            }

            memorials.push(memorial);
            this.addMemorialToMarkers(memorial, memorialLocation , memorialCoords);
        }
        this.noItems = memorials.length;
        this.originalMarkers = JSON.parse(JSON.stringify(this.markers));
        this.saveDataToLocalStorage();
        this.loading = false;
        });
        
    },
    addMemorialToMarkers: function(memorial, memorialLocation , memorialCoords){
            // find marker for current location so you can add witch
            let marker = this.markers.find( marker => {
                return marker.location === memorialLocation;
            });

            // if a marker exists for the witche's location add the witch to it. if not create a new marker for the location and add the witch.
            if(marker){
                marker.memorials.push(memorial);
            } else {
                let marker = {
                    location: memorialLocation,
                    longLat: memorialCoords,
                    memorials: [memorial],
                }

                this.markers.push(marker);
            }
        },
    convertPointToLongLatArray: function(pointString) {
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
      });
    },

    // Local storage functions:
    hasLocalStorageExpired: function () {
      let hours = 24; // Reset when storage is more than 24hours
      let now = new Date().getTime();
      let setupTime = localStorage.getItem('setupTime');

      return setupTime === null || (now - setupTime > hours*60*60*1000);
    },
    loadDataFromLocalStorage: function () {
      this.originalMarkers = JSON.parse(localStorage.getItem('residenceMarkers'));
      let allFilters = JSON.parse(localStorage.getItem('allFilters'));
      this.filterProperties.socialClass.filters = allFilters.socialClass;
      this.filterProperties.occupation.filters = allFilters.occupation;
    },
    saveDataToLocalStorage: function (foundFilters) {
      let now = new Date().getTime();
      localStorage.setItem('setupTime', now);
      localStorage.setItem('residenceMarkers', JSON.stringify(this.originalMarkers));
      localStorage.setItem('allFilters', JSON.stringify(foundFilters));
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
      this.loadWikiEntries();
      let icons = this.$store.getters['icons/getIcons'];

      try {
        let response = await this.$axios.get('/main.php?type=accused')
        this.queryOutput = response.data
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