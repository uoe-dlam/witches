<template>
      <div class="w-full flex flex-wrap pl-0 pr-4 mt-2">
        <div v-for="(filterItem, filterType) in filtersList">
          <div class="flex mb-3 mx-2 w-full items-center">

            <input :checked="filtersList[filterType].active" 
                   @change="filterEmit(filterType)" 
                   type="checkbox" />
            <p class="text-xs text-center ml-1">
              {{ filterItem.label }}
            </p>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    property: {
      type: String,
      required: true
    },
    filterTypes: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filtersList: JSON.parse(JSON.stringify(this.filterTypes))
    }
  },
  methods: {
    setFilterInactive: function (filterType) {
      this.filtersList[filterType].active = false;
    },
    setFilterActive: function (filterType) {
      this.filtersList[filterType].active = true;
    },
    filterEmit: function (filterType) {
      let isActive = this.filtersList[filterType].active;

      if (isActive) {
        this.setFilterInactive(filterType);
        this.$emit("filterOff", [this.property, filterType]);
      }
      else {
        this.setFilterActive(filterType);
        this.$emit("filterOn", [this.property, filterType]);
      }
    }
  }
}
</script>

<style>
</style>