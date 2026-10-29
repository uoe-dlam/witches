<template>
    <div id="map-wrapper" class="w-full h-full">
        <!-- Leaflet map. -->
        <client-only>
            <div id="map" class="w-full h-full relative">
                <!-- Clusters on-off button -->
                <div
                    class="absolute flex justify-center w-fit items-center top-0 right-0 z-10 bg-gray-400/80 px-2 py-0.5 rounded-sm"
                >
                    <p
                        class="mr-2 font-medium text-lg mb-0"
                        style="font-family: EB Garamond"
                    >
                        Group witches:
                    </p>
                    <label class="switch relative pr-2">
                        <input
                            :checked="clustersInitial"
                            type="checkbox"
                            @change="toggleActive()"
                        />
                        <span class="slider round"></span>
                    </label>
                </div>
                <clusters-map
                    v-if="clusterState.clustersOn"
                    :center="center"
                    :map-markers="mapMarkers"
                    :map-url="mapUrl"
                    :zoom="zoom"
                    @change-maps="changeMaps($event)"
                />

                <normal-map
                    v-if="clusterState.clustersOff"
                    :center="center"
                    :map-markers="mapMarkers"
                    :map-url="mapUrl"
                    :zoom="zoom"
                    @change-maps="changeMaps($event)"
                />
            </div>
        </client-only>
    </div>
</template>

<script setup>
import ClustersMap from './ClustersMap.vue'
import NormalMap from './NormalMap.vue'

const props = defineProps({
    mapUrl: {
        type: String,
        required: true,
    },
    mapMarkers: {
        type: Array,
        required: true,
    },
    clustersInitial: {
        type: Boolean,
        required: true,
    },
})

const zoom = ref(7)
const center = ref([56.0, -6]) // making second entry more negative moves map to the right.
const clusterState = ref({
    clustersOn: props.clustersInitial,
    clustersOff: !props.clustersInitial,
})

const changeMaps = (changeInfo) => {
    // Called when either of the two map components emits
    // "changeMaps". It sets the map state inherited from the
    // map being turned off, and turns the new map on, which will
    // in turn inherit the map state so that the new map appears in the
    // same place, same zoom as the old one.

    center.value = changeInfo.center
    zoom.value = changeInfo.zoom
    clusterState.value[changeInfo.changeTo] = true
}

const toggleActive = () => {
    // Turns whichever map is on to false to trigger a map change.
    if (clusterState.value.clustersOn) {
        clusterState.value.clustersOn = false
    } else {
        clusterState.value.clustersOff = false
    }
}

watch(
    () => props.clustersInitial,
    () => {
        toggleActive()
    }
)
</script>

<style>
.cluster-img {
    float: left;
    width: 72px;
    height: 55px;
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
    width: 25.6px;
    height: 17.6px !important;
}

.switch {
    display: inline-block;
    width: 38.4px;
    height: 21.76px;
}

/* Hide default HTML checkbox */
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* The slider */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.2s;
    transition: 0.2s;
    width: 38.4px;
}

.slider:before {
    position: absolute;
    content: '';
    height: 16.64px;
    width: 16.64px;
    left: 2.56px;
    bottom: 2.56px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked + .slider {
    background-color: #eeb518e1;
}

input:focus + .slider {
    box-shadow: 0 0 1px #eeb518e1;
}

input:checked + .slider:before {
    -webkit-transform: translateX(16.64px);
    -ms-transform: translateX(16.64px);
    transform: translateX(16.64px);
}

.slider.round {
    border-radius: 21.76px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
