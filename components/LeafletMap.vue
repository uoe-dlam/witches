<template>
  <div id="map-wrapper" class="w-full h-full">
    <!-- Loading icon. -->
    <div class="mx-auto max-w-md bg-white rounded shadow-md mt-10" v-if="isLoading">
      <div class="pt-8 pb-12 pl-8 pr-8">
        <div class="float-left align-text-bottom">Loading map&nbsp</div>
          <div class="lds-facebook float-left"><div></div><div></div><div></div></div>
       </div>
    </div>

    <!-- Leaflet map. -->
    <no-ssr v-else>
      <div id="map" class="w-full h-full relative">

      <div class="absolute flex justify-center w-100
                  md:w-200 items-center top-0 right-0 z-10 
                  bg-gray-400/80 px-2 py-0.5">
        <h3 class="mr-2 font-medium" 
            style="font-family:EB Garamond;">
          Group by clusters:
        </h3>
        <label class="switch relative pr-2">
          <input v-model="clustersOnOff"  type="checkbox">
          <span class="slider round"></span>
        </label>
        <button @click="displayZoom()">Zoom</button>
      </div>

      <l-map class="w-full h-full z-0 absolute" :zoom="zoom" 
            :center="center" ref="myMap">
        <l-tile-layer :url="mapUrl" :attribution="attribution"></l-tile-layer>
        <v-marker-cluster v-if="clustersOnOff" ref="clusterRef" :options="clusterOptions">
          <l-marker v-for="(marker, index) in mapMarkers" :key="index"
                    :lat-lng="marker.longLat">
            <l-popup class="adapted-popup">
              <h2>{{marker.location}}</h2><br>
              <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
                <div v-for="(witch, index) in marker.witches" :key="index">

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
      </div>
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
    },
    clustersInitial: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, 1919-1947 from the <a href="https://api.maptiler.com/tiles/uk-osgb1919/{z}/{x}/{y}.jpg?key=cKVGc9eOyhb8VH5AxCtw">NLS Maps API</a>',
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
      },
      clustersOnOff: this.clustersInitial
    }
  },
  methods: {
    hasWikiEntry : function( marker ){
      let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
      return witchesWithEntry.length > 0;
    },
    flyTo : function( coords ){
      this.$refs.myMap.mapObject.flyTo(coords ,14);
    },
    printToConsole: function(){
      console.log(this.mapMarkers);
    },
    displayZoom: function () {
      console.log(this.$refs.myMap.mapObject.getZoom());
      console.log(this.$refs.myMap.mapObject.getCenter())
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
  width: 25.6px;
  height: 17.6px !important;
}

.switch {
   display: inline-block;
   width: 38.4px;
   height: 21.76px;
}

 /* Hide default HTML checkbox */
.switch input {
   opacity: 0;
   width: 0;
   height: 0;
}

 /* The slider */
.slider {
   position: absolute;
   cursor: pointer;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: #ccc;
   -webkit-transition: .4s;
   transition: .4s;
   width: 38.4px;
}

.slider:before {
   position: absolute;
   content: "";
   height: 16.64px;
   width: 16.64px;
   left: 2.56px;
   bottom: 2.56px;
   background-color: white;
   -webkit-transition: .4s;
   transition: .4s;
}

input:checked + .slider {
   background-color: #eeb518e1;
}

input:focus + .slider {
   box-shadow: 0 0 1px #eeb518e1;
}

input:checked + .slider:before {
   -webkit-transform: translateX(16.64px);
   -ms-transform: translateX(16.64px);
   transform: translateX(16.64px);
}

.slider.round {
   border-radius: 21.76px;
}

.slider.round:before {
   border-radius: 50%;
}
</style>