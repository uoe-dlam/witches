<template>
  <div class="absolute h-full xs:w-4/5 sm:w-1/2 md:w-2/5
              xl:w-1/3 z-20 left-0">
    <transition>
      <div class="w-full h-full flex" v-if="filtersBox">
        <!-- Filters box -->
        <div class="h-full flex flex-col bg-white
                rounded-tr-xl rounded-br-xl filters-shadow
                overflow-y-scroll overflow-x-hidden"
             style="width:90%">

          <!-- Map tiles -->
          <div class="w-full flex justify-between px-2 sm:px-3
                      md:px-5 lg:px-10 mt-5 mb-6">
            <div v-for="tile in tiles">
              <input type="radio" name="tile" 
                     :checked="tile.name === currentTileName" 
                     @change="filterTiles(tile)" />
              {{ tile.name }}
            </div>
          </div>

          <!-- Filter dropdowns -->
          <div v-for="(propertyItem, property) in filterProperties" 
               class="w-full flex flex-col ml-1">

            <div class="flex pl-2 py-1 flex-wrap items-center mt-2
                        cursor-pointer" 
                 style="width: 225px;" 
                 @click="togglePropertyShowing(property)">
              <p style="font-weight: 500;"> {{ propertyItem.label }} </p>
              <img src="images/arrow-down.svg" v-if="!propertyItem.showing"
                   class="w-6 h-6" />
              <img src="images/arrow-up.svg" v-if="propertyItem.showing" 
                   class="w-6 h-6" />
            </div>

            <!-- Filters list if property is showing. -->
            <div v-if="propertyItem.showing" class="w-full ml-1">

              <!-- If it is the current property, show list with icons. -->
              <div v-if="property === currentProperty" 
                   class="w-full flex flex-wrap mt-2">
                <div v-for="(filterItem, filterType) in propertyItem.filters"
                     class="flex flex-col items-center mx-3 mb-2" 
                     style="width: 50px">

                  <div class="flex justify-center items-center">
                    <input :checked="filterProperties[property].filters[filterType].active"
                           @change="filterMarkers(property, filterType)" 
                           type="checkbox" />
                    <img class="witch-icon mb-1 ml-0.5" :src="filterItem.iconUrl" />
                  </div>
                  <p class="text-xs text-center"> {{ filterItem.label }} </p>
                </div>
              </div>

              <!-- Else, show list without icons but with button to switch 
              to current. -->
              <div v-else class="flex flex-col items-start w-full mt-2 mb-2">
                <div class="w-full flex flex-wrap px-2">
                  <div v-for="(filterItem, filterType) in propertyItem.filters">
                    <div class="flex mb-3 mx-2 w-full items-center">
                      <input :checked="filterProperties[property].filters[filterType].active"
                              @change="filterMarkers(property, filterType)" 
                              type="checkbox" />
                      <p class="text-xs text-center ml-1"> 
                        {{ filterItem.label }} 
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col w-4/5 ml-1 items-end mt-1">
                  <div class="self-end flex justify-start items-center 
                              mb-1 mr-1">
                    <p class="text-xs">
                      Show {{ propertyItem.label }} Icons
                    </p>
                    <label class="container flex items-center
                              justify-center ml-1">
                      <input type="radio" :checked="false" name="radio" 
                            @change="setPropertyToCurrent(property)">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div class="w-full bg-slate-600" style="height:1.2px;"></div>
                </div>
              </div>

            </div>
          </div>

          <div class="self-end flex flex-col h-full justify-end
                      mb-5 mr-3">
              <p class="text-sm">
                - &nbsp Showing icons for {{filterProperties[currentProperty].label}}.
              </p>
              <div class="flex items-center">
                <p class="text-sm mr-0.5">-</p>
                <img class="witch-icon mb-1 ml-1" 
                     src="/images/witch-single-purple.png" />
                <p class="ml-1 text-sm">= Mixed.</p>
              </div>
          </div> 
        </div>

        <!-- Left chevron to hide filters. -->
        <div class="w-8 flex flex-col justify-center ml-1">
          <div class="flex items-center justify-center w-8 h-8
                  rounded-full bg-slate-200 filters-shadow" 
               @click="toggleFiltersBox()">
            <img class="max-w-full max-h-full" src="images/chevrons-left.svg" />
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Right chevron to show filters. -->
    <div class="w-8 flex flex-col justify-center ml-1 h-full" v-if="!filtersBox">
      <div class="flex items-center justify-center w-8 h-8
                  rounded-full bg-slate-200 filters-shadow" 
           @click="toggleFiltersBox()">
        <img class="max-w-full max-h-full" src="images/chevrons-right.svg" />
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
       filtersBox: true,
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

       for (let i = 0; i < witches.length; i++) {
         let witch = witches[i];

         if (witch.witchState.on) {
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
       // Returns a marker state array [markerIcon, active] based
       // on the witches that are on in the marker. It gets the markerType 
       // by calling getMarkerType, and returns the state accordingly.
       // Note that if getMarkerTypeOnFilter returns null, then no witches
       // are on so the marker is off.
       let markerType = this.getMarkerType(marker.witches);

       if (markerType) {
         return [this.getMarkerIcon(markerType), true];
       }

       return [null, false];
     },
     setWitchesOff: function (filterProperty, filterType) {
       // Filters <filterProperty>.<filterType> off. It goes through the current markers
       // setting witches that meet filter type to off and adds the
       // filter property to the witche's active filters.
       // If a marker is mixed, meaning it could stop being mixed, it
       // updates the marker state by calling getMarkerState.

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         for (let w = 0; w < marker.witches.length; w++) {
           let witch = marker.witches[w];

           if (witch[filterProperty] === filterType) {
             witch.witchState.on = false;
             witch.witchState.activeFilters.push(filterProperty);
           }
         }

         [marker.markerIcon, marker.active] = this.getMarkerState(marker);
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

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         for (let w = 0; w < marker.witches.length; w++) {
           let witch = marker.witches[w];
           let witchType = witch[filterProperty];

           if (witchType === filterType) {
             let newFilters = this.getUpdatedWitchFilters(witch.witchState.activeFilters, filterProperty);
             witch.witchState.activeFilters = newFilters;

             if (newFilters.length === 0) {
               witch.witchState.on = true;
             }
           }
         }

         [marker.markerIcon, marker.active] = this.getMarkerState(marker);
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

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         if (marker.active) {
           let activeWitches = marker.witches.filter(function (witch) {
             return witch.witchState.on;
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
       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];
         [marker.markerIcon, marker.active] = this.getMarkerState(marker);
       }
     },
     setPropertyToCurrent: function (property) {
       // Sets <property> as the current property, and
       // calls setAllIcons to change the icons accordingly.
       this.currentProperty = property;
       this.setAllIcons();
       this.$emit("updatedMarkers", this.getOutputMarkers());
     },
     togglePropertyShowing: function (property) {
       // If the property <property> is not showing, sets to showing, 
       // and calls setPropertyToCurrent to set the property as the
       // current property, and change the icons accordingly. If it is
       // showing, sets to not showing.
       
       if (!this.filterProperties[property].showing) {
         if (this.currentProperty !== property) {
           this.setPropertyToCurrent(property);
         }

         this.filterProperties[property].showing = true;
       } else {
         this.filterProperties[property].showing = false;
       }
     },
     filterTiles: function (tile) {
       this.currentTileName = tile.name;
       this.$emit("updatedTile", tile.url);
     },
     toggleFiltersBox: function () {
       this.filtersBox = ! this.filtersBox;
     }
   }
 }
</script>

<style>
 .filters-shadow {
   box-shadow: 0 3px 10px rgba(106, 104, 104, 0.623);
 }

 .arrow-container {
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

 /* The container */
 .container {
   cursor: pointer;
   font-size: 22px;
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   width: 15px;
   height: 15px;
   border-radius: 50%;
   background-color: #b5b5b5;
 }

 /* Hide the browser's default radio button */
 .container input {
   position: absolute;
   opacity: 0;
   cursor: pointer;
 }

 /* Create a custom radio button */
 .checkmark {
   width: 4px;
   height: 4px;
   border-radius: 50%;
   background: white;
 }

 /* On mouse-over, add a grey background color */
 .container:hover {
   background-color: #eeb518e1;
 }

 .v-enter-active {
   animation: slide-in 0.4s ease-out;
 }

 .v-leave-active {
   animation: slide-in 0.4s reverse ease-out;
 }

 @keyframes slide-in {
   0% {
     transform: translateX(-100%);
   }
   100% {
     transform: translateX(0%);
   }
 }

</style>
