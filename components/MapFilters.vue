<template>
  <!-- Filters pop-down -->
  <div class="absolute h-full w-1/4 bg-slate-300 z-20 
              left-0 flex flex-col rounded-tr-xl rounded-br-xl
              shadow-md">

    <div class="w-full flex justify-between px-10 mt-5 mb-8">
      <div v-for="tile in tiles">
        <input type="radio" name="tile" :checked="tile.name === currentTileName" 
               @change="filterTiles(tile)"/>
        {{tile.name}}
      </div>
    </div>

    <div v-for="property in allProperties" class="w-full flex flex-col ml-1">

      <div class="flex pl-2 py-1 bg-slate-400 w-2/3
                border-2 border-slate-500 mb-1 rounded-sm">
        <p>{{filterProperties[property].label}}</p>
        <img src="images/arrow-down.svg" v-if="!allFilters[property].active"
             @click="setPropertyToActive(property)" class="ml-2"/>
        <img src="images/arrow-up.svg" v-if="allFilters[property].active"
             @click="setPropertyToInactive(property)" class="ml-2"/>
      </div>

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
     filterProperties: {
       type: Object,
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
       allFilters: this.$store.getters['filters/getFilters'],
       currentProperty: this.$store.getters['filters/getCurrentProperty'],
       allProperties: Object.keys(this.filterProperties)
     }
   },
   methods: {
     getMarkerIcon: function (markerType) {
       // Returns the marker icon based on markerType (markerType
       // is eithera filterType or 'mixed'). 

       if (markerType === 'mixed') {
         return '/images/witch-single-purple.png';
       }
       return this.allFilters[this.currentProperty][markerType].iconUrl;
     },
     getMarkerType: function (witches) {
       // Gets the marker type (either a filterType, 'mixed' or null if
       // no witches are on) based on those witches that are on. Used 
       // to get the new marker type after setting witches on/off. 
       let markerType = null;

       for (let i = 0, len = witches.length; i < len; i++) {
          let witch = witches[i];

          if (witch.witchState.onOff) {
            let witchType = witch[this.currentProperty];

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
           let witchType = witch[filterProperty];
           
           if (witchType === filterType) {
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
       let isActive = this.allFilters[this.currentProperty][filterType].active;

       if (isActive) {
         this.$store.commit('filters/setInactive', filterType);
         this.setWitchesOff(this.currentProperty, filterType);
         this.$emit('updatedMarkers', this.getOutputMarkers());
       } else {
         this.$store.commit('filters/setActive', filterType);
         this.setWitchesOn(this.currentProperty, filterType);
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
       
       for (let i = 0, len = this.allProperties.length; i < len; i++) {
         let filterProperty = this.allProperties[i];
         let filters = this.filterProperties[filterProperty].filterTypes;
         
         for (let f = 0, len = filters.length; f < len; f++) {
           let filterType = filters[f];

           if (!this.allFilters[filterProperty][filterType].active) {
             this.setWitchesOff(filterProperty, filterType);
           }
         }
       }
       this.$emit("updatedMarkers", this.getOutputMarkers());
     },
     setPropertyToActive: function (property) {
       this.$store.commit('filters/setPropertyToActive', property);
     },
     setPropertyToInactive: function (property) {
       this.$store.commit('filters/setPropertyToInactive', property);
     },
     toggleFilterProperties: function (property) {
       this.currentProperty = property;
       this.setAllIcons();
       this.$emit("updatedMarkers", this.getOutputMarkers());
       this.$store.commit('filters/updateCurrentProperty', property);
     },
     filterTiles: function (tile) {
       this.currentTileName = tile.name;
       this.$emit("updatedTile", tile.url);
     },
     toggleFilters: function () {
       this.filters = ! this.filters;
     }
   },
   created () {
     this.applyAllFilters();
   }
 }
</script>

<style>

</style>
