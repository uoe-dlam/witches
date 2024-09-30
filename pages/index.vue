<template>
  <loading-message v-if="loading" />
  <map-component
    v-else
    :pageInfo="pageInfo"
    :originalMarkers="originalMarkers"
    :filtersGeneralInfo="filtersGeneralInfo"
    :filterProperties="filterProperties"
    iconBehaviour="changing"
  >
  </map-component>
</template>

<script>
import { ref, onMounted } from "vue";
import { useIcons } from "@/composables/useIcons";
import { SPARQLQueryDispatcher } from "~/assets/js/SPARQLQueryDispatcher";
import APIDataHandler from "~/assets/js/APIDataHandler";
import FilteringMethods from "~/assets/js/FilteringMethods";
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
      title: "Witchcraft Prosecutions In Time and Place",
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
      ["socialClass", "changing"],
      ["occupation", "changing"],
    ],
    filtersGeneralInfo: {
      title: "Accused witch filters",
      filtersShowing: true,
    },
    filterProperties: {
      sex: {
        label: "Gender",
        description:
          "84% of the accused were women and 15% men. The sex is not known for 1% of those accused.  A gender division of 85% women and 15% men is seen in most other parts of Europe, but in areas like Estonia, Russia and Finland the percentage of men accused is as high and in some areas higher than of women. In Iceland the percentage of men executed was as high as 90%. ",
        descriptionShowing: false,
        filters: {
          male: {
            label: "Male",
            active: true,
            iconUrl: "/images/witch-single-blue.png",
          },
          female: {
            label: "Female",
            active: true,
            iconUrl: "/images/witch-single-orange.png",
          },
          unknown: {
            label: "Unknown",
            active: true,
            iconUrl: "/images/witch-single-BW.png",
          },
        },
        showing: true,
      },
      socialClass: {
        label: "Social Classification",
        description:
          "Were they poor? No, not by contemporary standards. It is difficult to classify early modern people into socio-economic categories, but where status was indicated the majority fell into the middle range—64%. The total of those who came from lower socio-economic categories—lower, very poor and landless—accounted for 29%, with upper, lairds and nobility accounting for 6%. We do not know this information for the majority of accused, but these figures may be typical.",
        descriptionShowing: false,
        filters: {},
        showing: false,
      },
      occupation: {
        label: "Occupations",
        description:
          "Were the witches midwives or healers? Only 9 individuals have an occupation recorded as being a midwife. A tiny percentage. Folk healing was more common and featured in 141 witchcraft accusations (about 4%). Even so, it was not something that the typical accused seems to have engaged in—though the beliefs that underpinned folk healing were closely related to witchcraft beliefs. If magic could be used to heal, it could also be used to harm.",
        descriptionShowing: false,
        filters: {},
        showing: false,
      },
      hasWikiPage: {
        label: "Wikipedia Page",
        description:
          'Some of the accused witches have wikipedia pages written about them, to find out more about thier stories follow the link "View Wiki Page" when you are on an accused witch',
        descriptionShowing: false,
        filters: {
          hasWiki: {
            label: "Has wiki",
            active: true,
            iconUrl: "/images/witch-single-blue.png",
          },
          noWiki: {
            label: "No wiki",
            active: true,
            iconUrl: "/images/witch-single-orange.png",
          },
        },
        showing: false,
      },
    },
  }),
  computed: {
    icons() {
      const { icons } = useIcons();
      return icons.value;
    },
  },
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

    // Local storage functions:
    hasLocalStorageExpired: function () {
      let hours = 24; // Reset when storage is more than 24hours
      let now = new Date().getTime();
      let setupTime = localStorage.getItem("setupTime");

      return setupTime === null || now - setupTime > hours * 60 * 60 * 1000;
    },
    loadDataFromLocalStorage: function () {
      this.originalMarkers = JSON.parse(
        localStorage.getItem("residenceMarkers"),
      );
      let allFilters = JSON.parse(localStorage.getItem("allFilters"));
      this.filterProperties.socialClass.filters = allFilters.socialClass;
      this.filterProperties.occupation.filters = allFilters.occupation;
    },
    saveDataToLocalStorage: function (foundFilters) {
      let now = new Date().getTime();
      localStorage.setItem("setupTime", now);
      localStorage.setItem(
        "residenceMarkers",
        JSON.stringify(this.originalMarkers),
      );
      localStorage.setItem("allFilters", JSON.stringify(foundFilters));
    },
    setMarkersIcons: function () {
      let Filtering = new FilteringMethods(this.filterProperties, "sex");

      for (let i = 0; i < this.originalMarkers.length; i++) {
        let marker = this.originalMarkers[i];
        [marker.markerIcon, marker.active] =
          Filtering.getMarkerStateIconDependant(marker);
      }
    },
    async loadData() {
      await this.loadWikiEntries();
      const icons = this.icons;

      try {
        let response = await useMyFetch("/main.php?type=accused");
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
        icons,
        null,
      );
      let filtersFound = null;

      [this.originalMarkers, filtersFound] = getData.loadAccussed(
        "residence",
        this.filtersToFind,
      );

      this.filterProperties.socialClass.filters = filtersFound.socialClass;
      this.filterProperties.occupation.filters = filtersFound.occupation;
      this.setMarkersIcons();
      this.loading = false;
    },
    numberOfWitches: function () {
      let noWitches = 0;

      for (let i = 0; i < this.originalMarkers.length; i++) {
        noWitches += this.originalMarkers[i].witches.length;
      }

      return noWitches;
    },
  },
  watch: {
    originalMarkers: {
      handler(newVal) {
        const numberOfWitches = this.numberOfWitches();
        this.pageInfo.html = `<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">${numberOfWitches}</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>`;
      },
      immediate: true, // Computes numberOfWitches immediately when originalMarkers gets filled
    },
  },
  mounted: function () {
    this.loadData();
  },
};
</script>

<style></style>
