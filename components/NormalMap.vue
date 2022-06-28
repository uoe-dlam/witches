<template>
  <l-map class="w-full h-full z-0 absolute" :zoom="zoom" 
        :center="center" ref="myMap">
    <l-tile-layer :url="mapUrl" :attribution="attribution"></l-tile-layer>
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
  </l-map>
  
</template>

<script>
export default {
  props: {
    mapMarkers: {
      type: Array,
      required: true
    }
    center: {
      type: Array,
      required: true
    },
    zoom: {
      type: Number,
      requried: true
    }
  },
  methods: {
    hasWikiEntry : function( marker ){
      let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
      return witchesWithEntry.length > 0;
    },
    flyTo : function( coords ){
      this.$refs.myMap.mapObject.flyTo(coords ,14);
    }
  },
  computed: {
    iconAnchor : function() {
      return [11, 41];
    },
    shadowUrl : function() {
      return '/images/North-Berwick-witch-shadow.png';
    }
  },
  unmounted: function () {
    this.$emit("centerInfo", this.$refs.myMap.mapObject.getCenter());
    this.$emit("zoomInfo", this.$refs.myMap.mapObject.getZoom());
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