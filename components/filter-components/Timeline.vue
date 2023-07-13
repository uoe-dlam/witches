<template>
  <!--<div class="h-40 bg-slate-300 flex items-center
             justify-center z-20"
       style="width: 80%;">-->

  <div class="bg-slate-200 z-30 py-5 px-12 filters-shadow
              rounded-tr-xl rounded-br-xl"
       style="min-height: 10%; max-height: 17%; width: 95%; position: absolute; bottom: 0%;">
    <vue-slider class=""
                v-model="rangeValue"
                :data="dates"
                :data-value="'date'"
                :data-label="'label'"
                :marks="markers">
    </vue-slider>
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
      markers: this.timelineMarkers
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
    }
  }
};
</script>

<style>

</style>