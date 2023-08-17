<template>
  <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" ref="myMap">

    <l-control-zoom position="bottomright"></l-control-zoom>
    <l-tile-layer :url="baseMapUrl" :attribution="attribution"></l-tile-layer>

    <!--historic layer-->
    <div v-if="mapUrl.startsWith('https://mapseries')">
      <l-tile-layer :url="mapUrl" :attribution="attribution"></l-tile-layer>
    </div>

    <l-marker v-for="(marker, index) in mapMarkers" :key="index" :lat-lng="marker.longLat">
      <l-popup class="adapted-popup">
        <h2>{{marker.location}}</h2><br>
        <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
          <div v-for="(witch, index) in marker.witches" :key="index">

            <div class="font-semibold text-base">{{ witch.name }}</div><br>
            <div>
              <b>Investigation Date:</b> {{ witch.investigationDates[1] }}<br>
            </div>
            
            <div v-for="standardAttribute in getStandardAttributesWithValue(witch)">
                <b>{{standardAttributeLabels[standardAttribute]}}:</b>
                {{ witch[standardAttribute] }}
                <br>
              </div>

            <div v-for="locationOption in getLocationsWithValue(witch)">
              <b>{{ locationsLabels[locationOption] }}:</b>
              <template v-for="(subLocation, index) in witch[locationOption].locations">
                <a @click="flyTo(witch[locationOption].coordinates[index])" :style="{ cursor: 'pointer'}">{{ subLocation }}
                </a>
                <template v-if="index < witch[locationOption].locations.length - 1">, </template>
              </template>
              <br>
            </div>

            <div v-for="optionalAttribute in getOptionalsWithValue(witch)">
              <b>{{optionalsLabels[optionalAttribute]}}:</b>
              <template v-for="(subAtribute, index) in witch[optionalAttribute]">
                  {{subAtribute}}<template v-if="index < witch[optionalAttribute].length - 1">,</template>
              </template>
              <br>
            </div>

            <div v-if="witch.mannerOfDeath !== ''">
              <b>Manner of Death:</b> {{ witch.mannerOfDeath }}<br>
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

      <l-icon :icon-anchor="iconAnchor">
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
       baseMapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
       attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, James Dorret 1750 from the <a href="https://maps.nls.uk/geo/explore/#zoom=6.6&lat=57.29330&lon=-5.04553&layers=125140579&b=1">NLS Maps API</a>',
       locationOptions: ["residence", "detention", "placeOfDeath"],
       locationsLabels: {
         residence: "Residence",
         detention: "Detention",
         placeOfDeath: "Place of Death"
       },
       standardAttributes:["sex","occupation","socialClass"],
       standardAttributeLabels:{
        sex: "Gender",
        occupation: "Occupation",
        socialClass: "Social Class"
      },
       optionalAttributes: [
         "demonicPact", "propertyDamage", "meetingsInfo", "meetingsPlaces",
         "shapeshifting", "ritualObjects", 'primary', 'secondary'
       ],
       optionalsLabels: {
         demonicPact: "Alleged Pacts with the devil",
         propertyDamage: "Alleged Property Damage",
         meetingsPlaces: "Alleged meetings places",
         meetingsInfo: "Alleged nature of meetings",
         shapeshifting: "Alleged shapeshifting",
         ritualObjects: "Alleged ritual objects",
         primary: "Primary Characteristics",
         secondary: "Secondary Characteristics"
       }
     }
   },
   methods: {
     hasWikiEntry: function(marker) {
       let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
       return witchesWithEntry.length > 0;
     },
     flyTo: function (coords) {
       this.$refs.myMap.mapObject.flyTo(coords ,14);
     },
     emitMapData: function () {
       // Emmits an object containing the information about
       // where the center of the map is, the zoom, and what
       // map type to change to when the map is turned off,
       // in this case changing to clustersOn.

       let centerInfo = this.$refs.myMap.mapObject.getCenter();
       let centerArray = [centerInfo.lat, centerInfo.lng];
       let changeInfo = {
         center: centerArray,
         zoom: this.$refs.myMap.mapObject.getZoom(),
         changeTo: "clustersOn"
       };
       this.$emit("changeMaps", changeInfo);
     },
     getLocationsWithValue: function (witch) {
       let locationsWithValue = []

       this.locationOptions.map(option => {
         if (witch[option].locations.length !== 0) {
           locationsWithValue.push(option);
         }
       })

       return locationsWithValue
     },
     getStandardAttributesWithValue: function (witch) {
       let standardAttributesWithValue = [];

       this.standardAttributes.map(option => {
         if (witch[option] !== "unknown") {
           standardAttributesWithValue.push(option);
         }
       })

       return standardAttributesWithValue
     },
     getOptionalsWithValue: function (witch) {
       let optionalsWithValue = [];

       this.optionalAttributes.map(option => {
         if (witch.hasOwnProperty(option) && witch[option][0] !== "unknown") {
           optionalsWithValue.push(option);
         }
       })

       return optionalsWithValue
     }
   },
   computed: {
     iconAnchor: function () {
       return [11, 41];
     },
     shadowUrl: function () {
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
