<template>
  <div v-if="timelineShowing">
    <div class="bg-slate-200 z-30 py-5 px-12 filters-shadow
                rounded-tr-xl rounded-br-xl relative"
          style="min-height: 10%; max-height: 17%; width: 95%; position: absolute; bottom: 0%;">
      <!-- Add the cross (close) button -->
      <div class="absolute top-2 right-2 cursor-pointer text-gray-500" @click="toggleTimelineShowing">
        <svg class="w-5 h-5 transition-transform transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
        <Slider name="slider"
        v-model="numberRangeValue"
        :min="0"
        :max="max"
        :format="getDateLabel" 
        :merge="5"
        @change="handleCustomInputRangeChange"
        :lazy="false"/>
    </div>  
  </div>
</template>

<script>
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

export default {
  components: { Slider },
  props: {
    startRange: {
      required: true,
      type: Array
    },
    timelineDates: {
      required: true,
      type: Array
    },
    timelineMarkers: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      dates: this.timelineDates,
      markers: this.timelineMarkers,
      timelineShowing: true,
      numberRangeValue: [0, 0] // Initialize with dummy values
    }
  },
  mounted() {
    // Set initial range after `max` is computed
    this.numberRangeValue = [0, this.max];
  },
  watch: {
    numberRangeValue(newRange) {
      // Convert the slider range values to Date objects
      const dateRange = [
        this.parseDate(this.dates[newRange[0]].label),
        this.parseDate(this.dates[newRange[1]].label)
      ];
      this.$emit("updatedRangeValue", dateRange);
    }
  },
  computed: {
    max() {
      return this.dates.length - 1;
    }
  },
  methods: {
    emitRange(rangeValue) {
      this.$emit("updatedRangeValue", rangeValue);
    },
    toggleTimelineShowing() {
      this.timelineShowing = !this.timelineShowing;
      this.$emit('timelineToggled', this.timelineShowing);
    },
    getDateLabel(value) {
      return this.dates[value].label;
    },
    handleCustomInputRangeChange(newCustomInputRange) {
      this.numberRangeValue = newCustomInputRange;
    },
    parseDate(dateStr) {
      // Convert DD/MM/YYYY to Date object
      const [day, month, year] = dateStr.split('/').map(Number);
      //  JavaScript Date months are 0-indexed, so subtract 1 from month and day
      return new Date(year, month - 1, day -1);
    }
  }
}
</script>

<style>
:root {
  --slider-connect-bg: #0284C7;
  --slider-tooltip-bg: #0284C7;
  --slider-handle-ring-color: #3B82F630;
}
</style>
