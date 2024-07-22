<template>
  <div id="map-wrapper" class="flex flex-col h-full w-full relative">
    <!-- Filters -->
    <div class="absolute flex flex-col w-full h-full">
      <div
        class="xs:w-11/12 sm:w-1/2 lg:w-2/5 xl:w-1/3 z-20 left-0"
        :style="filtersBox ? {} : { 'pointer-events': 'none' }"
      >
        <transition>
          <div class="w-full h-full flex" v-if="filtersBox">
            <div class="h-full flex flex-col bg-white
                        rounded-tr-xl rounded-br-xl filters-shadow
                        overflow-y-auto overflow-x-hidden
                        relative"
             style="width:90%">
              <!-- Header -->
              <div class="flex w-full flex-col bg-white md:sticky md:top-0 md:z-10" ref="FiltersHeader">
                <div class="flex flex-col w-full h-full" style="backdrop-filter: blur(1.5px);">
                  <!-- Title and info-->
                  <div class="flex text-center mt-1">
                    <h1 class="text-3xl mx-0 px-2">Map of Memorials & Sites of Interest</h1>
                  </div>

                  <!-- Display number of active witches. -->
                  <div class="ml-3 flex mt-3 items-center pb-2">
                    <p class="mr-2 text-lg witchy-text">Showing</p>
                    <div class="h-6 px-1 flex items-center justify-center mr-2 border-2 rounded-md text-white font-medium bg-slate-500 border-slate-700">
                      <p>{{ filteredMarkers.length }}</p>
                    </div>
                    <p class="mr-1 text-lg witchy-text">Locations</p>
                  </div>
                </div>
                <div class="w-full border mt-1"></div>
              </div>

              <!-- Explanation Paragraph -->
              <div class="m-3">
                <p class="mb-3">
                  This map displays some of the locations across Scotland connected to the Scottish Witch trials (1563-1736). It includes memorials commemorating and honouring those accused of witchcraft during this period, as well as highlighting Points of Interest, such as tourist attractions, sites connected to popular belief surrounding witchcraft, and locations where executions took place.
                </p>
                <p>
                  If you know of any other memorials or sites of interest related to the Scottish witch trials that are not already included, please let us know on our <a class="underline hover:text-gray-500" href="/contact">Contact</a> page.
                </p>
              </div>

              <!-- Filter Checklist -->
              <div class="ml-3 mb-6">
                <h1 class="text-2xl mb-3">Filters</h1>
                <div class="flex space-x-6">
                  <div class="flex flex-col items-center">
                    <label for="poi-filter" class="flex flex-col items-center cursor-pointer">
                      <img class="w-8 mb-2" src="../static/images/witch-single-brown.png" alt="Point of Interest Icon" />
                      <span class="text-xs">Sites of Interest</span>
                    </label>
                    <input type="checkbox" id="poi-filter" v-model="filters.poi"  />
                  </div>
                  <div class="flex flex-col items-center">
                    <label for="memorial-filter" class="flex flex-col items-center cursor-pointer">
                      <img class="w-8 mb-2" src="../static/images/witch-single-grey.png" alt="Memorial Icon" />
                      <span class="text-xs">Memorials</span>
                    </label>
                    <input type="checkbox" id="memorial-filter" v-model="filters.memorial" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Left chevron to hide filters. -->
            <div class="w-8 flex flex-col justify-center ml-1" v-if="filtersBox">
              <div
                class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 filters-shadow"
                @click="toggleFiltersBox"
              >
                <img class="max-w-full max-h-full" src="/images/chevrons-left.svg" />
              </div>
            </div>
          </div>
        </transition>

        <!-- Right chevron to show filters. -->
        <div class="w-8 flex flex-col justify-center ml-1 h-full" v-if="!filtersBox" style="pointer-events: auto;">
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 filters-shadow"
            @click="toggleFiltersBox"
          >
            <img class="max-w-full max-h-full" src="/images/chevrons-right.svg" />
          </div>
        </div>
      </div>

      <!-- Map -->
      <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" ref="myMap">
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker v-for="(memorial, i) in filteredMarkers" :key="i" :lat-lng="memorial.longLat">
          <l-popup class="adapted-popup">
            <h3>{{ memorial.name }}</h3><br />
            <div v-if="memorial.imageUrl" class="mb-5 flex justify-center items-center">
              <a :title="'Image Source: ' + memorial.imageUrl" :href="memorial.imageUrl">
                <img width="150vw" :alt="memorial.name" :src="memorial.imageUrl" />
              </a>
            </div>
            <div>
              <b>Instance Of:</b> {{ memorial.instance }}<br />
              <b>Description:</b> {{ memorial.description }}<br />
              <b>Location:</b> {{ memorial.location }}<br />
              <b>Street Address:</b> {{ memorial.streetAddress }}<br />
              <a :href="memorial.url" class="underline text-sky-500 hover:text-sky-700">Read More Here</a><br />
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
  </div>
</template>


<script>
import { SPARQLQueryDispatcher } from '~/assets/js/SPARQLQueryDispatcher'

export default {
  data() {
    return {
      filtersBox: true,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 7,
      center: [57.00, -4],
      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.',
      markers: [],
      originalMarkers: [],
      sparqlUrl: 'https://query.wikidata.org/sparql',
      poiList: ['historic landmark', 'tourist attraction', 'statue','mural','museum','haunted attraction','tomb','destroyed building or structure'],
      memList: ['memorial', 'standing stone', 'commemorative plaque','labyrinth','grave'],
      descriptions: {}, 
      filters: {
        poi: true,
        memorial: true,
      },
    }
  },
  computed: {
    filteredMarkers() {
      return this.markers.filter(marker => {
        if (this.filters.poi && this.poiList.includes(marker.instance)) {
          return true;
        }
        if (this.filters.memorial && this.memList.includes(marker.instance)) {
          return true;
        }
        return false;
      });
    },
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
          let description = this.descriptions[id.split('/').pop()] || ''; 

          let memorial = {
            id: id,
            name: item.itemLabel.value,
            longLat: memorialCoords,
            location: memorialLocation,
            instance: instance,
            imageUrl: imageUrl,
            streetAddress: streetAddress,
            url: url,
            description: description 
          }

          memorials.push(memorial);
          console.log('Memorial:', memorial);
          this.addMemorialToMarkers(memorial, memorialLocation, memorialCoords, instance, item.itemLabel.value, imageUrl, streetAddress, url, description);
        }

        this.noItems = memorials.length;
        this.originalMarkers = JSON.parse(JSON.stringify(this.markers));
        console.log('originalMarkers:', this.originalMarkers);
        this.loading = false;
      });
    },

    addMemorialToMarkers(memorial, memorialLocation, memorialCoords, instance, name, imageUrl, streetAddress, url, description) {
      if (memorialCoords && memorialCoords.length === 2) {
        let marker = this.markers.find(marker => marker.name === name);

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
            description: description 
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
    },
    toggleFiltersBox() {
      this.filtersBox = !this.filtersBox;
    },
  },

  async mounted() {
    await this.loadDescriptions(); 
    this.loadMemorials();
    console.log('Markers:', this.markers);
  },
  beforeDestroy() {
    this.emitMapData();
    this.removeMarkersFromMap();
  }
};
</script>

