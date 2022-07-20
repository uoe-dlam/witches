const MarkerDataHandler = {
  selectIcon: function (filterTypes, icons) {
    // Selects an accused witch icon for a newly found based 
    // filterType(male, vagrant etc.) based on the already existing
    // number.
    let position = filterTypes.length % icons.length;

    return icons[position];
  },
  checkFilters: function (filter, propertyFilters, icons) {
    // Checks if filter doesn't exist 
    // already, and if so it returns a filter object.

    if (!propertyFilters.includes(filter)) {
      let icon = this.selectIcon(propertyFilters, icons);

      return {
        label: filter,
        active: true,
        iconUrl: icon
      }
    }
    
    return null
  }
}

export default MarkerDataHandler