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
      <vue-slider class=""
                  v-model="rangeValue"
                  :data="dates"
                  :data-value="'date'"
                  :data-label="'label'"
                  :marks="markers">
      </vue-slider>
    </div>  
  </div>
</template>
<script>
//import VueSlider from 'vue-slider-component'
//import 'vue-slider-component/theme/default.css'

export default {
  //components: { VueSlider },
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
      rangeValue: [this.startRange[0].toString(), this.startRange[1].toString()],
      dates: this.timelineDates,
      markers: this.timelineMarkers,
      timelineShowing: true
    }
  },
  watch: {
    rangeValue(newRange, oldQuestion) {
      this.$emit("updatedRangeValue", newRange);
    }
  },
  methods: {
    emitRange: function (rangeValue) {
      this.$emit("updatedRangeValue", rangeValue);
    },
    toggleTimelineShowing() {
      this.timelineShowing = !this.timelineShowing;
      this.$emit('timelineToggled', this.timelineShowing);
  }
}
}
</script>

<style>

</style>