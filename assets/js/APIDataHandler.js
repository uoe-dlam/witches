const APIDataHandler = {
  selectIcon: function (filterTypes, icons) {
    // Selects an accused witch icon for a newly found based 
    // filterType(male, vagrant etc.) based on the already existing
    // number.
    let position = filterTypes.length % icons.length;

    return icons[position];
  },
  checkSocials: function (currentSocials, socialClass, icons) {
    // Checks if a socialClass filter type doesn't exist 
    // already, and if so it adds it to the filters object 
    // for social class. If no new socials exist returns null.

    if (!currentSocials.includes(socialClass)) {
      let icon = this.selectIcon(currentSocials, icons);
      let socialInfo = {
        label: socialClass,
        active: true,
        iconUrl: icon
      };
      return socialInfo
    }
    return null
  },
  checkOccupations: function (currentOccupations, occupation, icons) {
    // Checks if an occupation filter type doesn't exist 
    // already, and if so it adds it to the filters object 
    // for social class. If now new occupations exist, returns null.

    if (!currentOccupations.includes(occupation)) {
      let icon = this.selectIcon(currentOccupations, icons);
      let occupationInfo = {
        label: occupation,
        active: true,
        iconUrl: icon
      };
      return occupationInfo
    }
    return null
  }
}

export default APIDataHandler