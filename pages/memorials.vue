<template>
    <div id="map-wrapper" class="w-full h-full">
    <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" ref="myMap"> 
      <l-control-zoom position="bottomright"></l-control-zoom>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker.longLat" :icon="customMarkerIconUrl"></l-marker>
    </l-map>
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
    zoom: 7,
    center: [56.00, -6], 
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.',
    markers:[],
    customMarkerIconUrl: '../static/images/witch-group-yellow.png',
    originalMarkers:[],
    queryOutput: json,
    sparqlUrl: 'https://query.wikidata.org/sparql',
    originalMarkers: [],
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
  },

  mounted: function () {
    this.loadData();

    
  }
};
</script>

<style>
</style>