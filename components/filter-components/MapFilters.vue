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

          <!-- Title and info button -->
          <div class="flex text-center mt-2">
            <h1 class="text-xl md:text-2xl lg:text-3xl mx-0 px-0">
              Place of Residence for Accused Witches
              <div class="inline-flex items-center justify-center
                          align-middle rounded-full border-r-2  
                          border-l-2 border-gray-400
                          w-6 h-6 hover:w-7 hover:h-7 mb-0.5">
                <img src="images/infoIcon.svg"
                    class="w-full h-full pt-0.5" />
              </div>
            </h1>
          </div>

          <!-- Map tiles -->
          <div class="w-full flex justify-between px-2 sm:px-3
                      md:px-5 lg:px-10 mt-5 mb-4">
            <div v-for="tile in tiles">
              <input type="radio" name="tile" 
                     :checked="tile.name === currentTileName" 
                     @change="filterTiles(tile)" />
              {{ tile.name }}
            </div>
          </div>

          <h1 class="ml-3 font-medium">Accused witch filters</h1>

          <!-- Filter dropdowns -->
          <div v-for="(propertyItem, property) in filterProperties" 
               class="w-full flex flex-col ml-5">
            <!-- Property titles -->
            <div class="flex pl-2 py-1 flex-wrap items-center mt-2
                        cursor-pointer" style="width: 225px;" 
                 @click="togglePropertyShowing(property)">
              <div class="title-point"></div>
              <p style="font-weight: 500;"> {{ propertyItem.label }} </p>
              <img src="images/arrow-down.svg" v-if="!propertyItem.showing" 
                   class="w-6 h-6" />
              <img src="images/arrow-up.svg" v-if="propertyItem.showing" 
                   class="w-6 h-6" />
            </div>

            <!-- Filters list if property is showing. -->
            <div v-if="propertyItem.showing" class="w-full">

              <!-- If it is the current property, show list with icons. -->
              <div v-if="property === currentProperty" 
                   class="w-full flex flex-wrap mt-2">
                <div v-for="(filterItem, filterType) in propertyItem.filters"
                     class="flex flex-col items-center mx-3 mb-2" 
                     style="width: 50px">

                  <div class="flex justify-center items-center">
                    <input :checked="filterProperties[property].filters[filterType].active"
                           @change="filterEmit(property, filterType)" 
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
                             @change="filterEmit(property, filterType)" 
                             type="checkbox" />
                      <p class="text-xs text-center ml-1">
                        {{ filterItem.label }}
                      </p>

                    </div>
                  </div>
                </div>
                <!-- Change icons button. -->
                <div class="flex flex-col w-4/5 ml-1 items-end mt-1">
                  <div class="self-end flex justify-start items-center
                              mb-1 mr-1">
                    <p class="text-xs">
                      Show {{ propertyItem.label }} Icons
                    </p>
                    <label class="container flex items-center
                                  justify-center ml-1">
                      <input type="radio" :checked="false" 
                             name="radio" @change="setPropertyToCurrent(property)">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div class="w-full bg-slate-600" style="height:1.2px;"></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Timeline section -->
          <div class="w-full mt-4 ml-3" v-if="includeTimeline">
            <h1 class="font-medium">Timeline</h1>

            <!-- Timeline on off -->
            <div class="ml-4 flex items-center mt-2">
              <div class="title-point"></div>
              <p class="mr-2" style="font-weight: 500;">
                Filter with timeline:
              </p>
              <label class="switch relative pr-2">
                <input type="checkbox" :checked="false" @change="toggleTimelineOn()">
                <span class="slider round"></span>
              </label>
            </div>

            <div v-if="timelineOn" class="ml-7 mt-2 flex flex-col">
              <p class="text-sm ml-3">Choose date range: </p>
              <date-picker class="ml-5 mt-2" 
                           v-model="time1" valueType="format">
              </date-picker>
            </div>
          </div>

          <div class="self-end flex flex-col mt-8 mr-3 h-full
                      justify-end mb-4">
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
            <img class="max-w-full max-h-full" 
                 src="images/chevrons-left.svg" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Right chevron to show filters. -->
    <div class="w-8 flex flex-col justify-center ml-1 h-full" v-if="!filtersBox">
      <div class="flex items-center justify-center w-8 h-8
                  rounded-full bg-slate-200 filters-shadow" 
           @click="toggleFiltersBox()">
        <img class="max-w-full max-h-full" 
             src="images/chevrons-right.svg" />
      </div>
    </div>

  </div>
</template>

<script>
 import DatePicker from 'vue2-datepicker';
 import 'vue2-datepicker/index.css';

 export default {
   components: { DatePicker },
   props: {
     startingMarkers: {
       type: Array,
       required: true
     },
     startingFilters: {
       type: Object,
       required: true
     },
     includeTimeline: {
       type: Boolean,
       default: false
     }
   },
   data() {
     return {
       timelineOn: false,
       time1: null,
       filtersBox: true,
       currentTileName: "Modern Map",
       filterProperties: JSON.parse(JSON.stringify(this.startingFilters)),
       tiles: [{ name: "Modern Map", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", active: true }, { name: "Historic Map", url: "https://api.maptiler.com/tiles/uk-osgb1919/{z}/{x}/{y}.jpg?key=cKVGc9eOyhb8VH5AxCtw", active: false }],
       currentProperty: "sex", // Determines the property the icons of which are showing.
     };
   },
   methods: {
     setFilterInactive: function (property, filterType) {
       this.filterProperties[property].filters[filterType].active = false;
     },
     setFilterActive: function (property, filterType) {
       this.filterProperties[property].filters[filterType].active = true;
     },
     filterEmit: function (property, filterType) {
       let isActive = this.filterProperties[property].filters[filterType].active;
       var today = new Date();
       console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds());
       if (isActive) {
         this.setFilterInactive(property, filterType);
         this.$emit("filterOff", [property, filterType]);
       }
       else {
         this.setFilterActive(property, filterType);
         this.$emit("filterOn", [property, filterType]);
       }
     },
     setPropertyToCurrent: function (property) {
       // Sets <property> as the current property, and
       // calls setAllIcons to change the icons accordingly.
       this.currentProperty = property;
       this.$emit("changeCurrentProperty", property);
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
       }
       else {
         this.filterProperties[property].showing = false;
       }
     },
     filterTiles: function (tile) {
       this.currentTileName = tile.name;
       this.$emit("updatedTile", tile.url);
     },
     toggleFiltersBox: function () {
       this.filtersBox = !this.filtersBox;
     },
     toggleTimelineOn: function () {
       this.timelineOn = !this.timelineOn;
     }
   }
 }
</script>

<style>
.title-point {
  content: "\A";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #000;
  margin-right: 5px;
  display: inline-block;
}

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
