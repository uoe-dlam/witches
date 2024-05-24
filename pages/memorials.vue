<template>
  <div id="map-wrapper" class="w-full h-full relative">
    <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" ref="myMap">
      <l-control-zoom position="bottomright"></l-control-zoom>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="(memorial, i) in markers" :key="i" :lat-lng="memorial.longLat">
        <l-popup class="adapted-popup">
          <h3>{{ memorial.name }}</h3><br>
          <div v-if="memorial.imageUrl" class="mb-5">
            <a :title="'Image Source: ' + memorial.imageUrl" :href="memorial.imageUrl">
              <img width="150vw" :alt="memorial.name" :src="memorial.imageUrl">
            </a>
          </div>
          <div>
            <b>Description:</b> {{ memorial.description }}<br>
            <b>Location:</b> {{ memorial.location }}<br>
            <b>Street Address:</b> {{ memorial.streetAddress }}<br>
            <b>Instance Of:</b> {{ memorial.instance }}<br>
            <a :href="memorial.url" class="underline text-sky-500 hover:text-sky-700">Read More Here</a><br>
          </div>
        </l-popup>
        <l-icon :icon-anchor="iconAnchor">
          <div class="icon-wrapper">
            <div v-if="poiList.includes(memorial.instance)">
              <img src="../static/images/witch-single-brown.png" class="zoomed-in-img" />
            </div>
            <div v-else>
              <img src="../static/images/witch-single-grey.png" class="zoomed-in-img" />
            </div>
            <img class="icon-shadow" src="../static/images/witch-single-shadow.png" />
          </div>
        </l-icon>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { SPARQLQueryDispatcher } from '~/assets/js/SPARQLQueryDispatcher'

export default {
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 7,
      center: [57.00, -4],
      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.',
      markers: [],
      originalMarkers: [],
      sparqlUrl: 'https://query.wikidata.org/sparql',
      poiList: ['historic landmark','tourist attraction','statue'],
      memList: ['memorial','standing stone','commemorative plaque'],
      descriptions: {} // To store descriptions from JSON
    }
  },
  methods: {
    async loadDescriptions() {
      const response = await fetch('/witch_memorials.json');
      const data = await response.json();
      this.descriptions = data.reduce((acc, item) => {
        acc[item.wikidata_code] = item.description;
        return acc;
      }, {});
    },
    loadMemorials() {
      const sparqlQuery = `
          SELECT DISTINCT ?item ?itemLabel ?instanceLabel ?image ?coords ?locationLabel ?address ?url
          WHERE {
              ?item wdt:P5008 wd:Q123249004 .
              OPTIONAL { ?item wdt:P31 ?instance . }
              OPTIONAL { ?item wdt:P131 ?location . }
              OPTIONAL { ?item wdt:P625 ?coords . }
              OPTIONAL { ?item wdt:P18 ?image . }
              OPTIONAL { ?item wdt:P6375 ?address . }
              OPTIONAL { ?item wdt:P973 ?url . }
              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          }`;

      const queryDispatcher = new SPARQLQueryDispatcher(this.sparqlUrl);
      queryDispatcher.query(sparqlQuery).then(result => {
          let memorials = [];

          for (let i = 0; i < result.results.bindings.length; i++) {
              let item = result.results.bindings[i];
              let id = item.item.value;
              let instance = item.hasOwnProperty('instanceLabel') ? item.instanceLabel.value : 'unknown';
              let memorialCoords = item.hasOwnProperty('coords') ? this.convertPointToLongLatArray(item.coords.value) : '';
              let memorialLocation = item.hasOwnProperty('locationLabel') ? item.locationLabel.value : '';
              let imageUrl = item.hasOwnProperty('image') ? item.image.value : '';
              let streetAddress = item.hasOwnProperty('address') ? item.address.value : '';
              let url = item.hasOwnProperty('url') ? item.url.value : '';
              let description = this.descriptions[id.split('/').pop()] || ''; // Use description from JSON

              let memorial = {
                  id: id,
                  name: item.itemLabel.value,
                  longLat: memorialCoords,
                  location: memorialLocation,
                  instanceOf: instance,
                  imageUrl: imageUrl,
                  streetAddress: streetAddress,
                  url: url,
                  description: description // Add description to the memorial object
              }

              memorials.push(memorial);
              this.addMemorialToMarkers(memorial, memorialLocation, memorialCoords, instance, item.itemLabel.value, imageUrl, streetAddress, url, description);
          }
          this.noItems = memorials.length;
          this.originalMarkers = JSON.parse(JSON.stringify(this.markers));
          this.loading = false;
      });
    },

    addMemorialToMarkers(memorial, memorialLocation, memorialCoords, instance, name, imageUrl, streetAddress, url, description) {
        if (memorialCoords && memorialCoords.length === 2) {
            let marker = this.markers.find(marker => marker.location === memorialLocation);

            if (marker) {
                marker.memorials.push(memorial);
            } else {
                let marker = {
                    name: name,
                    instance: instance,
                    location: memorialLocation,
                    longLat: memorialCoords,
                    imageUrl: imageUrl,
                    streetAddress: streetAddress,
                    url: url,
                    memorials: [memorial],
                    description: description // Add description to the marker
                }

                this.markers.push(marker);
            }
        } else {
            console.log('Skipping marker with null coordinates:', memorial);
        }
    },
    convertPointToLongLatArray(pointString) {
      pointString = pointString.substr(6);
      pointString = pointString.slice(0, -1);
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
        this.$refs.myMap.mapObject.removeLayer(marker);
      });
      this.markers = [];
    }
  },

  async mounted() {
    await this.loadDescriptions(); // Load descriptions first
    this.loadMemorials();
    console.log('Markers:', this.markers);
  },
  beforeDestroy() {
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
}
</style>
