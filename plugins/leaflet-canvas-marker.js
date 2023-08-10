import Vue from 'vue';
import { LMap, LTileLayer } from 'vue2-leaflet';
import { LCanvasMarker } from '@simerca/vue2-leaflet-marker-canvas';

Vue.component('LMap', LMap);
Vue.component('LTileLayer', LTileLayer);
Vue.component('LCanvasMarker', LCanvasMarker);