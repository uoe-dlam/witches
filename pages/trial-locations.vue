<template>
  <div id="outer">
    <div id="inner">
      <div id="page-intro" class="pl-5 pr-5 pt-3 pb-3">
        <br />
        <div class="flex content-start items-center">
          <h2>
            Locations of trials for accused witches
            <span v-if="noItems > 0">(total no trials: {{ noItems }})</span>
          </h2>
          <div
            class="inline-flex items-center justify-center align-middle rounded-full border-r-2 border-l-2 border-gray-400 w-6 h-6 hover:w-7 hover:h-7 mb-0.5 ml-1 cursor-pointer"
          >
            <img
              src="/images/infoIcon.svg"
              class="w-full h-full pt-0.5"
              alt="Page Information Popup"
              @click="showPageInfo()"
            />
          </div>
        </div>
        <div>
          <br />
          <span v-for="(tile, index) in tiles" :key="index">
            <input
              type="radio"
              name="tile"
              :checked="tile.name === currentTileName"
              @change="filterTiles(tile)"
            />&nbsp;{{ tile.name }}&nbsp;
          </span>
        </div>
        <br />
        <h2>Year: {{ sliderYear[0] }} - {{ sliderYear[1] }}</h2>
        <div class="p-2">
          <Slider
            name="slider"
            v-model="numberRangeValue"
            :min="0"
            :max="8"
            :format="getYearLabel"
            showTooltip="drag"
            :merge="1"
            @change="filterDates()"
            :lazy="false"
          />
        </div>
        <!-- Display slider years below the slider -->
        <div class="slider-years">
          <span
            v-for="(year, index) in sliderYears"
            :key="index"
            class="slider-year"
            >{{ year }}</span
          >
        </div>
        <br /><br />
      </div>
      <div id="map-wrapper">
        <client-only>
          <LMap style="height: 100%; width: 100%" :zoom="zoom" :center="center">
            <LTileLayer :url="url" :attribution="attribution"></LTileLayer>

            <LMarker
              v-for="(marker, index) in activeMarkers"
              :key="index"
              :lat-lng="marker.longLat"
            >
              <LPopup class="adapted-popup">
                <h2>{{ marker.location }}</h2>
                <br />
                <div
                  :class="
                    marker.trials.length > 1
                      ? 'witch-scroller'
                      : 'no-witch-scroller'
                  "
                >
                  <div v-for="(trial, index) in marker.trials" :key="index">
                    <strong>{{ trial.witchName }}</strong
                    ><br />
                    Trial Date: {{ trial.date }}<br />
                    Trial Year: {{ trial.year }}<br />
                    <a :href="trial.link" target="_blank">More Info</a
                    ><br /><br />
                  </div>
                </div>
              </LPopup>
              <LIcon
                :icon-size="[25, 38]"
                :icon-anchor="iconAnchor"
                :iconUrl="getIcon(marker)"
                :shadowUrl="shadowUrl"
                :shadowSize="[32, 22]"
                :shadowAnchor="shadowAnchor"
              >
              </LIcon>
            </LMarker>
          </LMap>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { SPARQLQueryDispatcher } from "~/assets/js/SPARQLQueryDispatcher";
import Swal from "sweetalert2";
import Slider from "@vueform/slider";

definePageMeta({
  layout: "default",
});

