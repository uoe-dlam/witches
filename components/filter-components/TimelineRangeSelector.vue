<template>
  <div class="w-full mt-4 ml-3"
       style="height: 174px;">
    <div class="flex items-center">
      <h1 class="font-medium mr-3 py-0">Timeline</h1>
      <label class="switch relative pr-2 mt-1">
        <input type="checkbox" :checked="false"
               @change="toggleTimelineOn()">
        <span class="slider round"></span>
      </label>
    </div>

    <!-- Timeline on off 
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
    --> 

    <div class="ml-4 mt-2 flex flex-col pb-6"
         v-if="timelineOn">

      <div class="flex items-center">
        <div class="title-point"></div>
        <p>Choose date range: </p>
      </div>
      <date-picker class="ml-5 mt-2 w-1/2" 
                   v-model="inputRange" 
                   range placeholder="Select date range"
                   valueType="date"
                   format="DD-MM-YYYY"
                   :default-value="dateRange"
                   :disabled-date="getDateRange"
                   :lang="lang">
      </date-picker>

      <div class="flex">
        <button class="rounded-lg w-16 text-white
                      bg-sky-600 py-1 mt-4 hover:border-2"
                @click="emitDateRange()">
          Apply
        </button>
        <button class="rounded-lg w-28 text-white ml-3
                      bg-sky-600 py-1 mt-4 hover:border-2"
                v-if="inputRange !== null"
                @click="emitReset()">
          Reset dates
        </button>
      </div>
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
      inputRange: null,
      dateRange: this.$store.getters['timelineData/getDateRange'],
      minDate: null,
      maxDate: null,
      lang: {
        formatLocale: {
          firstDayOfWeek: true,
        },
        monthBeforeYear: true,
      }
    }
  },
  methods: {
    getDateRange: function (date) {
      return date < this.dateRange[0] || date > this.dateRange[1]
    },
    getDefaultDate: function () {
      let diff = Math.abs((this.minDate - this.maxDate)/2)

      return new Date(this.minDate.getTime() + diff)
    },
    toggleTimelineOn: function () {
      this.timelineOn = !this.timelineOn;
    },
    emitDateRange: function () {
      if (this.inputRange) {
        this.$emit("selectedDateRange", this.inputRange)
      }
    },
    emitReset: function () {
      this.inputRange = this.dateRange;
      this.$emit("resetDateRange", this.dateRange);
    }
  },
  mounted: function () {
    this.minDate = this.dateRange[0],
    this.maxDate = this.dateRange[1]
  }

}
</script>

<style>
.mx-input-wrapper {
  position: relative;
  width: 280px;
}

.mx-icon-calendar,
.mx-icon-clear {
  position: absolute;
  top: 50%;
  left: 200px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 16px;
  line-height: 1;
  color: rgba(0, 0, 0, .5);
  vertical-align: middle;
}

.mx-input {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 80%;
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
}
</style>