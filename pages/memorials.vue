<template>
    <div id="map-wrapper" class="w-full h-full relative">
    <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" ref="myMap">
      <l-control-zoom position="bottomright"></l-control-zoom>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="(memorial, i) in markers" :key="i" :lat-lng="memorial.longLat" >
        <l-popup class="adapted-popup">
            <h3>{{memorial.name}}</h3><br>
            <div>
              <b>Location:</b> {{ memorial.location }}<br>
              <b>Instance Of:</b> {{ memorial.instance }}<br>
            </div>
        </l-popup>
        <l-icon :icon-anchor="iconAnchor">
        <div class="icon-wrapper">
          <img src="../static/images/witch-single-grey.png" class="zoomed-in-img" />
          <img class="icon-shadow" src="../static/images/witch-single-shadow.png" />
        </div>
      </l-icon>
    </l-marker>
    </l-map>
    </div>
 </template>

<script>
import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher'

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

           let memorial = {
                id: id,
                name: item.itemLabel.value,
                longLat: memorialCoords,
                location: memorialLocation,
                instanceOf: instance
            }

            memorials.push(memorial);
            this.addMemorialToMarkers(memorial, memorialLocation , memorialCoords, instance, item.itemLabel.value);
        }
        this.noItems = memorials.length;
        this.originalMarkers = JSON.parse(JSON.stringify(this.markers));
        this.loading = false;
        });
        
    },
    addMemorialToMarkers: function(memorial, memorialLocation, memorialCoords, instance, name) {
    // Check if memorialCoords is null
    if (memorialCoords && memorialCoords.length === 2) {
        // find marker for current location so you can add witch
        let marker = this.markers.find(marker => {
            return marker.location === memorialLocation;
        });

        // if a marker exists for the witch's location add the witch to it. if not create a new marker for the location and add the witch.
        if (marker) {
            marker.memorials.push(memorial);
        } else {
            let marker = {
                name: name,
                instance: instance,
                location: memorialLocation,
                longLat: memorialCoords,
                memorials: [memorial],
            }

            this.markers.push(marker);
        }
    } else {
        console.log('Skipping marker with null coordinates:', memorial);
    }
},
    convertPointToLongLatArray: function(pointString) {
            pointString = pointString.substr(6);
            pointString = pointString.slice(0,-1);
            let pointArray = pointString.split(' ');
            let longLatArray = [pointArray[1], pointArray[0]];
            return longLatArray;

        },
    emitMapData() {
        let centerInfo = this.$refs.myMap.mapObject.getCenter();
        let centerArray = [centerInfo.lat, centerInfo.lng];
        let changeInfo = {
        center: centerArray,
        zoom: this.$refs.myMap.mapObject.getZoom(),
        };
        this.$emit("changeMaps", changeInfo);
    },
    removeMarkersFromMap() {
        this.markers.forEach(marker => {
            this.$refs.myMap.mapObject.removeLayer(marker); // Remove marker from the map
        });
        this.markers = []; // Clear the markers array
        }
  },

  mounted: function () {
    this.loadMemorials();
    console.log('Markers:', this.markers);
  },
  beforeDestroy: function () {
     this.emitMapData();
     this.removeMarkersFromMap();
   }
};
</script>

<style>
.zoomed-in-img {
   float: left;
   width: 25px;
   height: 38px;
 }

.icon-shadow {
    position: absolute;
    top: 15px !important;
    left: 0;
    z-index: -1;
    width: 25.6px;
    height: 17.6px !important;
}

</style>