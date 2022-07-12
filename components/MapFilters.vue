<template>
  <div>
    <!-- Filters -->
    <div class="border border-gray p-1 bg-gray-200 h-8
                flex items-center">
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
            <input type="checkbox" :checked="currentProperty.filters[filterType].active"
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
     }
   },
   data () {
     return {
       filters: false,
       noFiltersOn: 0,
       markers: JSON.parse(JSON.stringify(this.startingMarkers)),
       originalMarkers: [],
       currentTileName : 'Modern Map',
       tiles: [{name: 'Modern Map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true},
               {name: 'Historic Map', url: 'https://api.maptiler.com/tiles/uk-osgb1919/{z}/{x}/{y}.jpg?key=cKVGc9eOyhb8VH5AxCtw', active : false}],
       filterProperties: this.$store.getters['filters/getFilters'],
       currentIndex: this.$store.getters['filters/getCurrentIndex']
     }
   },
   methods: {
     getMarkerIcon: function (markerType) {
       // Returns the marker icon based on markerType (markerType
       // is eithera filterType or 'mixed'). 

       if (markerType === 'mixed') {
         return '/images/witch-single-purple.png';
       }
       return this.currentProperty.filters[markerType].iconUrl;
     },
     getMarkerType: function (witches) {
       // Gets the marker type (either a filterType, 'mixed' or null if
       // no witches are on) based on those witches that are on. Used 
       // to get the new marker type after setting witches on/off. 
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
     getMarkerState: function (marker) {
       // Returns a marker state array [markerIcon, onOff] based 
       // on the witches that are on. It gets the markerType by calling
       // getMarkerTypeOnFilter, and returns the state accordingly. 
       // Note that if getMarkerTypeOnFilter returns null, then no witches 
       // are on so the marker is off.
       let markerType = this.getMarkerType(marker.witches);

       if (markerType) {
        return [this.getMarkerIcon(markerType), true];
       }
       return [null, false]; 
     },
     getIsMixed: function (marker) {
       // Checks whether a marker is mixed.
       if (marker.markerIcon === '/images/witch-single-purple.png') {
         return true;
       }
       return false;
     },
     setWitchesOff: function (filterProperty, filterType) {
       // Filters <filterProperty>.<filterType> off. It goes through the current markers
       // setting witches that meet filter type to off and adds the 
       // current filter property to the witche's active filters.
       // If a marker is mixed, meaning it could stop being mixed, it
       // updates the marker state by calling getMarkerState.

       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];

         for (let w = 0, len = marker.witches.length; w < len; w++) {
           let witch = marker.witches[w];

           if (witch[filterProperty] === filterType) {
             witch.witchState.onOff = false;
             witch.witchState.activeFilters.push(filterProperty);
           } 
         }
         [marker.markerIcon, marker.onOff] = this.getMarkerState(marker);
       }  
     },
     getUpdatedWitchFilters (activeFilters, filterProperty) {
       if (activeFilters.length === 1) {
         return [];
       }
       return activeFilters.filter(function (activeProperty) {
         return activeProperty !== filterProperty;
       })
     },
     setWitchesOn: function (filterProperty, filterType) {
       // Filters <filterType> on. It goes through the current markers
       // setting witches that meet filter type to on and updating the witches
       // active filters. If a marker is not mixed, meaning it could become 
       // mixed, it updates the marker state by calling getMarkerState.

       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];

         for (let w = 0, len = marker.witches.length; w < len; w++) {
           let witch = marker.witches[w];
           
           if (witch[filterProperty] === filterType) {
             let newFilters = this.getUpdatedWitchFilters(witch.witchState.activeFilters, filterProperty);
             witch.witchState.activeFilters = newFilters;

             if (newFilters.length === 0) {
               witch.witchState.onOff = true;
             }
           }  
         }
         [marker.markerIcon, marker.onOff] = this.getMarkerState(marker);
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
       // Returns a markers array with only the markers and
       // witches that are on. This is the array that will be
       // emitted to parent, and will then be used by LeafletMap
       // to plot. 
       let outputMarkers = [];
       //console.log(this.markers);
       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];

         if (marker.onOff) {
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
         this.setWitchesOff(this.currentProperty.property, filterType);
         this.$emit('updatedMarkers', this.getOutputMarkers());
       } else {
         this.$store.commit('filters/setActive', filterType);
         this.setWitchesOn(this.currentProperty.property, filterType);
         this.$emit("updatedMarkers", this.getOutputMarkers());
       }
     },
     setAllIcons: function () {
       // Goes through all markers changing the icons according
       // to the current filter property. Called in togglefilterProperties 
       // when user changes filter properties so that icons update 
       // accordingly.
       for (let i = 0, len = this.markers.length; i < len; i++) {
         let marker = this.markers[i];
         [marker.markerIcon, marker.onOff] = this.getMarkerState(marker);
       }
     },
     applyAllFilters: function () {
       // Filters off all the filters that are not active. Called
       // when component is created, to apply the filters from the
       // store so that filters are shared accross pages.
       
       for (let i = 0, len = this.filterProperties.length; i < len; i++) {
         let filterProperty = this.filterProperties[i];
         let filters = Object.keys(filterProperty.filters);
         
         for (let f = 0, len = filters.length; f < len; f++) {
           let filterType = filters[f];

           if (!filterProperty.filters[filterType].active) {
             this.setWitchesOff(filterProperty.property, filterType);
           }
         }
       }
       console.log(this.getOutputMarkers());
       this.$emit("updatedMarkers", this.getOutputMarkers());
     },
     toggleFilterProperties: function (layerIndex) {
       this.currentIndex = layerIndex;
       this.setAllIcons();
       this.$emit("updatedMarkers", this.getOutputMarkers());
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
   },
   created () {
     this.applyAllFilters();
   }
 }
</script>

<style>

</style>
