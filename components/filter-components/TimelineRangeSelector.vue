<template>
  <div class="ml-4 mt-2 flex flex-col">

    <div class="flex items-center">
      <div class="title-point"></div>
      <p>Choose slider date range: </p>
    </div>
    <date-picker class="ml-5 mt-2 w-1/2" 
                  v-model="inputRange" 
                  range :placeholder="defaultMessage"
                  valueType="date"
                  format="DD-MM-YYYY"
                  :default-value="defaultRange"
                  :disabled-date="getEnabledDateRange"
                  :lang="lang">
    </date-picker>

    <div class="flex">
      <div class="flex items-center justify-center mt-4"
           style="height: 34px;">
        <button class="rounded-lg text-white text-sm
                      bg-sky-600 py-1 hover:border-2"
                style="width: 52px;"
                @click="emitDateRange()">
          Apply
        </button>
      </div>
      <!-- <div class="flex items-center justify-center"
           style="height: 34px;">
        <button class="rounded-lg w-32 text-white ml-3 text-sm
                      bg-sky-600 py-1 hover:border-2"
                v-if="emittedCustom"
                @click="emitDefaultRange()">
          Reset dates default
        </button>
      </div> -->
    </div>

  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import TimelineMethods from '../../assets/js/TimelineMethods';

export default {
  components: { DatePicker },
  data() {
    return {
      emittedCustom: false,
      inputRange: null,
      fullRange: this.$store.getters['timelineData/getDateRange'],
      defaultRange: [new Date("01/01/1650"), new Date("01/01/1670")],
      defaultRangeSrt: ["01/01/1650", "01/01/1670"],
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
    getEnabledDateRange: function (date) {
      return date < this.fullRange[0] || date > this.fullRange[1]
    },
    emitDateRange: function () {
      if (this.inputRange) {
        this.$emit("selectedDateRange", this.inputRange);
        this.emittedCustom = true;
      } else {
        this.emitDefaultRange();
      }
    },
    emitDefaultRange: function () {
      this.$emit("selectedDateRange", this.defaultRange);
    }
  },
  computed: {
    defaultMessage() {
      return "Default: " + this.defaultRangeSrt[0] + "~" + this.defaultRangeSrt[1]
    }
  }
}
</script>

<style>
.mx-input-wrapper {
  position: relative;
  width: 311px;
}

.mx-icon-calendar,
.mx-icon-clear {
  position: absolute;
  top: 50%;
  left: 226px;
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