export default {
  components: { Slider },
  data: () => ({
    sparqlUrl: "https://query.wikidata.org/sparql",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, 1919-1947 from the <a href="http://maps.nls.uk/projects/api/">NLS Maps API</a>',
    zoom: 7,
    center: [55.95, -3.198888888],
    markers: [],
    originalMarkers: [],
    currentTileName: "Modern Map",
    tiles: [
      {
        name: "Modern Map",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        active: true,
      },
      {
        name: "Historic Map",
        url: "https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg",
        active: false,
      },
    ],
    sliderYear: [1550, 1750],
    sliderYears: [1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750],
    noItems: "",
    numberRangeValue: [0, 8],
  }),
  computed: {
    max() {
      return this.sliderYears.length - 1;
    },
  },
  methods: {
    convertPointToLongLatArray: function (pointString) {
      pointString = pointString.substr(6);
      pointString = pointString.slice(0, -1);
      let pointArray = pointString.split(" ");
      let longLatArray = [pointArray[1], pointArray[0]];
      return longLatArray;
    },
    getYearLabel(value) {
      return this.sliderYears[value];
    },
    loadTrials: function () {
      const sparqlQuery = `SELECT ?item ?residenceLabel ?coords ?personLabel ?date ?link
            WHERE
            {
              ?item wdt:P4532 ?witch .
              ?item wdt:P276 ?residence .
              ?residence wdt:P625 ?coords .
              ?item wdt:P1591 ?person .
              ?item wdt:P585 ?date .
              ?item wdt:P4532 ?link .
              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`;

      const queryDispatcher = new SPARQLQueryDispatcher(this.sparqlUrl);
      queryDispatcher.query(sparqlQuery).then((result) => {
        this.noItems = result.results.bindings.length;

        for (let i = 0; i < result.results.bindings.length; i++) {
          let item = result.results.bindings[i];

          let trialDate = item.date.value;
          trialDate = trialDate.substr(0, 10);

          let trialYear = item.date.value;
          trialYear = trialDate.substr(0, 4);
          let trialMonth = trialDate.substr(5, 2);
          let trialDay = trialDate.substr(8, 2);

          trialDate = trialDay + "/" + trialMonth + "/" + trialYear;

          let trial = {
            id: item.item.value,
            location: item.residenceLabel.value,
            witchName: item.personLabel.value,
            link:
              "http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.trialrecord&search_string&trialref=" +
              item.link.value,
            longLat: this.convertPointToLongLatArray(item.coords.value),
            date: trialDate,
            year: trialYear,
          };

          let marker = this.markers.find((marker) => {
            return marker.location === trial.location;
          });

          if (marker) {
            marker.trials.push(trial);
          } else {
            let marker = {
              location: item.residenceLabel.value,
              longLat: this.convertPointToLongLatArray(item.coords.value),
              trials: [trial],
            };

            this.markers.push(marker);
          }
        }

        this.originalMarkers = JSON.parse(JSON.stringify(this.markers));

        this.filterDates();
      });
    },
    getIcon: function (marker) {
      return "/images/North-Berwick-witch.png";
    },
    filterTiles: function (tile) {
      this.currentTileName = tile.name;
      this.url = tile.url;
    },
    filterDates: function () {
      let markers = JSON.parse(JSON.stringify(this.originalMarkers));

      markers.forEach((marker) => {
        marker.trials = marker.trials.filter(
          (trial) =>
            trial.year >= this.sliderYears[this.numberRangeValue[0]] &&
            trial.year <= this.sliderYears[this.numberRangeValue[1]],
        );
      });

      this.markers = markers;
    },
    showPageInfo() {
      Swal.fire({
        title: "Trial Location Map",
        html: '<div>This map indicates the location of trial for the accused witches. There is an option to change the year, to show how the numbers of trials changed with time. A few people had <b class="font-bold">multiple trials</b>, which could have been held in <b class="font-bold">different locations</b>. There are <b class="font-bold">3211</b> recorded trials which have been related to witchcraft within the database. However, there are geographical locations noted for only <b class="font-bold">432</b> trials, meaning that many trial locations were not recorded in the surviving documents.</div>',
        footer: "witches.is.ed.ac.uk",
        confirmButtonText: "Close",
        type: "info",
        showCloseButton: true,
      });
    },
  },
  computed: {
    activeMarkers: function () {
      return this.markers.filter(function (marker) {
        return marker.trials.length > 0;
      });
    },
    iconAnchor: function () {
      return [11, 41];
    },
    shadowUrl: function () {
      return "/images/North-Berwick-witch-shadow.png";
    },
    shadowAnchor: function () {
      return [11, 26];
    },
  },
  mounted: function () {
    this.loadTrials();
  },
};
</script>

<style>
.slider-years {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}

.slider-year {
  font-size: 14px;
  color: #606f7b;
}
.zoomed-in-img {
  float: left;
  width: 25px;
  height: 38px;
}

.icon-shadow {
  position: absolute;
  top: 15px !important;
  left: 0;
  z-index: -1;
  width: 32px;
  height: 22px !important;
}
</style>
