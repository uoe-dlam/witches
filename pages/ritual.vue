<template>
  <loading-message v-if="loading" />
  <map-component
    v-else
    :pageInfo="pageInfo"
    :originalMarkers="originalMarkers"
    :filtersGeneralInfo="filtersGeneralInfo"
    :filterProperties="filterProperties"
    :includeTimeline="false"
    iconBehaviour="constant"
  >
  </map-component>
</template>

<script>
import { SPARQLQueryDispatcher } from "~/assets/js/SPARQLQueryDispatcher";
import APIDataHandler from "~/assets/js/APIDataHandler";
import json from "../big-query-output.json";
import MapComponent from "../components/MapComponent.vue";
import LoadingMessage from "../components/LoadingMessage.vue";
import Swal from "sweetalert2";

definePageMeta({
  layout: "default",
});

export default {
  components: { MapComponent, LoadingMessage },
  data: () => ({
    pageInfo: {
      title: "Shapeshifting and Ritual Objects",
      html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3142</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',
      footer: "witches.is.ed.ac.uk",
      confirmButtonText: "Close",
      type: "info",
      showCloseButton: true,
    },
    queryOutput: json,
    sparqlUrl: "https://query.wikidata.org/sparql",
    wikiPages: [],
    loading: true,
    originalMarkers: [],
    filtersToFind: [
      ["shapeshifting", "constant"],
      ["ritualObjects", "constant"],
    ],
    filtersGeneralInfo: {
      title: "Case information filters",
      filtersShowing: true,
    },
    filterProperties: {
      shapeshifting: {
        label: "Shapeshifting",
        description:
          "Shapeshifting was the magical transformation of a human into an animal. This was mainly a popular belief, but educated demonologists accepted it. In the Scottish witch trials, some accused witches confessing to having taken animal form, presumably through coercive interrogation. Less often, neighbours or victims testified that they had seen the witch in animal form. The animal was most often a cat, but we also find transformations into a dog, a 'corbie' (raven or crow), or other creatures. For more information about the shape-shifting terms mentioned below please refer to the Survey’s glossary of terms here:<a href='https://witches.hca.ed.ac.uk/glossary/' target='_blank'>Survey Glossary</a> ",
        descriptionShowing: false,
        filters: {},
        showing: false,
      },
      ritualObjects: {
        label: "Ritual objects",
        description:
          "Two different types of rituals appear in accused witches’ records. First, there were real rituals, mostly carried out by magical practitioners, for healing and other beneficial purposes. Second, there were imaginary rituals, which the accusers thought that witches carried out when they met the Devil; accused witches were forced to confess to these under torture. Each type of ritual could use magical objects. Thus, a ‘belt’ or a ‘sword’ could be used in healing rituals, whereas ‘corpse powder’ appeared in confessions to demonic rituals. For more information about the ritual objects mentioned below please refer to the Survey’s glossary of terms here: <a href='https://witches.hca.ed.ac.uk/glossary/' target='_blank'>Survey Glossary</a>",
        descriptionShowing: false,
        filters: {},
        showing: false,
      },
    },
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
      queryDispatcher.query(sparqlQuery).then((result) => {
        for (let i = 0; i < result.results.bindings.length; i++) {
          let item = result.results.bindings[i];

          let wikiPage = {
            id: item.item.value,
            pageTitle: item.page_title.value,
          };

          this.wikiPages.push(wikiPage);
        }
      });
    },
    setFilters: function (filtersFound) {
      // Using a function in this page instead of just
      // assigning manually like in the other pages because
      // there are 6 of them.

      this.filtersToFind.map((filterProperty) => {
        this.filterProperties[filterProperty[0]].filters =
          filtersFound[filterProperty[0]];
      });
    },
    // Local storage functions:
    hasLocalStorageExpired: function () {
      let hours = 24; // Reset when storage is more than 24hours
      let now = new Date().getTime();
      let setupTime = localStorage.getItem("setupTime");

      return setupTime === null || now - setupTime > hours * 60 * 60 * 1000;
    },
    loadDataFromLocalStorage: function () {
      this.originalMarkers = JSON.parse(
        localStorage.getItem("residenceMarkers")
      );
      let allFilters = JSON.parse(localStorage.getItem("allFilters"));
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
        let response = await myFetch("/main.php?type=ritual");
        this.queryOutput = response;
      } catch (e) {
        Swal.fire({
          title: "Server Error",
          html: '<div>We are unable to connect to the server to pull in map info. Please refresh the page and try again. If this error persists, please contact <a href="mailto:ltw-apps-dev.ed.ac.uk">ltw-apps-dev.ed.ac.uk</a></div>',
          footer: "witches.is.ed.ac.uk",
          confirmButtonText: "Close",
          type: "error",
          showCloseButton: true,
        });

        return;
      }

      let getData = new APIDataHandler(
        this.queryOutput,
        this.wikiPages,
        null,
        icon
      );
      let filtersFound = null;

      [this.originalMarkers, filtersFound] = getData.loadAccussed(
        "residence",
        this.filtersToFind
      );

      this.setFilters(filtersFound);
      this.setMarkersIcons();
      this.loading = false;
    },
  },

  mounted: function () {
    this.loadData();
  },
};
</script>

<style></style>
