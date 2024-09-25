<template>
  <LMap
    class="w-full h-full z-0 absolute"
    :zoom="zoom"
    :center="center"
    :options="{ zoomControl: false }"
    ref="myMap"
    :use-global-leaflet="true"
    @ready="onMapReady"
  >
    <LControlZoom position="bottomright"></LControlZoom>
    <LTileLayer :url="baseMapUrl" :attribution="attribution"></LTileLayer>

    <!--historic layer-->
    <div v-if="mapUrl.startsWith('https://mapseries')">
      <LTileLayer :url="mapUrl" :attribution="attribution"></LTileLayer>
    </div>
  </LMap>
</template>

<script>
export default {
  props: {
    mapMarkers: {
      type: Array,
      required: true,
    },
    mapUrl: {
      type: String,
      required: true,
    },
    center: {
      type: Array,
      required: true,
    },
    zoom: {
      type: Number,
      requried: true,
    },
  },
  data() {
    return {
      baseMapUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, James Dorret 1750 from the <a href="https://maps.nls.uk/geo/explore/#zoom=6.6&lat=57.29330&lon=-5.04553&layers=125140579&b=1">NLS Maps API</a>',
      markers: [],
      clusterOptions: {
        iconCreateFunction: function (cluster) {
          var iconHtml =
            '<img class="cluster-img" src="/images/witches-cluster-composite-yellow.png">';
          return L.divIcon({
            html: iconHtml,
            className: "mycluster",
            iconSize: null,
          });
        },
        disableClusteringAtZoom: 12,
        spiderfyOnMaxZoom: false,
      },
      locationOptions: ["residence", "detention", "placeOfDeath"],
      locationsLabels: {
        residence: "Residence",
        detention: "Detention",
        placeOfDeath: "Place of Death",
      },
      standardAttributes: ["sex", "occupation", "socialClass"],
      standardAttributeLabels: {
        sex: "Gender",
        occupation: "Occupation",
        socialClass: "Social Class",
      },
      optionalAttributes: [
        "demonicPact",
        "propertyDamage",
        "meetingsInfo",
        "meetingsPlaces",
        "shapeshifting",
        "ritualObjects",
        "primary",
        "secondary",
      ],
      optionalsLabels: {
        demonicPact: "Alleged Pacts with the devil",
        propertyDamage: "Alleged Property Damage",
        meetingsPlaces: "Alleged meetings places",
        meetingsInfo: "Alleged nature of meetings",
        shapeshifting: "Alleged shapeshifting",
        ritualObjects: "Alleged ritual objects",
        primary: "Primary Characteristics",
        secondary: "Secondary Characteristics",
      },
    };
  },
  methods: {
    fillMarkersArray(mapMarkers) {
      this.markers = mapMarkers.map((markerData) => {
        const lat = markerData.longLat[0];
        const lng = markerData.longLat[1];

        // Building the popup content as an HTML string
        const popupContent = `
          <h2>${markerData.location}</h2><br>
          <div class="${
            markerData.witches.length > 1
              ? "witch-scroller"
              : "no-witch-scroller"
          }">
            ${markerData.witches
              .map(
                (witch) => `
              <div class="font-semibold text-base">${witch.name}</div><br>
              <div><b>Investigation Date:</b> ${
                witch.investigationDates[1]
              }</div>
              ${this.getStandardAttributesWithValue(witch)
                .map(
                  (attr) => `
                <b>${this.standardAttributeLabels[attr]}:</b> ${witch[attr]}<br>
              `
                )
                .join("")}
              ${this.getLocationsWithValue(witch)
                .map(
                  (locationOption) => `
                <b>${this.locationsLabels[locationOption]}:</b> 
                ${witch[locationOption].locations
                  .map(
                    (subLocation, index) => `
                  ${subLocation}
                `
                  )
                  .join(", ")}<br>
              `
                )
                .join("")}
              ${this.getOptionalsWithValue(witch)
                .map(
                  (optionalAttribute) => `
                <b>${this.optionalsLabels[optionalAttribute]}:</b> 
                ${witch[optionalAttribute].join(", ")}<br>
              `
                )
                .join("")}
              ${
                witch.mannerOfDeath
                  ? `<b>Manner of Death:</b> ${witch.mannerOfDeath}<br>`
                  : ""
              }
              ${
                witch.wikiPage
                  ? `<a href="${witch.wikiPage}" target="_blank">View Wiki Page</a><br>`
                  : ""
              }
              <a href="${witch.link}" target="_blank">More Info</a><br><br>
            `
              )
              .join("")}
          </div>`;

        // Return the formatted marker object
        return {
          lat: lat,
          lng: lng,
          options: {
            icon: L.icon({
              iconUrl: markerData.markerIcon,
              iconSize: [25, 38],
              iconAnchor: this.iconAnchor,
              shadowUrl: this.shadowUrl,
              shadowSize: [25.6, 17.6],
              shadowAnchor: this.shadowAnchor,
            }),
          },
          popup: popupContent,
        };
      });
    },
    hasWikiEntry: function (marker) {
      let witchesWithEntry = marker.witches.filter(
        (witch) => witch.wikiPage !== ""
      );
      return witchesWithEntry.length > 0;
    },
    flyTo: function (coords) {
      this.$refs.myMap.leafletObject.flyTo(coords, 14);
    },
    emitMapData: function () {
      // Emmits an object containing the information about
      // where the center of the map is, the zoom, and what
      // map type to change to when the map is turned off,
      // in this case changing to clustersOff.
      console.log("Emitting Map Data");
      let centerInfo = this.$refs.myMap.leafletObject.getCenter();
      console.log("Center Info", centerInfo);
      let centerArray = [centerInfo.lat, centerInfo.lng];
      let changeInfo = {
        center: centerArray,
        zoom: this.$refs.myMap.leafletObject.getZoom(),
        changeTo: "clustersOff",
      };
      console.log("Zoom", changeInfo.zoom);
      this.$emit("changeMaps", changeInfo);
    },
    getLocationsWithValue: function (witch) {
      let locationsWithValue = [];

      this.locationOptions.map((option) => {
        if (witch[option].locations.length !== 0) {
          locationsWithValue.push(option);
        }
      });

      return locationsWithValue;
    },
    getStandardAttributesWithValue: function (witch) {
      let standardAttributesWithValue = [];

      this.standardAttributes.map((option) => {
        if (witch[option] !== "unknown") {
          standardAttributesWithValue.push(option);
        }
      });

      return standardAttributesWithValue;
    },
    getOptionalsWithValue: function (witch) {
      let optionalsWithValue = [];

      this.optionalAttributes.map((option) => {
        if (witch.hasOwnProperty(option) && witch[option][0] !== "unknown") {
          optionalsWithValue.push(option);
        }
      });

      return optionalsWithValue;
    },
    onMapReady() {
      this.fillMarkersArray(this.mapMarkers);
      useLMarkerClusterCustom({
        leafletObject: this.$refs.myMap.leafletObject,
        markers: this.markers,
        clusterOptions: this.clusterOptions,
      });
    },
  },
  computed: {
    iconAnchor: function () {
      return [11, 41];
    },
    shadowAnchor: function () {
      return [11, 26];
    },
    shadowUrl: function () {
      return "/images/North-Berwick-witch-shadow.png";
    },
  },
  beforeUnmount: function () {
    this.emitMapData();
  },
};
</script>

<style>
.cluster-img {
  float: left;
  width: 72px;
  height: 55px;
}
</style>
