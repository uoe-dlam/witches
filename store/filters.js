export const state = () => ({
  currentProperty: "sex",
  allFilters: {
    sex: {
      "male": {
        "label": "Male",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "female": {
        "label": "Female",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      },
      "unknown": {
        "label": "Unknown",
        "active": true,
        "iconUrl": "/images/witch-single-BW.png"
      }
    },
    socialClassification: {
      "middling": {
        "label": "middling",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "pauper": {
        "label": "pauper",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      },
      "unknown": {
        "label": "unknown",
        "active": true,
        "iconUrl": "/images/witch-single-pink.png"
      },
      "working poor": {
        "label": "working poor",
        "active": true,
        "iconUrl": "/images/witch-single-red.png"
      },
      "vagrant": {
        "label": "vagrant",
        "active": true,
        "iconUrl": "/images/witch-single-brown.png"
      },
      "nobility": {
        "label": "nobility",
        "active": true,
        "iconUrl": "/images/witch-single-green.png"
      },
      "upper class": {
        "label": "upper class",
        "active": true,
        "iconUrl": "/images/witch-single-pale-blue.png"
      },
      "Laird": {
        "label": "Laird",
        "active": true,
        "iconUrl": "/images/witch-single-yellow.png"
      }
    },
    occupation: {
      "unknown": {
        "label": "unknown",
        "active": true,
        "iconUrl": "/images/witch-single-pink.png"
      },
      "domestic worker": {
        "label": "domestic worker",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "vagrant": {
        "label": "vagrant",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      },
      "midwife": {
        "label": "midwife",
        "active": true,
        "iconUrl": "/images/witch-single-red.png"
      },
      "Christian minister": {
        "label": "Christian minister",
        "active": true,
        "iconUrl": "/images/witch-single-brown.png"
      },
      "courier": {
        "label": "courier",
        "active": true,
        "iconUrl": "/images/witch-single-green.png"
      },
      "weaver": {
        "label": "weaver",
        "active": true,
        "iconUrl": "/images/witch-single-pale-blue.png"
      },
      "cunning folk": {
        "label": "cunning folk",
        "active": true,
        "iconUrl": "/images/witch-single-yellow.png"
      },
      "shopkeeper": {
        "label": "shopkeeper",
        "active": true,
        "iconUrl": "/images/witch-single-pink.png"
      },
      "miller": {
        "label": "miller",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "laborer": {
        "label": "laborer",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      },
      "metalsmith": {
        "label": "metalsmith",
        "active": true,
        "iconUrl": "/images/witch-single-red.png"
      },
      "healer": {
        "label": "healer",
        "active": true,
        "iconUrl": "/images/witch-single-brown.png"
      },
      "loadman": {
        "label": "loadman",
        "active": true,
        "iconUrl": "/images/witch-single-green.png"
      },
      "maltman": {
        "label": "maltman",
        "active": true,
        "iconUrl": "/images/witch-single-pale-blue.png"
      },
      "blacksmith": {
        "label": "blacksmith",
        "active": true,
        "iconUrl": "/images/witch-single-yellow.png"
      },
      "merchant": {
        "label": "merchant",
        "active": true,
        "iconUrl": "/images/witch-single-pink.png"
      },
      "occultist": {
        "label": "occultist",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "mealmaker": {
        "label": "mealmaker",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      },
      "teacher": {
        "label": "teacher",
        "active": true,
        "iconUrl": "/images/witch-single-red.png"
      },
      "farmer": {
        "label": "farmer",
        "active": true,
        "iconUrl": "/images/witch-single-brown.png"
      },
      "tailor": {
        "label": "tailor",
        "active": true,
        "iconUrl": "/images/witch-single-green.png"
      },
      "stabler": {
        "label": "stabler",
        "active": true,
        "iconUrl": "/images/witch-single-pale-blue.png"
      },
      "fisher": {
        "label": "fisher",
        "active": true,
        "iconUrl": "/images/witch-single-yellow.png"
      },
      "piece work": {
        "label": "piece work",
        "active": true,
        "iconUrl": "/images/witch-single-pink.png"
      },
      "brewster": {
        "label": "brewster",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "coal miner": {
        "label": "coal miner",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      },
      "slater": {
        "label": "slater",
        "active": true,
        "iconUrl": "/images/witch-single-red.png"
      },
      "nurse": {
        "label": "nurse",
        "active": true,
        "iconUrl": "/images/witch-single-brown.png"
      },
      "School Master": {
        "label": "School Master",
        "active": true,
        "iconUrl": "/images/witch-single-green.png"
      },
      "henwife": {
        "label": "henwife",
        "active": true,
        "iconUrl": "/images/witch-single-pale-blue.png"
      },
      "cook": {
        "label": "cook",
        "active": true,
        "iconUrl": "/images/witch-single-yellow.png"
      },
      "sailor": {
        "label": "sailor",
        "active": true,
        "iconUrl": "/images/witch-single-pink.png"
      },
      "creelman": {
        "label": "creelman",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      }
    },
    hasWikiPage: {
      "hasWiki": {
        "label": "Has wiki",
        "active": true,
        "iconUrl": "/images/witch-single-blue.png"
      },
      "noWiki": {
        "label": "No wiki",
        "active": true,
        "iconUrl": "/images/witch-single-orange.png"
      }
    }
  }
});

export const getters = {
  getFilters: state => {
    return state.allFilters;
  },
  getCurrentProperty: state => {
    return state.currentProperty;
  },
  getAllFiltersKeys: state => {
    return Object.keys(state.allFilters);
  },
  getSocials: state => {
    return Object.keys(state.allFilters.socialClassification);
  },
  getOccupations: state => {
    return Object.keys(state.allFilters.occupation);
  }
};

export const mutations = {
  setInactive(state, filterType) {
    // <filterObj> is an object with the filter property 
    // (sex, social class etc) and  filter type 
    // (male, vagrant etc) in the second.
    state.allFilters[state.currentProperty][filterType].active = false;
  },
  setActive(state, filterType) {
    // It removes the filter filterObj (see above for description)
    // from the active filters array.
    state.allFilters[state.currentProperty][filterType].active = true;
  },
  updateCurrentProperty(state, property) {
    state.currentProperty = property;
  },
  updateSocials(state, socialInfo) {
    state.allFilters.socialClassification[socialInfo.label] = socialInfo;
  },
  updateOccupations(state, occupationInfo) {
    state.allFilters.occupation[occupationInfo.label] = occupationInfo;
  }
};