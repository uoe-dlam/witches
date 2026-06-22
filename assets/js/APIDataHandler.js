class APIDataHandler {
  // Class that handles data from the json from the API
  // (json obtained from running the big query).

  constructor(queryOutput, wikiPages, icons, constantIcon) {
    this.originalMarkers = [];
    this.icons = icons;
    this.constantIcon = constantIcon;
    this.queryOutput = queryOutput;
    this.wikiPages = wikiPages;

    // Object with the filter propeties the filterTypes of
    // which are built dynamically.
    this.filterProperties = {
      socialClass: {},
      occupation: {},
      demonicPact: {},
      propertyDamage: {},
      meetingsPlaces: {},
      meetingsInfo: {},
      shapeshifting: {},
      ritualObjects: {},
      primary: {},
      secondary: {},
    };
    this.plotFieldsLabels = {
      residence: "residenceCoords",
      detention: "detentionLocationCoords",
      placeOfDeath: "placeOfDeathCoords",
    };
  }

  convertWikiDateToFriendlyDate(wikiDate) {
    let dateYear = wikiDate.substr(0, 4);
    let dateMonth = wikiDate.substr(5, 2);
    let dateDay = wikiDate.substr(8, 2);

    return dateDay + "/" + dateMonth + "/" + dateYear;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  convertPointToLongLatArray(pointString) {
    // Converts an location pulled out of wikidata
    // to a usable location array.

    pointString = pointString.substr(6);
    pointString = pointString.slice(0, -1);
    let pointArray = pointString.split(" ");
    let longLatArray = [pointArray[1], pointArray[0]];

    return longLatArray;
  }

  getItemWikiPage(item) {
    // Gets the wiki page for an item. Returns '' if
    // it doesn't have one.
    let wikiPage = "";

    for (let i = 0; i < this.wikiPages.length; i++) {
      if (this.wikiPages[i].id === item.item.value) {
        wikiPage = this.wikiPages[i].pageTitle;
        wikiPage.split(" ").join("_");
        wikiPage = "https://en.wikipedia.org/wiki/" + wikiPage;
      }
    }

    return wikiPage;
  }

  selectIcon(filterTypes) {
    // Selects an accused witch icon for a newly found based
    // filterType(male, vagrant etc.) based on the already existing
    // number.
    let position = filterTypes.length % this.icons.length;

    return this.icons[position];
  }

  getFilterObject(filter, found, behaviour) {
    // returns a filter object, where the icon depends
    // on whether iconBehaviour is constant or not. If it
    // is constant, then we set iconUrl to null.
    if (behaviour !== "constant") {
      let icon = this.selectIcon(found);

      return {
        label: this.capitalizeFirstLetter(filter),
        active: true,
        iconUrl: icon,
      };
    }

    return {
      label: this.capitalizeFirstLetter(filter),
      active: true,
      iconUrl: null,
    };
  }

  checkFilters(witchProperty, filterProperty) {
    // Checks if witchProperty (a filterType - either string
    // or array) doesn't exist already in
    // the object of filterProperty in filterProperties, and if so
    // adds it.
    let found = Object.keys(this.filterProperties[filterProperty[0]]);

    if (Array.isArray(witchProperty)) {
      witchProperty.map((filter) => {
        this.filterProperties[filterProperty[0]][filter] = this.getFilterObject(
          filter,
          found,
          filterProperty[1],
        );
      });
    } else {
      if (!found.includes(witchProperty)) {
        this.filterProperties[filterProperty[0]][witchProperty] =
          this.getFilterObject(witchProperty, found, filterProperty[1]);
      }
    }
  }

  getStringBetweenBrackets(quality) {
    if (!quality.includes("(")) {
      return null;
    }

    return quality.slice(quality.indexOf("(") + 1, quality.lastIndexOf(")"));
  }

  getFilterTypesFromData(filterProperty, dataArray) {
    // For a given property in a string with properties seperated
    // by | and filterTypes between brackets, returns all the
    // filterTypes if finds for the property.
    // Example data input:
    // "pact with the devil (new name) | pact with the devil (sex with the devil) |
    // pact with the devil (anti-baptism) | Witches' Sabbath (devil)".
    // Here <pact with the devil> and <Witches' Sabbath> are filterProperties and
    // everything between brackets filter types.
    let filterTypes = [];

    dataArray.map((dataEntry) => {
      if (dataEntry.includes(filterProperty)) {
        let filterType = this.getStringBetweenBrackets(dataEntry);

        if (filterType !== null) {
          filterTypes.push(filterType);
        }
      }
    });

    if (filterTypes.length === 0) {
      return ["unknown"];
    }

    return filterTypes;
  }

  getWitchShapeshifting(charges) {
    // Returns an array with all the shapeshifting
    // charges for a witch.
    let chargesArray = charges.split("|");
    return this.getFilterTypesFromData("shapeshifting", chargesArray);
  }

  getWitchInfoFromQualities(qualities) {
    // Returns an object with the data from the qualities
    // string. (demonic pact, property damage, meetings
    // information.)
    let qualitiesArray = qualities.split("|");

    return {
      demonicPact: this.getFilterTypesFromData(
        "pact with the devil",
        qualitiesArray,
      ),
      propertyDamage: this.getFilterTypesFromData(
        "property damage",
        qualitiesArray,
      ),
      meetingsInfo: this.getFilterTypesFromData(
        "Witches' Sabbath",
        qualitiesArray,
      ),
    };
  }

  getPrimary(charac) {
    // Gets a primary characteristic if it is a primary
    // characteristic. If not returns null.
    let bracketIndex = charac.indexOf("(");

    if (bracketIndex === -1) {
      return null;
    }

    return charac.slice(0, bracketIndex - 1);
  }

  getPrimaryAndSecondary(including) {
    // Returns the primary and secondary characteristics
    // for a witch.
    if (including === "") {
      return {
        primary: ["unknown"],
        secondary: ["unknown"],
      };
    }

    let includingArray = including.split(" | ");
    let secondaries = [];
    let primaries = [];

    includingArray.map((charac) => {
      let primaryCharac = this.getPrimary(charac);

      if (primaryCharac !== null) {
        primaries.push(primaryCharac);
      } else {
        secondaries.push(charac);
      }
    });

    if (secondaries.length === 0) {
      secondaries = ["unknown"];
    }

    if (primaries.length === 0) {
      primaries = ["unknown"];
    }

    return {
      primary: primaries,
      secondary: secondaries,
    };
  }

  getSplitData(data) {
    // Given a string of data separated by "|" it returns
    // such string split into a list, or an empty list if
    // the string is empty. Used for ritualObjects and witchMeetings
    // locations.
    if (data === "") {
      return ["unknown"];
    }
    let dataArray = data.split(" | ");

    return dataArray;
  }

  getWitchNonOptionalProperties(item) {
    // Returns a witch object with the properties that
    // need to be had by any given witch, and have 'unknown'
    // or 'N/A' otherwise.
    let wikiPage = this.getItemWikiPage(item);
    let investigationDate = item.hasOwnProperty("investigationStart")
      ? item.investigationStart.value
      : "N/A";
    let investigationDates = [new Date(investigationDate), investigationDate];

    if (investigationDate !== "N/A") {
      investigationDates[1] =
        this.convertWikiDateToFriendlyDate(investigationDate);
    }

    return {
      id: item.item.value,
      sex: item.hasOwnProperty("sexLabel") ? item.sexLabel.value : "unknown",
      name: item.itemLabel.value,
      link:
        "http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.accusedrecord&accusedref=" +
        item.link.value +
        "&search_string=lastname",
      hasWikiPage: wikiPage === "" ? "noWiki" : "hasWiki",
      wikiPage: wikiPage === "" ? "" : wikiPage,
      socialClass: item.hasOwnProperty("socialClassificationLabel")
        ? item.socialClassificationLabel.value
        : "unknown",
      occupation: item.hasOwnProperty("occupationLabel")
        ? item.occupationLabel.value
        : "unknown",
      investigationDates: investigationDates,
      precision: item.hasOwnProperty("investigationStartPrecision")
        ? item.investigationStartPrecision.value
        : "unknown",
    };
  }

  getWitchLocations(item) {
    return {
      residence: {
        locations: item.hasOwnProperty("residenceLabel")
          ? [item.residenceLabel.value]
          : [],
        coordinates: item.hasOwnProperty("residenceCoords")
          ? [this.convertPointToLongLatArray(item.residenceCoords.value)]
          : [],
      },
      detention: {
        locations: item.hasOwnProperty("detentionLocationLabel")
          ? [item.detentionLocationLabel.value]
          : [],
        coordinates: item.hasOwnProperty("detentionLocationCoords")
          ? [
              this.convertPointToLongLatArray(
                item.detentionLocationCoords.value,
              ),
            ]
          : [],
      },
      placeOfDeath: {
        locations: item.hasOwnProperty("placeOfDeathLabel")
          ? [item.placeOfDeathLabel.value]
          : [],
        coordinates: item.hasOwnProperty("placeOfDeathCoords")
          ? [this.convertPointToLongLatArray(item.placeOfDeathCoords.value)]
          : [],
      },
    };
  }

  addFiltersFound(witch, filtersToProduce) {
    // Checks the witch data for each filter to produce
    // property, and adds any new filters to the corresponding
    // filterProperty in filterProperties. Works by calling
    // either checkFiltersArray or checkFiltersString.

    filtersToProduce.map((filterProperty) => {
      let witchProperty = witch[filterProperty[0]];

      this.checkFilters(witchProperty, filterProperty);
    });
  }

  loadAccussed(plotByField, filtersToProduce) {
    let witches = [];

    for (let i = 0; i < this.queryOutput.results.bindings.length; i++) {
      let item = this.queryOutput.results.bindings[i];

      if (item.hasOwnProperty(this.plotFieldsLabels[plotByField])) {
        let repeatedWitch = witches.find((existingWitch) => {
          return existingWitch.id === item.item.value;
        });

        if (!repeatedWitch) {
          let witch = this.getWitchNonOptionalProperties(item);
          witch = Object.assign(witch, this.getWitchLocations(item));

          if (item.hasOwnProperty("qualities")) {
            witch = Object.assign(
              witch,
              this.getWitchInfoFromQualities(item.qualities.value),
            );
          }

          witch.mannerOfDeath = item.hasOwnProperty("mannerOfDeathLabel")
            ? item.mannerOfDeathLabel.value
            : "";

          if (item.hasOwnProperty("meetingLocations")) {
            witch.meetingsPlaces = this.getSplitData(
              item.meetingLocations.value,
            );
          }

          if (item.hasOwnProperty("charges")) {
            witch.shapeshifting = this.getWitchShapeshifting(
              item.charges.value,
            );
          }

          if (item.hasOwnProperty("ritualObjects")) {
            witch.ritualObjects = this.getSplitData(item.ritualObjects.value);
          }

          if (item.hasOwnProperty("including")) {
            witch = Object.assign(
              witch,
              this.getPrimaryAndSecondary(item.including.value),
            );
          }

          witch.witchState = {
            activeFilters: [],
            on: true,
          };

          this.addFiltersFound(witch, filtersToProduce);
          witches.push(witch);
          this.addWitchToMarkers(witch, plotByField, 0);
        } else {
          // If witch is repeated, add already existing witch with the new locations
          // like we did before.
          let newLocations = this.getWitchLocations(item);
          let newLocationPlotBy = newLocations[plotByField].locations[0];
          let existingPlotBys = repeatedWitch[plotByField].locations;
          let newLocationsKeys = Object.keys(newLocations);

          if (!existingPlotBys.includes(newLocationPlotBy)) {
            repeatedWitch[plotByField].locations.push(
              newLocations[plotByField].locations[0],
            );
            repeatedWitch[plotByField].coordinates.push(
              newLocations[plotByField].coordinates[0],
            );

            newLocationsKeys.map((newLocationKey) => {
              if (newLocationKey !== plotByField) {
                if (newLocations[newLocationKey].locations.length !== 0) {
                  let newLocation = newLocations[newLocationKey].locations[0];
                  let newCoordinates =
                    newLocations[newLocationKey].coordinates[0];

                  if (
                    !repeatedWitch[newLocationKey].locations.includes(
                      newLocation,
                    )
                  ) {
                    repeatedWitch[newLocationKey].locations.push(newLocation);
                    repeatedWitch[newLocationKey].coordinates.push(
                      newCoordinates,
                    );
                  }
                }
              }
            });

            this.addWitchToMarkers(
              repeatedWitch,
              plotByField,
              repeatedWitch[plotByField].locations.length - 1,
            );
          }
        }
      }
    }

    return [this.originalMarkers, this.filterProperties];
  }

  getFiltersProduced(filtersToProduce) {
    let filtersProduced = [];

    filtersToProduce.map((filterProperty) => {
      filtersProduced.push(this.filterProperties[filterProperty]);
    });

    return filtersProduced;
  }

  addWitchToMarkers(witch, plotByField, locationIndex) {
    // Adds witch to markers.
    let location = witch[plotByField].locations[locationIndex];
    if (location === null) {
      console.log(witch);
    }

    // find marker for current location so you can add witch
    let marker = this.originalMarkers.find((marker) => {
      return marker.location === location;
    });

    if (marker) {
      marker.witches.push(witch);
    } else {
      let coords = witch[plotByField].coordinates[locationIndex];
      let markerIcon = null;

      if (this.constantIcon !== null) {
        markerIcon = this.constantIcon;
      }

      let marker = {
        location: location,
        longLat: coords,
        witches: [witch],
        markerIcon: markerIcon,
        active: true,
      };
      this.originalMarkers.push(marker);
    }
  }
}

export default APIDataHandler;
