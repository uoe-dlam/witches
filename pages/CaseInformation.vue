<template>
  <loading-message v-if="loading" />
  <map-component v-else :pageInfo="pageInfo" 
                :originalMarkers="originalMarkers" 
                :filtersGeneralInfo="filtersGeneralInfo"
                :filterProperties="filterProperties" 
                :includeTimeline="false"
                iconBehaviour="constant">
  </map-component>
</template>

<script>
import { SPARQLQueryDispatcher } from '~/assets/js/SPARQLQueryDispatcher'
import APIDataHandler from '~/assets/js/ApiDataHandler';
import json from '../big-query-output.json'
import MapComponent from '../components/MapComponent.vue';
import LoadingMessage from '../components/LoadingMessage.vue';

export default {
  components: { MapComponent, LoadingMessage },
  data: () => ({
    pageInfo: {
      title: 'Witches Meetings',
      html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3142</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',
      footer: 'witches.is.ed.ac.uk',
      confirmButtonText: 'Close',
      type: 'info',
      showCloseButton: true,
    },
    queryOutput: json,
    sparqlUrl: 'https://query.wikidata.org/sparql',
    wikiPages: [],
    loading: true,
    originalMarkers: [],
    filtersToFind: [
      ["demonicPact", "constant"],
      ["propertyDamage", "constant"],
      ["meetingsPlaces", "constant"],
      ["meetingsInfo", "constant"],
    ],
    filtersGeneralInfo: {
      title: "Case information filters",
      filtersShowing: true
    },
    filterProperties: {
      demonicPact: {
        label: "Pact with the devil",
        description: "Descriptions of meeting the Devil and entering a pact with him feature in the majority of records that have detailed information. This relationship with the Devil was crucial to the church and the law in proving someone was guilty. 90% of those whose records show demonic features were women. Many people were tortured into confessing to Devil-worship. For more information about the types of pact please refer to the Survey’s glossary of terms here: <a href='https://witches.hca.ed.ac.uk/glossary/' target='_blank'>Survey Glossary</a>",
        descriptionShowing: false,
        filters: {},
        showing: true
      },
      propertyDamage: {
        label: "Property damage",
        description:"The witch was accused of causing damage to property as part of the case investigation’s allegations. For more information about the types of property damage mentioned below please refer to the Survey’s glossary of terms here: <a href='https://witches.hca.ed.ac.uk/glossary/' target='_blank'>Survey Glossary</a>",
        descriptionShowing: false,
        filters: {},
        showing: false
      },
      meetingsPlaces: {
        label: "Meetings places",
        description:"This section covers where the accused was supposed to have held their witches meeting or Sabbath. There are some cases where people described meeting in groups. However, the numbers involved varied greatly: from 2 to over 100, and in one case 2,400. Moreover, most of these meetings were probably invented by suspects under heavy pressure to confess. For more information about the meeting places mentioned please refer to the Survey’s glossary of terms here: <a href='https://witches.hca.ed.ac.uk/glossary/' target='_blank'>Survey Glossary</a>",
        descriptionShowing: false,
        filters: {},
        showing: false
      },
      meetingsInfo: {
        label: "Meetings information",
        description:"This section covers some of the main accusations of what was alleged to have transpired during the witches meeting or Sabbath. There are some cases where people described indulging in communal rituals. The stereotype coven of 13 is a modern invention. The idea derives largely from the fantastical confession of a Scottish witch, Isobel Gowdie. For more information about the meeting themes mentioned below please refer to the Survey’s glossary of terms here: <a href='https://witches.hca.ed.ac.uk/glossary/' target='_blank'>Survey Glossary</a>",
        descriptionShowing: false,
        filters: {},
        showing: false
      },
    }
  }),
  methods: {
    loadWikiEntries: function () {
      const sparqlQuery = `SELECT DISTINCT ?item ?LabelEN ?page_title
            WHERE {
              ?item wdt:P4478 ?witch .
              ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ;  schema:name ?page_title .
              ?item rdfs:label ?LabelEN filter (lang(?LabelEN) = "en") .
            }`;

      const queryDispatcher = new SPARQLQueryDispatcher(this.sparqlUrl);
      queryDispatcher.query(sparqlQuery).then(result => {

        for (let i = 0; i < result.results.bindings.length; i++) {
          let item = result.results.bindings[i];

          let wikiPage = {
            id: item.item.value,
            pageTitle: item.page_title.value,
          }

          this.wikiPages.push(wikiPage);
        }
      });
    },
    setFilters: function (filtersFound) {
      // Using a function in this page instead of just
      // assigning manually like in the other pages because
      // there are 6 of them.

      this.filtersToFind.map(filterProperty => {
        this.filterProperties[filterProperty[0]].filters = filtersFound[filterProperty[0]];
      })
    },
    // Local storage functions:
    hasLocalStorageExpired: function () {
      let hours = 24; // Reset when storage is more than 24hours
      let now = new Date().getTime();
      let setupTime = localStorage.getItem('setupTime');

      return setupTime === null || (now - setupTime > hours * 60 * 60 * 1000);
    },
    loadDataFromLocalStorage: function () {
      this.originalMarkers = JSON.parse(localStorage.getItem('residenceMarkers'));
      let allFilters = JSON.parse(localStorage.getItem('allFilters'));
      this.setFilters(allFilters);
      this.setMarkersIcons();
      console.log(this.filterProperties);
    },
    setMarkersIcons: function () {

      for (let i = 0; i < this.originalMarkers.length; i++) {
        let marker = this.originalMarkers[i];
        marker.markerIcon = "/images/witch-single-orange.png";
      }
    },
    loadData: async function () {
      this.loadWikiEntries();
      let icon = "/images/witch-single-orange.png";

      try {
        let response = await this.$axios.get('/main.php?type=meetings')
        this.queryOutput = response.data
      } catch (e) {
        this.$swal({
          title: 'Server Error',
          html: '<div>We are unable to connect to the server to pull in map info. Please refresh the page and try again. If this error persists, please contact <a href="mailto:ltw-apps-dev.ed.ac.uk">ltw-apps-dev.ed.ac.uk</a></div>',
          footer: 'witches.is.ed.ac.uk',
          confirmButtonText: 'Close',
          type: 'error',
          showCloseButton: true,
        });

        return
      }

      let getData = new APIDataHandler(
        this.queryOutput, this.wikiPages,
        null, icon
      );
      let filtersFound = null;

      [
        this.originalMarkers,
        filtersFound
      ] = getData.loadAccussed('residence', this.filtersToFind);

      this.setFilters(filtersFound);
      this.setMarkersIcons();
      this.loading = false;
    }
  },

  mounted: function () {
    this.loadData();
  }
};
</script>

<style>
</style>
