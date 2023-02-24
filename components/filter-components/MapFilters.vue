<template>
  <div class="xs:w-11/12 sm:w-1/2 lg:w-2/5 
              xl:w-1/3 z-20 left-0"
       :style= "[timelineOn ? {'height': '89%'} : {'height': '100%'}]">
    <transition>
      <div class="w-full h-full flex" v-if="filtersBox">

        <!-- Filters box -->
        <div class="h-full flex flex-col bg-white
                    rounded-tr-xl rounded-br-xl filters-shadow
                    overflow-y-visible overflow-x-hidden
                    relative" 
             style="width:90%">

          <!-- Header -->
          <div class="flex w-full flex-col"
               ref="FiltersHeader">
            <div class="flex flex-col w-full h-full"
                 style="backdrop-filter: blur(1.5px);">
              
              <!-- Title and info-->
              <div class="flex text-center mt-1">
                <h1 class="text-3xl mx-0 px-2">
                  {{pageInfo.title}}
                  <div class="inline-flex items-center justify-center
                              align-middle rounded-full border-r-2  
                              border-l-2 border-gray-400
                              w-6 h-6 hover:w-7 hover:h-7 mb-0.5">
                    <img src="/images/infoIcon.svg"
                        class="w-full h-full pt-0.5"
                        @click="showPageInfo()"/>
                  </div>
                </h1>
              </div>
              
              <!-- Display number of active witches. -->
              <div class="ml-3 flex mt-3 items-center pb-2"">
                <p class="mr-2 text-lg witchy-text">
                  Showing
                </p>
                <div class="h-6 px-1 flex items-center justify-center
                            mr-2 border-2 rounded-md text-white 
                            font-medium bg-slate-500 border-slate-700">
                  <p>
                    {{noWitches}}
                  </p>
                </div>
                <p class="mr-1 text-lg witchy-text">
                  Accused Witches
                </p>
              </div>
            </div>
            <div class="w-full border mt-1"></div>
          </div>

          <!-- Timeline section -->
          <div class="ml-3 flex flex-col mt-4">

            <div v-if="includeTimeline"
                class="flex items-center">
              <h1 class="font-medium mr-3 py-0 text-2xl">
                Timeline
              </h1>
              <label class="switch relative pr-2 mt-1">
                <input type="checkbox" :checked="true"
                      @change="toggleTimelineSelector()">
                <span class="slider round"></span>
              </label>
            </div>

            <timeline-range-selector v-if="timelineSelectorOn"
                                     :key="timelineSelectorKey"
                                     @selectedDateRange="emitDateRange($event)"
                                     @deactivatedTimeline="deactivateTimeline()"
                                     @scrollHeaderIntoView="scrollHeaderIntoView()">
            </timeline-range-selector>
            
            <div v-if="dateRange !== null && timelineSelectorOn"
                class="flex flex-col ml-4 mt-4">

              <div class="border" style="width:300px;"></div>
              <p class="text-lg witchy-text mt-2 ml-1">
                Showing accused witches between:
              </p>
              <div class="flex items-center mt-3 justify-center">
                <div class="h-6 px-1 flex items-center justify-center
                            mr-2 border-2 rounded-md text-white 
                            font-medium bg-slate-500 border-slate-700">
                  <p class="text-sm">
                    {{dateRangeFormatted[0]}}
                  </p>
                </div>
                <p class="mr-2 text-lg witchy-text">
                  and
                </p>
                <div class="h-6 px-1 flex items-center justify-center
                            mr-2 border-2 rounded-md text-white 
                            font-medium bg-slate-500 border-slate-700">
                  <p class="text-sm">
                    {{dateRangeFormatted[1]}}
                  </p>
                </div>
              </div>
            </div>
            
            <button class="rounded-lg w-24 text-white ml-4
                           bg-sky-600 py-1 hover:border-2
                           text-sm"
                    :style= "[timelineOn ? {'margin-top': '20px'} 
                                         : {'margin-top': '10px'}]"
                    @click="emitDateReset()"
                    v-if="dateRange != null && timelineOn">
              Reset Dates
            </button>
          </div>

          <!-- Title for "witch filters" -->
          <div class="flex ml-3 flex-wrap items-center mt-2
                      cursor-pointer"
               :style= "[includeTimeline ? {'margin-top': '17px'} 
                                         : {'margin-top': '3px'}]" 
               @click="toggleFiltersShowing(property)">
            <h1 class="font-medium text-2xl">
              {{filtersGeneralInfo.title}}
            </h1>
            <img src="/images/arrow-down.svg" v-if="!filtersGeneralInfo.filtersShowing"
                  class="w-7 h-7 mt-1" />
            <img src="/images/arrow-up.svg" v-if="filtersGeneralInfo.filtersShowing"
                  class="w-7 h-7 mt-1" />
          </div>

          <!-- Filter dropdowns -->
          <div v-if="filtersGeneralInfo.filtersShowing"
               class="w-full">

            <!-- Note that <propertyItem> denotes the object and 
              property the key. -->
            <div v-for="(propertyItem, property) in filterProperties" 
                class="w-full flex flex-col ml-4">

              <!-- Property titles -->
              <div class="flex pl-2 py-1 flex-wrap items-center mt-2
                          cursor-pointer" style="width: 225px;" 
                  @click="togglePropertyShowing(property)">
                <div class="title-point"></div>
                <p style="font-weight: 500;"> {{ propertyItem.label }} </p>
                <img src="/images/arrow-down.svg" v-if="!propertyItem.showing"
                    class="w-6 h-6" />
                <img src="/images/arrow-up.svg" v-if="propertyItem.showing"
                    class="w-6 h-6" />
              </div>

              <!-- Filters list if property is showing. -->
              <div v-if="propertyItem.showing" class="w-full">
                <icon-dependent-filters-list 
                  v-if="!iconsConstant"
                  :currentProperty="currentProperty"
                  :property="property"
                  :filterTypes="propertyItem.filters"
                  :propertyLabel="propertyItem.label"
                  @filterOff="emitFilterOff($event)"
                  @filterOn="emitFilterOn($event)"
                  @setPropertyToCurrent="setPropertyToCurrent($event)">
                </icon-dependent-filters-list>
                
                <normal-filters-list
                  v-else :property="property"
                  :filterTypes="propertyItem.filters"
                  @filterOff="emitFilterOff($event)"
                  @filterOn="emitFilterOn($event)">
                </normal-filters-list>
              </div>

            </div>
          </div>
          
          <div class="self-end flex flex-col mt-3 mr-3 h-full
                      justify-end"
               v-if="!iconsConstant">
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
          
          <div class="flex flex-col justify-end"
               :style= "[iconsConstant ? {'margin-top': '15px', 'height': '100%'} 
                                       : {'margin-top': '0px', 'height' : 'auto'}]">
            <div class="w-full border mt-3 mb-3"></div>

            <!-- Map tiles -->
            <div class="w-full flex justify-between px-2 sm:px-3
                        md:px-5 lg:px-10 mb-3">
              <div v-for="tile in tiles">
                <input type="radio" name="tile" 
                      :checked="tile.name === currentTileName" 
                      @change="filterTiles(tile)" />
                {{ tile.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Left chevron to hide filters. -->
        <div class="w-8 flex flex-col justify-center ml-1">
          <div class="flex items-center justify-center w-8 h-8
                      rounded-full bg-slate-200 filters-shadow" 
               @click="toggleFiltersBox()">
            <img class="max-w-full max-h-full" 
                 src="/images/chevrons-left.svg" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Right chevron to show filters. -->
    <div class="w-8 flex flex-col justify-center ml-1 h-full" 
         v-if="!filtersBox">
      <div class="flex items-center justify-center w-8 h-8
                  rounded-full bg-slate-200 filters-shadow" 
           @click="toggleFiltersBox()">
        <img class="max-w-full max-h-full" 
             src="/images/chevrons-right.svg" />
      </div>
      <span class="pt-1 text-gray-700">Filters</span>
    </div>

  </div>
</template>

<script>
 import TimelineRangeSelector from './TimelineRangeSelector.vue';
 import IconDependentFiltersList from './IconDependentFiltersList.vue';
 import NormalFiltersList from './NormalFiltersList.vue';
 import TimelineMethods from '../../assets/js/TimelineMethods';

 export default {
   components: { TimelineRangeSelector, IconDependentFiltersList, NormalFiltersList },
   props: {
     pageInfo: {
       type: Object,
       required: true
     },
     startingFiltersGeneralInfo: {
       type: Object,
       required: true
     },
     startingFilters: {
       type: Object,
       required: true
     },
     iconBehaviour: {
       type: String,
       required: true
     },
     includeTimeline: {
       type: Boolean,
       default: false
     },
     timelineOn: {
      // Recieves from parent when timeline has been
      // activated by selecting a dateRange.
      type: Boolean,
      required: true
     },
     dateRange: {
      required: false
     },
     noWitches: {
      type: Number,
      required: true
     }
   },
   data() {
     return {
       timelineSelectorOn: false, // Set to true on mounted if includeTimeline.
       timelineSelectorKey: 0,
       filtersBox: false,
       currentTileName: "Modern Map",
       filtersGeneralInfo: JSON.parse(JSON.stringify(this.startingFiltersGeneralInfo)),
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

       if (isActive) {
         this.setFilterInactive(property, filterType);
         this.$emit("filterOff", [property, filterType]);
       }
       else {
         this.setFilterActive(property, filterType);
         this.$emit("filterOn", [property, filterType]);
       }
     },
     emitFilterOff: function (filterInfo) {
       this.$emit("filterOff", filterInfo);
     },
     emitFilterOn: function (filterInfo) {
       this.$emit("filterOn", filterInfo);
     },
     setPropertyToCurrent: function (property) {
       // Sets <property> as the current property, and
       // calls setAllIcons to change the icons accordingly.
       this.currentProperty = property;

       if (this.iconBehaviour !== "constant") {
         this.$emit("changeCurrentProperty", property);
       }
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
     toggleFiltersShowing: function () {
       this.filtersGeneralInfo.filtersShowing = !this.filtersGeneralInfo.filtersShowing;
     },
     toggleFiltersBox: function () {
       this.filtersBox = !this.filtersBox;
     },
     toggleTimelineSelector: function () {
       this.timelineSelectorOn = !this.timelineSelectorOn;

       if (!this.timelineSelectorOn) {
         this.$emit("turnTimelineOff");
       }
     },
     emitDateReset: function () {
       // Re-redner timeline selector with its default values.
       this.timelineSelectorKey =! this.timelineSelectorKey;
       this.$emit("resetDates");
     },
     emitDateRange: function (dateRange) {
       this.$emit("selectedDateRange", dateRange);
     },
     deactivateTimeline: function () {
       this.$emit("deactivatedTimeline");
     },
     showPageInfo: function () {
       this.$swal(this.pageInfo);
     },
     scrollHeaderIntoView() {
       const el = this.$refs.FiltersHeader;

       if (el) {
         el.scrollIntoView({ behavior: 'smooth' });
       }
     }
   },
   computed: {
    dateRangeFormatted () {
      if (this.dateRange !== null) {
        return [
          TimelineMethods.formatDate(this.dateRange[0]),
          TimelineMethods.formatDate(this.dateRange[1])
        ]
      } 
    },
    iconsConstant () {
      return this.iconBehaviour === "constant"
    }
   },
   mounted: function () {
    if (this.includeTimeline) {
      this.timelineSelectorOn = true;
    }
   }
 }
</script>

<style>
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
