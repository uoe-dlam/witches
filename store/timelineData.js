export const state = () => ({
  dateRange: null,
});

export const getters = {
  getDateRange: (state) => {
    return state.dateRange;
  },
};

export const mutations = {
  setDateRange(state, dateRange) {
    state.dateRange = [new Date(dateRange[0]), new Date(dateRange[1])];
  },
};
