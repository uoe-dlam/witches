const WitchesStorage = {
  hasLocalStorageExpired: function () {
    let hours = 24; // Reset when storage is more than 24hours
    let now = new Date().getTime();
    let setupTime = localStorage.getItem('setupTime');

    return setupTime === null || (now - setupTime > hours*60*60*1000);
  },
  loadDataFromLocalStorage: function () {
    return [JSON.parse(localStorage.getItem('main')), JSON.parse(localStorage.getItem('wiki'))];
  },
  saveDataToLocalStorage: function (mainJson, wikiPages) {
    let now = new Date().getTime();
    localStorage.setItem('setupTime', now);
    localStorage.setItem('main', JSON.stringify(mainJson));
    localStorage.setItem('wiki', JSON.stringify(wikiPages));
  },
}

export default WitchesStorage