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
          <div class="w-3 h-3 rounded-full ml-2" :style="[property === currentProperty 
                                                     ? {'background-color': '#eeb518e1'} 
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
 
      <div v-if="propertyItem.showing" class="w-full px-2 mt-2">

        <div v-if="property === currentProperty" class="w-full flex flex-wrap">
          <div v-for="(filterItem, filterType) in propertyItem.filters" 
               class="flex flex-col items-center mx-2 mb-3"
               style="width: 50px">

            <div class="flex justify-center items-center">
              <input :checked="filterProperties[property].filters[filterType].active"
                @change="filterMarkers(property, filterType)" type="checkbox" />
              <img class="witch-icon mb-1 ml-0.5" :src="filterItem.iconUrl" />
            </div>
            <p class="text-xs text-center"> {{filterItem.label}} </p>

          </div>
        </div>

        <div v-else class="flex flex-col items-start w-full mb-1">
          <div class="flex mb-2 px-0.5 items-center">
            <p class=" ml-1 text-xs">
              Activate {{propertyItem.label}} icons
            </p>
            <label class="switch relative ml-1">
              <input :checked="false" @change="setPropertyToCurrent(property)" 
                     type="checkbox">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="w-full flex flex-wrap">
            <div v-for="(filterItem, filterType) in propertyItem.filters">
              <div class="flex mb-3 mx-2 w-full items-center">
                <input :checked="filterProperties[property].filters[filterType].active"
                  @change="filterMarkers(property, filterType)" type="checkbox" />
                <p class="text-xs text-center ml-1"> {{filterItem.label}} </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="flex ml-2 mt-2">
      <div class="w-3 h-3 rounded-full ml-2 mt-0.5" 
            style="background-color: #eeb518e1">
      </div>
      <p class="text-xs ml-1 w-4/5">
        Indicates the filter property for which the icons are showing.
      </p>
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
       currentProperty: 'sex', // Determines the property the icons of which are showing.
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
     setFilterInactive: function (property, filterType) {
       this.filterProperties[property].filters[filterType].active = false;
     },
     setFilterActive: function (property, filterType) {
       this.filterProperties[property].filters[filterType].active = true;
     },
     filterMarkers: function (property, filterType) {
       console.log(property);
       let isActive = this.filterProperties[property].filters[filterType].active;

       if (isActive) {
         this.setFilterInactive(property, filterType);
         this.setWitchesOff(property, filterType);
         this.$emit('updatedMarkers', this.getOutputMarkers());
       } else {
         this.setFilterActive(property, filterType);
         this.setWitchesOn(property, filterType);
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
     setPropertyToCurrent: function (property) {
       // Sets <property> as the current property, and 
       // calls setAllIcons to change the icons accordingly.
       this.currentProperty = property;
       this.setAllIcons();
       this.$emit("updatedMarkers", this.getOutputMarkers());
     },
     setPropertyToShowing: function (property) {
       // Sets the property <property> to showing, and calls 
       // setPropertyToCurrent to set the property as the current
       // current property, and change the icons accordingly.
       if (this.currentProperty !== property) { 
         this.setPropertyToCurrent(property);
       }
       this.filterProperties[property].showing = true;
     },
     setPropertyToNotShowing: function (property) {
       // Sets the property <property> to showing.
       this.filterProperties[property].showing = false;
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
   -webkit-transition: .2s;
   transition: .2s;
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

 input:checked+.slider {
   background-color: #eeb518e1;
 }

 input:focus+.slider {
   box-shadow: 0 0 1px #eeb518e1;
 }

 input:checked+.slider:before {
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
