<template>
  <div class="flex flex-col h-full w-full">
    <!-- Map and filters. -->
    <div class="relative h-full w-full">
      <div class="absolute flex flex-col w-full h-full">
        <map-filters :pageInfo="pageInfo"
                     :startingFiltersGeneralInfo="filtersGeneralInfo"
                     :startingFilters="filterProperties"
                     :iconBehaviour="iconBehaviour"
                     :includeTimeline="includeTimeline"
                     :timelineOn="timelineOn"
                     :dateRange="timelineOutputRange"
                     :noWitches="Filtering.getNoWitches()"
                     @filterOff="setWitchesOff($event[0], $event[1])"
                     @filterOn="setWitchesOn($event[0], $event[1])"
                     @changeCurrentProperty="changeCurrentProperty($event)"
                     @updatedTile="url = $event"
                     @selectedDateRange="setTimeline($event[0], $event[1])"
                     @turnTimelineOff="setTimelineOff()"
                     @resetDates="resetDates()">
        </map-filters>
        <timeline v-if="timelineOn"
                  :key="timelineKey"
                  :startRange="timelineRangeStart"
                  :timelineDates="timelineDates"
                  :timelineMarkers="timelineMarkers"
                  @updatedRangeValue="filterOnSlider(formatDateForFiltering($event))">
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
 import Timeline from './filter-components/Timeline.vue';
 import MapFilters from './filter-components/MapFilters.vue';
 import FilteringMethods from '../assets/js/FilteringMethods';  
 import TimelineMethods from '../assets/js/TimelineMethods';

 export default {
   components: { LeafletMapMain, MapFilters, Timeline },
   props: {
     pageInfo: {
      type: Object,
      required: true
     },
     originalMarkers: {
      type: Array,
      required: true
     },
     filtersGeneralInfo: {
      type: Object,
      required: true
     },
     filterProperties: {
      type: Object,
      required: true
     },
     iconBehaviour: {
      type: String,
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
       fullRange: [
         new Date("1562-02-21T00:00:00.000Z"),
         new Date("1727-06-12T00:00:00.000Z")
       ],
       timelineOn: false,
       timelineOutputRange: null,
       timelineRangeStart: null,
       timelineDates: null,
       timelineMarkers: null,
       timelineKey: 0,
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
     formatDateForFiltering: function (dateRange) {
      return [
        TimelineMethods.addDays(new Date(dateRange[0]), 1),
        TimelineMethods.addDays(new Date(dateRange[1]), 1)
      ]
     },
     getMarkerState: function (marker) {
       if (this.iconBehaviour !== "constant") {
         [
           marker.markerIcon,
           marker.active
         ] = this.Filtering.getMarkerStateIconDependant(marker);
       } else {
           marker.active = this.Filtering.getMarkerStateNonIconDependant(marker.witches);
       }
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
           
           // Calling checksMeetsCondition, which will check 
           // if what we are filtering by is an array, in which 
           // case checks with .includes() or a string and then checks
           // with ===
           if (this.Filtering.checkMeetsCondition(witch[filterProperty], filterType)) {
             witch.witchState.on = false;
             witch.witchState.activeFilters.push(filterProperty);
           }
         }
         this.getMarkerState(marker);
       }
     },
     setWitchesOn: function (filterProperty, filterType) {
       // Filters <filterType> on. It goes through the current markers
       // setting witches that meet filter type to on and updating the witches
       // active filters. It updates the marker state by calling getMarkerState.

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];

         for (let w = 0; w < marker.witches.length; w++) {
           let witch = marker.witches[w];

           if (this.Filtering.checkMeetsCondition(witch[filterProperty], filterType)) {
             [
              witch.witchState.activeFilters, 
              witch.witchState.on
              ] = this.Filtering.checkWitchOn(
                witch.witchState.activeFilters, 
                filterProperty
              )
           }
         }
         this.getMarkerState(marker);
       }
     },
     checkDateInRange: function (date, dateRange) {
       return date >= dateRange[0] && date <= dateRange[1]
     },
     filterByDateRange: function (dateRange) {
      // Filters off the witches whose date doesn't
      // fall whithin <dateRange>
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
         this.getMarkerState(marker);
       }
     },
     filterOnSlider: function (dateRange) {
      // Function called on slider filtering event. Date 
      // range is an array with the date objects recieved
      // from slider. <timelineOutputRange> is used to filterd and
      // passed down to MapFilters to display the dates by 
      // which the user is filtering.
       this.timelineOutputRange = dateRange;
       this.filterByDateRange(dateRange);
     },
     resetTimelineWithNewRange: function (dateRange) {
       // Creates the dates and markers for a new dateRange
       // and re-renders the timeline to apply them.
       [
         this.timelineDates,
         this.timelineMarkers
       ] = TimelineMethods.getTimelineData(dateRange);

       // Remoiunting the timeline if it was already on.
       this.timelineKey = !this.timelineKey;

     },
     setTimeline: function (dateRange, startRange) {
      // Sets the timeline on the event of a range having 
      // been selected by range selector. We re-render the 
      // timeline every time - not very costly.
       this.timelineOutputRange = startRange;
       this.timelineRangeStart = startRange;
       this.filterByDateRange(startRange);

       if (this.clustersOn) {
         this.clustersOn = !this.clustersOn;
       }
       // setting the dates and markes for the timeline.
       this.resetTimelineWithNewRange(dateRange);

        // Turning on if it wasn't on.
      if (!this.timelineOn) {
         this.timelineOn = true;
      }
     },
     resetDatesFully: function () {
       // Turns on every witch that has <timeline> in its 
       // active filters.
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
         this.getMarkerState(marker);
       }
       this.timelineRange = null;
     },
     setTimelineOff: function () {
       this.timelineOn = false;
       if (!this.clustersOn) {
         this.clustersOn = !this.clustersOn;
       }
       this.resetDatesFully();
     },
     resetDates: function () {
       this.timelineOutputRange = this.fullRange;
       this.timelineRangeStart = this.fullRange;
       this.filterByDateRange(this.fullRange);
       this.resetTimelineWithNewRange(this.fullRange);
     }, 
     setAllIcons: function () {
       // Goes through all markers changing the icons according
       // to the current filter property. Called in togglefilterProperties
       // when user changes filter properties so that icons update
       // accordingly.

       for (let i = 0; i < this.markers.length; i++) {
         let marker = this.markers[i];
         [
          marker.markerIcon, 
          marker.active
         ] = this.Filtering.getMarkerStateIconDependant(marker);
       }
     },
     changeCurrentProperty: function (property) {
       this.Filtering.updateCurrentProperty(property);
       this.setAllIcons();
     }
   },
  mounted: function() {
    let noWitches = 0;

    this.markers.map(marker => {
      noWitches += marker.witches.length;
    })
    
    this.Filtering.setNoWitches(noWitches);
  }

 }
</script>

<style>

</style>
