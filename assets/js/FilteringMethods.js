class FilteringMethods {
  // Class with functional methods used during filtering,
  // i.e. methods that do not alter the state of the 
  // component when the filtering is done in MapComponent.vue.

  constructor (filterProperties, currentProperty) {
    this.filterProperties = filterProperties;
    this.currentProperty = currentProperty;
    this.noWitches = 0;
  }
  setNoWitches (noWitches) {
    this.noWitches = noWitches;
  }
  getNoWitches () {
    return this.noWitches
  }
  updateCurrentProperty (property) {
    this.currentProperty = property;
  }
  getMarkerIcon (markerType) {
    // Returns the marker icon based on markerType. MarkerType
    // is eithera filterType or 'mixed').
    if (markerType === "mixed") {
      return "/images/witch-single-purple.png";
    }

    return this.filterProperties[this.currentProperty].filters[markerType].iconUrl;
  }
  getMarkerType (witches) {
    // Gets the marker type (either a filterType, 'mixed' or null if
    // no witches are on) based on those witches that are on. Used
    // to get the new marker type after setting witches on/off.
    let markerType = null;

    for (let i = 0; i < witches.length; i++) {
      let witch = witches[i];

      if (witch.witchState.on) {
        let witchType = witch[this.currentProperty];

        if (!markerType) {
          markerType = witchType;
        }
        else if (witchType !== markerType) {
          return "mixed";
        }
      }
    }
    return markerType;
  }
  getMarkerState (marker) {
    // Returns a marker state array [markerIcon, active] based
    // on the witches that are on in the marker. It gets the markerType
    // by calling getMarkerType, and returns the state accordingly.
    // Note that if getMarkerTypeOnFilter returns null, then no witches
    // are on so the marker is off.
    let markerType = this.getMarkerType(marker.witches);

    if (markerType) {
      return [this.getMarkerIcon(markerType), true];
    }
    return [null, false];
  } 
  checkWitchOn(activeFilterProperties, filterProperty) {
    // Given a list with a witch's active filter properties,
    // returns the same list with filterProperty filtered out,
    // and whether the witch is on.
    let noActive = activeFilterProperties.length;
    if (noActive === 1 || noActive === 0) {
      return [[], true];
    }

    return [activeFilterProperties.filter(function (activeProperty) {
      return activeProperty !== filterProperty;
    }), false]
  }
  buildOutputMarker (marker, newWitches) {
    return {
      location: marker.location,
      longLat: marker.longLat,
      witches: newWitches,
      markerIcon: marker.markerIcon
    }
  }
  getOutputMarkers(markers) {
    // Returns a markers array with only the markers and
    // witches that are on. This is the array that will be
    // emitted to parent, and will then be used by LeafletMap
    // to plot.
    let outputMarkers = [];
    let noWitchesNew = 0

    for (let i = 0; i < markers.length; i++) {
      let marker = markers[i];

      if (marker.active) {
        let activeWitches = marker.witches.filter(function (witch) {
          return witch.witchState.on;
        });
        
        noWitchesNew += activeWitches.length;
        outputMarkers.push(this.buildOutputMarker(marker, activeWitches));
      }
    }
    this.noWitches = noWitchesNew;
    return outputMarkers;
  }
}

export default FilteringMethods