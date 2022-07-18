<template>
  <!-- Filters pop-down -->
  <div class="absolute h-full xs:w-4/5 sm:w-1/2 md:w-2/5 
              xl:w-1/3 bg-slate-300 z-20 left-0 flex flex-col
              rounded-tr-xl rounded-br-xl shadow-md overflow-y-scroll">

    <div class="w-full flex justify-between px-5 
                md:px-10 mt-5 mb-8">
      <div v-for="tile in tiles">
        <input type="radio" name="tile" 
               :checked="tile.name === currentTileName" 
               @change="filterTiles(tile)" />
        {{tile.name}}
      </div>
    </div>

    <div v-for="(propertyItem, property) in filterProperties" 
          class="w-full flex flex-col ml-1">

      <div class="flex justify-between pl-2 py-1 bg-slate-400
                border-2 border-slate-500 mb-1 rounded-sm
                flex-wrap items-center" style="width: 225px;">
        <div class="flex w-4/5 items-center">
          <p> {{propertyItem.label}} </p>
          <div class="w-3 h-3 rounded-full ml-2" 
               :style="[propertyItem.active ? {'background-color': '#eeb518e1'} 
                                            : {'background-color': 'transparent'}]">
          </div>
        </div>
        <div class="svg-container flex border-2 w-7 h-7 mr-2
                   items-center justify-center border-icon-grey">
          <img src="images/arrow-down.svg" v-if="!propertyItem.showing" 
               @click="setPropertyToShowing(property)"
               class="arrow-icon" />
          <img src="images/arrow-up.svg" v-if="propertyItem.showing" 
               @click="setPropertyToNotShowing(property)"
               class="arrow-icon" />
        </div>
      </div>

      <div v-if="propertyItem.showing" 
          class="flex flex-wrap w-full px-2 mt-2">
        <div v-for="(filterItem, filter) in propertyItem.filters" 
             class="flex flex-col items-center mb-3 mx-2"
             style="width: 50px">
          <img class="witch-icon mb-2" :src="filterItem.iconUrl"/>
          <p class="text-xs text-center"> {{filterItem.label}} </p>
        </div>
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
     startingFilters: {
       type: Object,
       required: true
     }
   },
   data () {
     return {
       filters: false,
       noFiltersOn: 0,
       markers: JSON.parse(JSON.stringify(this.startingMarkers)),
       currentTileName: 'Modern Map',
       filterProperties: JSON.parse(JSON.stringify(this.startingFilters)),
       tiles: [{name: 'Modern Map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true},
               {name: 'Historic Map', url: 'https://api.maptiler.com/tiles/uk-osgb1919/{z}/{x}/{y}.jpg?key=cKVGc9eOyhb8VH5AxCtw', active : false}],
       currentProperty: 'sex',
     }
   },
   methods: {
     getMarkerIcon: function (markerType) {
       // Returns the marker icon based on markerType (markerType
       // is eithera filterType or 'mixed'). 

       if (markerType === 'mixed') {
         return '/images/witch-single-purple.png';
       }
       return this.filterProperties[this.currentProperty].filters[markerType].iconUrl;
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
       // filter property to the witche's active filters.
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
     setFilterInactive: function (filterType) {
       this.filterProperties[this.currentProperty].filters[filterType].active = false;
     },
     setFilterActive: function (filterType) {
       this.filterProperties[this.currentProperty].filters[filterType].active = true;
     },
     filterMarkers: function (filterType) {
       let isActive = this.filterProperties[this.currentProperty].filters[filterType].active;

       if (isActive) {
         this.setFilterInactive(filterType);
         this.setWitchesOff(this.currentProperty, filterType);
         this.$emit('updatedMarkers', this.getOutputMarkers());
       } else {
         this.setFilterActive(filterType);
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
     setPropertyToShowing: function (property) {
       // Sets the property <property> to showing.
       this.filterProperties[property].showing = true;
     },
     setPropertyToNotShowing: function (property) {
       // Sets the property <property> to showing.
       this.filterProperties[property].showing = false;
     },
     toggleFilterProperties: function (property) {
       this.currentProperty = property;
       this.setAllIcons();
       this.$emit("updatedMarkers", this.getOutputMarkers());
     },
     filterTiles: function (tile) {
       this.currentTileName = tile.name;
       this.$emit("updatedTile", tile.url);
     },
     toggleFilters: function () {
       this.filters = ! this.filters;
     }
   },
   mounted: function () {
     console.log(this.filterProperties);
   }
 }
</script>

<style>
.svg-container {
  border-radius: 50%;
}

.arrow-icon {
  max-width: 100%;
  max-height: 100%; 
}

.witch-icon {
  max-width: 20px;
  height: auto;
}
</style>
