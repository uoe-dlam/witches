import { defineNuxtPlugin } from '#app'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("leaflet", L);
});
