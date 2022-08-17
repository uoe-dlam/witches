<template>
  <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" 
         :options="{zoomControl: false}" ref="myMap">

    <l-control-zoom position="bottomright"></l-control-zoom>
    <l-tile-layer :url="mapUrl" :attribution="attribution"></l-tile-layer>
    
    <v-marker-cluster ref="clusterRef" :options="clusterOptions">
      <l-marker v-for="(marker, index) in mapMarkers" :key="index" :lat-lng="marker.longLat">
        <l-popup class="adapted-popup">
          <h2>{{marker.location}}</h2><br>
          <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
            <div v-for="(witch, index) in marker.witches" :key="index">

              <strong>{{ witch.name }}</strong><br>
              <div v-if="witch.hasOwnProperty('investigationDates')">
                Investigation Date: {{ witch.investigationDates[1] }}<br>
              </div>
              Gender: {{ witch.sex }}<br>
              Occupation: {{ witch.occupation }}<br>
              Social Class: {{ witch.socialClass }}<br>

              <div v-if="witch.residences.length > 0">
                Residences:
                <template v-for="(residence, index) in witch.residences">
                  <a @click="flyTo(residence.coords)" :style="{ cursor: 'pointer'}">{{ residence.location }}
                  </a>
                  <template v-if="index < witch.residences.length - 1">, </template>
                </template>
                <br>
              </div>

              <div v-if="witch.detentions.length > 0">
                Places of Detention:
                <template v-for="(detention, index) in witch.detentions">
                  <a @click="flyTo(detention.coords)" :style="{ cursor: 'pointer'}">{{ detention.location }}
                  </a>
                  <template v-if="index < witch.detentions.length - 1">, </template>
                </template>
                <br>
              </div>

              <div v-if="witch.placeOfDeath !== ''">
                Place of Death:
                <a @click="flyTo(witch.placeOfDeathCoords)" :style="{ cursor: 'pointer'}">{{ witch.placeOfDeath }}
                </a><br>
              </div>

              <div v-if="witch.mannerOfDeath !== ''">
                Manner of Death: {{ witch.mannerOfDeath }}<br>
              </div>
              <div v-if="witch.wikiPage !== ''">
                <a :href="witch.wikiPage" target="_blank">
                  View Wiki Page
                </a><br>
              </div>
              <a :href="witch.link" target="_blank">More Info</a><br><br>
            </div>
          </div>
        </l-popup>

        <l-icon :icon-anchor="iconAnchor" :key="marker">
          <div class="icon-wrapper">
            <div v-if="hasWikiEntry(marker)" class="icon-wiki">W</div>
            <div v-if="marker.witches.length > 1" class="icon-text">
              {{marker.witches.length}}
            </div>
            <img :src="marker.markerIcon" class="zoomed-in-img" />
            <img class="icon-shadow" :src="shadowUrl" />
          </div>
        </l-icon>

      </l-marker>
    </v-marker-cluster>
  </l-map>
</template>

<script>
 export default {
   props: {
     mapMarkers: {
       type: Array,
       required: true
     },
     mapUrl: {
       type: String,
       required: true
     },
     center: {
       type: Array,
       required: true
     },
     zoom: {
       type: Number,
       requried: true
     }
   },
   data () {
     return {
       attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, 1919-1947 from the <a href="https://api.maptiler.com/tiles/uk-osgb1919/{z}/{x}/{y}.jpg?key=cKVGc9eOyhb8VH5AxCtw">NLS Maps API</a>',
       clusterOptions: {
         iconCreateFunction: function (cluster) {
           var iconHtml = '<img class="cluster-img" src="/images/witches-cluster-composite-yellow.png">';
           return L.divIcon({ html: iconHtml,
                              className: 'mycluster',
                              iconSize: null});
         },
         disableClusteringAtZoom : 12,
         spiderfyOnMaxZoom: false
       }
     }
   },
   methods: {
     hasWikiEntry: function (marker){
       let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
       return witchesWithEntry.length > 0;
     },
     flyTo: function (coords){
       this.$refs.myMap.mapObject.flyTo(coords ,14);
     },
     emitMapData: function () {
       // Emmits an object containing the information about
       // where the center of the map is, the zoom, and what 
       // map type to change to when the map is turned off,
       // in this case changing to clustersOff.

       let centerInfo = this.$refs.myMap.mapObject.getCenter();
       let centerArray = [centerInfo.lat, centerInfo.lng];
       let changeInfo = {
         center: centerArray,
         zoom: this.$refs.myMap.mapObject.getZoom(),
         changeTo: "clustersOff"
       };
       this.$emit("changeMaps", changeInfo);
     }
   },
   computed: {
     iconAnchor : function () {
       return [11, 41];
     },
     shadowUrl : function () {
       return '/images/North-Berwick-witch-shadow.png';
     }
   },
   beforeDestroy: function () {
     this.emitMapData();
   }
 }
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

 .icon-shadow {
   position: absolute;
   top: 15px !important;
   left: 0;
   z-index: -1;
   width: 25.6px;
   height: 17.6px !important;
 }
</style>
