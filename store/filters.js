export const state = () => ({
  filterProperties: {
    gender: {
      label: 'Gender',
      filters: ['male', 'female', 'unknown']
    },
    socialClass: {
      label: 'Social Classification',
      filters: []
    },
    occupation: {
      label: 'Occupations',
      filters: []
    },
    hasWikiPage: {
      label: 'Has Wiki',
      filters: ['hasWiki', 'noWiki']
    }
  },
  allFilters: {
    male: {
      label: 'Male', active: true,
      iconUrl: '/images/witch-single-blue.png'
    },
    female: {
      label: 'Female', active: true,
      iconUrl: '/images/witch-single-orange.png'
    },
    unknown: {
      label: 'Unknown', active: true,
      iconUrl: '/images/witch-single-BW.png'
    },
    hasWiki: {
      label: "Has wiki", active: true,
      iconUrl: '/images/witch-single-blue.png'
    },
    noWiki: {
      label: "No wiki", active: true,
      iconUrl: '/images/witch-single-orange.png'
    }
  }
});

export const getters = {
  getCurrent: state => {
    return state.currentPalette;
  }
}