<template>
  <div>
    <!-- Filters -->
    <div class="border border-gray p-1 bg-gray-200 h-8
                flex items-center"
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
             @click="toggleFilters(checked)">
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
          <span v-for="(layer, index) in filterProperties">
            <input type="radio" name="layer"
                   :checked="index === currentIndex"
                   @change="toggleFilterProperties(index)"/>
            &nbsp;{{layer.label}}&nbsp;
          </span>
        </div>
        <div class="pt-4">
          <span class="flex items-center float-left"
                v-for="(item, filterType) in currentProperty.filters">
            <input type="checkbox" :checked="true"
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
       filterProperties: this.$store.getters['filters/getFilters'],
       currentIndex: 0 // Index in filterProperties corresponding to current layer.
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
     getMarkerType: function (witches) {
       // Returns the markerType based on the witches
       // current filter property (mixed, a specific 
       // filterType or null if there are no active witches).
       let markerType = null;

       for (let i = 0, len = witches.length; i < len; i++) {
          let witch = witches[i];

          if (witch.witchState.onOff) {
            let witchType = witch[this.currentProperty.property];

            if (!markerType) {
               markerType = witchType;
            } else if (witchType !== markerType) {
               return 'mixed';
            }
          }
       }
       return markerType;
     },
     getMarkerIcon: function (marker) {
       // Sets the icon and marker type of a marker depending on 
       // its witches.
       let markerType = this.getMarkerType(marker.witches);

       if (markerType) {
         if (markerType === 'mixed') {
           return '/images/witch-single-purple.png';
         }
         return this.currentProperty.filters[markerType].iconUrl;
       }
       return markerType; 
     },
     getIsMixed: function (marker) {
       if (marker.markerIcon === '/images/witch-single-purple.png') {
         return true;
       }
       return false;
     },
     setWitchesOff: function (filterType) {
       // Filters <filterType> off. It goes through the current markers
       // setting witches that meet filter type to off and adds the 
       // current filter property to the witche's active filters. The function deals 
       // with the marker state itself instead of calling updateMarkerState in order 
       // to save iterating through all the witches twice. 

       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];

         for (let w = 0, len = marker.witches.length; w < len; w++) {
           let witch = marker.witches[w];
           let witchType = witch[this.currentProperty.property];

           if (witchType === filterType) {
             witch.witchState.onOff = false;
             witch.witchState.activeFilters.push(this.currentProperty.property);
           }
           marker.markerIcon = this.getMarkerIcon(marker);
         }  
       } 
     },
     updateWitchFilters (activeFilters, filterProperty) {
       if (activeFilters.length === 1) {
         return [];
       }
       return activeFilters.filter(function (activeProperty) {
         return activeProperty !== filterProperty;
       })
     },
     setWitchesOn: function (filterType) {
       // Filters <filterType> on. It goes through the current markers
       // setting witches that meet filter type to on and updating the witches
       // active filters. It returns a markers array with the witches that are on. 

       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];
         let newActiveWitches = false;
         let noDifferentActiveTypes = 0;

         for (let w = 0, len = marker.witches.length; w < len; w++) {
           let witch = marker.witches[w];
           
           if (witch[this.currentProperty.property] === filterType) {
             let newActiveFilters = this.updateWitchFilters(witch.witchState.activeFilters, this.currentProperty.property);
             witch.witchState.activeFilters = newActiveFilters;
             
             if (newActiveFilters.length === 0) {
               witch.witchState.onOff = true;
               newActiveWitches = true;
             }
           } else if (witch.witchState.onOff) {
             noDifferentActiveTypes += 1;
           }    
         }
         if (newActiveWitches) {
           if (noDifferentActiveTypes === 0) {
             marker.markerIcon = this.currentProperty.filters[filterType].iconUrl;
           } else {
             marker.markerIcon = '/images/witch-single-purple.png';
           }  
         }
       }
     },
     buildOutputMarker: function (marker, newWitches) {
       return {
         location: marker.location,
         longLat: marker.longLat,
         witches: newWitches,
         markerIcon: marker.markerIcon
       }
     },
     getOutputMarkers() {
       let outputMarkers = [];

       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];
         // If no witches are on marker icon is null.
         if (marker.markerIcon) {
           let activeWitches = marker.witches.filter(function (witch) {
             return witch.witchState.onOff;
           });
           outputMarkers.push(this.buildOutputMarker(marker, activeWitches));
         }
       }
       return outputMarkers;
     },
     filterMarkers: function (filterType) {
       let isActive = this.currentProperty.filters[filterType].active;

       if (isActive) {
         this.$store.commit('filters/setInactive', filterType);
         this.setWitchesOff(filterType);
         this.$emit('updatedMarkers', this.getOutputMarkers());
       } else {
         this.$store.commit('filters/setActive', filterType);
         this.setWitchesOn(filterType);
         this.$emit("updatedMarkers", this.getOutputMarkers());
       }
     },
     setAllMarkerIcons: function () {
       // Goes through all markers changing the icons,
       // called in togglefilterProperties when user changes
       // layers, so that the marker "legend" updates.

       this.originalMarkers.forEach(this.updateMarkerState);
       this.markers = JSON.parse(JSON.stringify(this.originalMarkers));
     },
     toggleFilterProperties: function (layerIndex) {
       this.currentIndex = layerIndex;
       this.setAllMarkerIcons();
       this.$emit("updatedMarkers", this.markers);
       this.$store.commit('filters/updateIndex', layerIndex);
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
     currentProperty: function () {
       return this.filterProperties[this.currentIndex];
     }
   }

 }
</script>

<style>

</style>
