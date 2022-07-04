<template>
  <div>
    <!-- Filters -->
    <div class="border border-gray p-1 bg-gray-200 h-10
                align-middle"
         v-if="!isLoading">
      <span class="flex items-center float-left">
        &nbsp;Filters
      </span>
      <span class="rounded-full border-r border-l border-gray-400
                   w-6 h-6 flex items-center justify-center
                   ml-2 float-left">
        <!-- icon by feathericons.com -->
        <svg v-if="!filters" aria-hidden="true" class=""
             data-reactid="266" fill="none" height="24"
             stroke="#606F7B" stroke-linecap="round"
             stroke-linejoin="round" stroke-width="2"
             viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
             @click="toggleFilters()">
          <polyline points="6 9 12 15 18 9">
          </polyline>
        </svg>
        <svg v-if="filters" aria-hidden="true" class=""
             data-reactid="266" fill="none" height="24" stroke="#606F7B"
             stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
             viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
             @click="toggleFilters()">
          <polyline points="18 15 12 9 6 15">
          </polyline>
        </svg>
      </span>
    </div>
    <!-- Filters pop-down -->
    <div id="map-filters" :class="filters ? 'block': 'hidden'"
         class="pl-5 pr-5 pt-3 pb-3 text-xs">
      <div>
        <span v-for="(tile, index) in tiles">
          <input type="radio" name="tile"
                 :checked="tile.name === currentTileName"
                 @change="filterTiles(tile)"/>
          &nbsp;{{tile.name}}&nbsp;
        </span>
      </div>
      <br>
      <div class="flex flex-col">
        <div>
          <span v-for="(layer, index) in filterLayers">
            <input type="radio" name="layer"
                   :checked="index === currentLayer"
                   @change="toggleFilterLayers(index)"/>
            &nbsp;{{layer.label}}&nbsp;
          </span>
        </div>
        <div class="pt-2">
          <span class="flex items-center float-left"
                v-for="(item, filterType) in filterLayers[currentLayer].filters">
            <input type="checkbox" v-model="item.active"
                   @change="filterMarkers(filterType)"/>
            &nbsp;
            <img :src="item.iconUrl" width="12" height="20"/>
            &nbsp;{{item.label}}&nbsp;
          </span>
        </div>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
 export default {
   props: {
     startingMarkers: {
       type: Array,
       required: true
     },
     filterLayers: {
       type: Array,
       required: true
     },
     isLoading: {
       type: Boolean,
       required: true
     }
   },
   data () {
     return {
       filters: false,
       noFiltersOn: 0,
       markers: [],
       originalMarkers: [],
       currentTileName : 'Modern Map',
       tiles: [{name: 'Modern Map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true},
               {name: 'Historic Map', url: 'https://api.maptiler.com/tiles/uk-osgb1919/{z}/{x}/{y}.jpg?key=cKVGc9eOyhb8VH5AxCtw', active : false}],
       currentLayer: 0, // Index in filterLayers corresponding to current layer.
     }
   },
   watch: {
     startingMarkers: {
       handler(newValue, oldValue) {
         this.originalMarkers = JSON.parse(JSON.stringify(newValue));
         this.markers = JSON.parse(JSON.stringify(newValue));
       }
     }
   },
   methods: {
     getMarkerType: function (marker) {
       // Returns the marker type. If it detects that
       // one witch has a different type to the others,
       // returns mixed straight away. Otherwise returns
       // markerType, which will be common to all witches.

       let markerType = '';
       let witches = marker.witches;
       for (let i = 0, len = witches.length; i < len; i++) {
         let witch = witches[i];
         let witchType = witch[this.currentFilterProperty];
         if (i === 0) {
           markerType = witchType;
         } else if (witchType !== markerType) {
           return 'mixed';
         }
       }
       return markerType;
     },
     getMarkerIcon: function (marker) {
       // Sets the incon of a marker depending on its
       // marker type, which it gets from calling
       // getMarkerType.

       let markerType = this.getMarkerType(marker);
       if( markerType === 'mixed' ) {
         return '/images/witch-single-purple.png';
       } else {
         return this.filterLayers[this.currentLayer].filters[markerType].iconUrl;
       }
     },
     updateMarkerState: function (marker) {
       // Updates the state of a marker after it being
       // filtered. Specifically, its marker Icon and
       // if it needs to be on or off depending on whether
       // all the witches have been filtered out.

       if (marker.witches.length > 0) {
         marker.markerIcon = this.getMarkerIcon(marker);
         marker.onOff = true;
       } else {
         marker.onOff = false;
       }
       return marker;
     },
     removeWitchesFromArray: function (witches, filterType) {
       // Given an array of witches, it filters out the
       // witches that meet the property filterType.

       let fwitches = [];
       for (let i = 0, len = witches.length; i < len; i++) {
         let witch = witches[i]
         if (witch[this.currentFilterProperty] !== filterType) {
           fwitches.push(witch);
         }
       }
       return fwitches;
     },
     getWitchesFromArray: function (witches, filterType) {
       // Given an array of witches, it returns the an array
       // with the ones that meet the property filterType.

       let fwitches = [];
       for (let i = 0, len = witches.length; i < len; i++) {
         let witch = witches[i]
         if (witch[this.currentFilterProperty] === filterType) {
           fwitches.push(witch);
         }
       }
       return fwitches;
     },
     recoverWitches: function (witches, filterType, index) {
       // Recovers the witches that meet filterType
       // from the original marker at index <index>.

       let originalWitches = this.originalMarkers[index].witches;
       let recoveredWitches = this.getWitchesFromArray(originalWitches, filterType);
       return witches.concat(recoveredWitches);
     },
     filterOff: function (filterType){
       // Filters <filterType> off. It goes through the current markers
       // and removes the witches which meet filterType using
       // filterWitchesArray. It then updates the marker state.

       this.markers.forEach(marker => {
         marker.witches = this.removeWitchesFromArray(marker.witches, filterType);
         this.updateMarkerState(marker);
       });
       this.noFiltersOff += 1; // Keeping track of the number of inactive filters.
     },
     filterOn: function (filterType) {
       // Filters <filterType> on. It goes through the
       // markers and adds the witches from the corresponding original
       // marker that meet filterType. It recovers the witches using
       // recoverWitches. It then updates the marker state.

       this.markers.forEach((marker, index) => {
         marker.witches = this.recoverWitches(marker.witches, filterType, index);
         this.updateMarkerState(marker);
       })
     },
     filterMarkers: function (filterType) {
       let isActive = this.filterLayers[this.currentLayer].filters[filterType].active;
       if (isActive) {
         this.filterOn(filterType);
       }
       else {
         this.filterOff(filterType);
       }
       this.$emit("updatedMarkers", this.markers);
     },
     setAllMarkerIcons: function () {
       // Goes through all markers changing the icons,
       // called in toggleFilterLayers when user changes
       // layers, so that the marker "legend" updates.

       this.originalMarkers.forEach(this.updateMarkerState);
       this.markers = JSON.parse(JSON.stringify(this.originalMarkers));
     },
     toggleFilterLayers: function (layerIndex) {
       this.currentLayer = layerIndex;
       this.setAllMarkerIcons()
       this.$emit("updatedMarkers", this.markers);
     },
     filterTiles: function (tile) {
       this.currentTileName = tile.name;
       this.$emit("updatedTile", tile.url);
     },
     toggleFilters: function () {
       this.filters = ! this.filters;
     }
   },
   computed: {
     currentFilterProperty: function() {
       return this.filterLayers[this.currentLayer].property;
     }
   }
 }
</script>

<style>

</style>
