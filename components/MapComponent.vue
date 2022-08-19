<template>
  <div class="flex flex-col h-full w-full">
    <!-- Page intro -->
    <!--
          <div class="flex content-start items-center bg-slate-50
                pl-5 pr-5 pt-3 pb-5 w-full">
      <h1 class="text-sm md:text-xl lg:text-2xl">
        Place of {{plottingTitle}} for Accused Witches
        <template>
          (total named accused witches: {{ numberOfWitches }})
        </template>
      </h1>
      <span class="rounded-full border-r border-l border-gray-400
                   w-6 h-6 flex items-center justify-center ml-2">
        <icon by feathericons.com>
        <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B"
             stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
             xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="8"></line>
        </svg>
      </span>
    </div>
    -->
    <!-- Map and filters. -->
    <div class="relative h-full w-full">
      <div class="absolute flex flex-col w-full h-full">
        <map-filters :startingMarkers="originalMarkers"
                     :startingFilters="filterProperties"
                     :includeTimeline="includeTimeline"
                     :timelineOn="timelineOn"
                     :dateRange="timelineRange"
                     :noWitches="Filtering.getNoWitches()"
                     @filterOff="setWitchesOff($event[0], $event[1])"
                     @filterOn="setWitchesOn($event[0], $event[1])"
                     @changeCurrentProperty="changeCurrentProperty($event)"
                     @updatedTile="url = $event"
                     @selectedDateRange="setTimeline($event)"
                     @turnTimelineOff="setTimelineOff()"
                     @resetDates="resetDates()">
        </map-filters>
        <timeline v-if="timelineOn"
                  :startRange="timelineRange"
                  :timelineDates="timelineDates"
                  :timelineMarkers="timelineMarkers"
                  @updatedRangeValue="filterOnSlider(convertToDateObj($event))">
        </timeline>
      </div>
      <leaflet-map-main :mapUrl="url" 
                        :mapMarkers="Filtering.getOutputMarkers(markers)" 
                        :clustersInitial="clustersOn">
      </leaflet-map-main>
    </div>
  </div>
</template>

<script>
 import LeafletMapMain from './leaflet-maps/LeafletMapMain.vue';
 import MapFilters from './filter-components/MapFilters.vue';
 import FilteringMethods from '../assets/js/FilteringMethods';  
 import TimelineMethods from '../assets/js/TimelineMethods';
 import Timeline from './filter-components/Timeline.vue';

 export default {
   components: { LeafletMapMain, MapFilters, Timeline },
   props: {
     plottingTitle: {
       type: String,
       required: true
     },
     originalMarkers: {
      type: Array,
      required: true
     },
     filterProperties: {
      type: Object,
      required: true
     },
     clustersOnInitial: {
      type: Boolean,
      default: true
     },
     includeTimeline: {
      type: Boolean,
      default: true
     }
   },
   data() {
     return {
       url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
       sliderYear: [1550, 1750],
       sliderYears: [1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750],
       wikiPages: [],
       markers: JSON.parse(JSON.stringify(this.originalMarkers)),
       currentTileName: 'Modern Map',
       Filtering: new FilteringMethods(this.filterProperties, "sex"),
       timelineOn: false,
       timelineRange: null,
       timelineDates: null,
       timelineMarkers: null,
       clustersOn: this.clustersOnInitial
     }
   },
   methods: {
     showPageInfo: function () {
       this.$swal({
         title: 'Places of Residence for Accused Witches (total named accused witches: 3141)',
         html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3141</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',

         footer: 'witches.is.ed.ac.uk',
         confirmButtonText: 'Close',
         type: 'info',
         showCloseButton: true,
       });
     },
     convertToDateObj: function (dateRange) {
      return [new Date(dateRange[0]), new Date(dateRange[1])]
     },
     setWitchesOff: function (filterProperty, filterType) {
       // Filters <filterProperty>.<filterType> off. It goes through the current markers
       // setting witches that meet filter type to off and adds the
       // filter property to the witch's active filters.
       // It then updates the marker state by calling getMarkerState.

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         for (let w = 0; w < marker.witches.length; w++) {
           let witch = marker.witches[w];

           if (witch[filterProperty] === filterType) {
             witch.witchState.on = false;
             witch.witchState.activeFilters.push(filterProperty);
           }
         }
         [marker.markerIcon, marker.active] = this.Filtering.getMarkerState(marker);
       }
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
             [
              witch.witchState.activeFilters, 
              witch.witchState.on
              ] = this.Filtering.checkWitchOn(
                witch.witchState.activeFilters, 
                filterProperty
              )
           }
         }
         [marker.markerIcon, marker.active] = this.Filtering.getMarkerState(marker);
       }
     },
     checkDateInRange: function (date, dateRange) {
       return date >= dateRange[0] && date <= dateRange[1]
     },
     filterByDateRange: function (dateRange) {
       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         for (let w = 0; w < marker.witches.length; w++) {
           let witch = marker.witches[w];
           let date = new Date (witch.investigationDates[0]);

           if (!TimelineMethods.checkDateInRange(date, dateRange)) {
             witch.witchState.on = false;

             if (!witch.witchState.activeFilters.includes('timeline')) {
               witch.witchState.activeFilters.push('timeline');
             }
           } else {
             [
               witch.witchState.activeFilters,
               witch.witchState.on
             ] = this.Filtering.checkWitchOn(
               witch.witchState.activeFilters,
               "timeline"
             )
           }
         }
         [marker.markerIcon, marker.active] = this.Filtering.getMarkerState(marker);
       }
     },
     filterOnSlider: function (dateRange) {
       this.timelineRange = dateRange;
       this.filterByDateRange(dateRange);
     },
     setTimeline: function (dateRange) {
       this.timelineRange = dateRange;
       this.filterByDateRange(dateRange);
       [
        this.timelineDates, 
        this.timelineMarkers
        ] = TimelineMethods.getTimelineData(dateRange);
        this.timelineOn = true;
     }, 
     setTimelineOff: function () {
       this.timelineOn = false;
     },
     resetDates: function () {
       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         for (let w = 0; w < marker.witches.length; w++) {
           let witch = marker.witches[w];

           if (witch.witchState.activeFilters.includes("timeline")) {
             [
               witch.witchState.activeFilters,
               witch.witchState.on
             ] = this.Filtering.checkWitchOn(
               witch.witchState.activeFilters,
               "timeline"
             )
           }
         }
         [marker.markerIcon, marker.active] = this.Filtering.getMarkerState(marker);
       }
       this.timelineRange = null;
     },
     setAllIcons: function () {
       // Goes through all markers changing the icons according
       // to the current filter property. Called in togglefilterProperties
       // when user changes filter properties so that icons update
       // accordingly.

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];
         [marker.markerIcon, marker.active] = this.Filtering.getMarkerState(marker);
       }
     },
     changeCurrentProperty: function (property) {
       this.Filtering.updateCurrentProperty(property);
       this.setAllIcons();
     }
   },
  mounted: function() {
    let noWitches = 0;
    let dates = []

    this.markers.map(marker => {
      noWitches += marker.witches.length;
      if (this.includeTimeline) {
        dates.push()
      }
    })
    
    this.Filtering.setNoWitches(noWitches);
  }

 }
</script>

<style>
.timelineHeight{
  height: 90%;
}
</style>
