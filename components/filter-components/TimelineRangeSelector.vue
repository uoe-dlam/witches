<template>
  <div class="w-full mt-4 ml-3">
    <h1 class="font-medium">Timeline</h1>

    <!-- Timeline on off -->
    <div class="ml-3 flex items-center mt-2">
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
      <date-picker class="ml-5 mt-2" v-model="timeRange" 
                   valueType="format">
      </date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  components: { DatePicker },
  data() {
    return {
      timelineOn: false,
      timeRange: null
    }
  },
  methods: {
    toggleTimelineOn: function () {
      this.timelineOn = !this.timelineOn;
    }
  }
}
</script>

<style>

</style>