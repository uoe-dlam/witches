<template>
  <div id="map-wrapper" class="h-full">

    <!-- Loading icon. -->
    <button @click="printToConsole()">Testing</button>
    <div class="mx-auto max-w-md bg-white 
                rounded shadow-md mt-10" 
                v-if="loading">
      <div class="pt-8 pb-12 pl-8 pr-8">
        <div class="float-left align-text-bottom">Loading map&nbsp</div>
        <div class="lds-facebook float-left"></div>
      </div>
    </div>

    <!-- Leaflet map. -->
    <no-ssr v-else>
      <l-map style="height: 100%; width: 100%" :zoom="zoom" 
            :center="center" ref="myMap">
        <l-tile-layer :url="mapUrl" :attribution="attribution"></l-tile-layer>
        <!-- Cluster maker; options specified in script data. -->
        <v-marker-cluster ref="clusterRef" :options="clusterOptions">

          <!-- Map markers, with or without cluster: -->
          <l-marker v-for="(marker, index) in mapMarkers"
                    v-if="marker.onOff" :lat-lng="marker.longLat">
            <!-- Marker popup -->
            <l-popup class="adapted-popup">
              <h2>{{marker.location}}</h2><br>
              <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
                <div v-for="(witch, index) in marker.witches">
                  <strong>{{ witch.name }}</strong><br>
                  Investigation Date: {{ witch.investigationDate }}<br>
                  Gender: {{ witch.sex }}<br>
                  Occupation: {{ witch.occupation }}<br>
                  Social Class: {{ witch.socialClassification }}<br>

                  <div v-if="witch.residences.length > 0">
                    Residences:
                    <template v-for="(residence, index) in witch.residences">
                      <a @click="flyTo(residence.coords)" 
                         :style="{ cursor: 'pointer'}">{{ residence.location }}
                      </a>
                      <template v-if="index < witch.residences.length - 1">, </template>
                    </template>
                    <br>
                  </div>

                  <div v-if="witch.detentions.length > 0">
                    Places of Detention:
                    <template v-for="(detention, index) in witch.detentions">
                      <a @click="flyTo(detention.coords)" 
                         :style="{ cursor: 'pointer'}">{{ detention.location }}
                      </a>
                      <template v-if="index < witch.detentions.length - 1">, </template>
                    </template>
                     <br>
                  </div>

                  <div v-if="witch.placeOfDeath !== ''">
                    Place of Death: 
                    <a @click="flyTo(witch.placeOfDeathCoords)" 
                       :style="{ cursor: 'pointer'}">{{ witch.placeOfDeath }}
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

            <!-- Witch marker icon. Icon size defined in the css. -->
            <l-icon :icon-anchor="iconAnchor" :key="marker">
              <div class="icon-wrapper">
                <div v-if="hasWikiEntry(marker)" class="icon-wiki">W</div>
                <div v-if="marker.witches.length > 1" class="icon-text">
                  {{marker.witches.length}}
                </div>
                <img :src="marker.markerIcon" class="zoomed-in-img"/>
                <img class="icon-shadow" :src="shadowUrl"/>
              </div>
            </l-icon>

          </l-marker>
        </v-marker-cluster>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    mapUrl: {
      type: String,
      required: true
    },
    mapMarkers: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, 1919-1947 from the <a href="http://maps.nls.uk/projects/api/">NLS Maps API</a>',
      zoom: 7,
      center: [55.95, -3.198888888],
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
    hasWikiEntry : function( marker ){
      let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
      return witchesWithEntry.length > 0;
    },
    printToConsole: function(){
      console.log(this.mapMarkers);
    }
  },
  computed: {
    iconAnchor : function() {
      return [11, 41];
    },
    shadowUrl : function() {
      return '/images/North-Berwick-witch-shadow.png';
    }
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
  width: 32px;
  height: 22px !important;
}
</style>