<template>
    <div id="outer">
        <div id="inner">
            <div id="page-intro" class="pl-5 pr-5 pt-3 pb-3">
               <br>
                <div class="flex content-start items-center">
                    <h1 class="text-sm md:text-xl lg:text-2xl">Locations of trials for accused witches
                        <span v-if="noItems > 0">(total no trials: {{noItems}})</span>
                    </h1>
                    <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
                        <!-- icon by feathericons.com -->
                        <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
                           <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
                        </svg>
                    </span>
                </div>
                <div>
                    <br>
                    <span v-for="(tile, index) in tiles">
                        <input type="radio" name="tile" :checked="tile.name === currentTileName" @change="filterTiles(tile)"/>&nbsp;{{tile.name}}&nbsp;
                    </span>
                </div>
                <br>
                <h2>Year: {{ sliderYear[0] }} - {{ sliderYear[1] }}</h2>
                <div class="p-2">
                    <vue-slider v-model="sliderYear" :adsorb="false" :data="sliderYears" :marks="true" @change="filterDates()"></vue-slider>
                </div>
                <br><br>
            </div>
            <div id="map-wrapper">
                <no-ssr>
                    <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
                        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

                        <l-marker v-for="(marker, index) in activeMarkers"
                                      :lat-lng="marker.longLat">
                                <l-popup class="adapted-popup">
                                    <h2>{{marker.location}}</h2><br>
                                    <div :class="marker.trials.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
                                        <div v-for="(trial, index) in marker.trials">
                                            <strong>{{ trial.witchName }}</strong><br>
                                            Trial Date: {{ trial.date }}<br>
                                            Trial Year: {{ trial.year }}<br>
                                            <a :href="trial.link" target="_blank">More Info</a><br><br>
                                        </div>
                                    </div>
                                </l-popup>
                                <l-icon :icon-anchor="iconAnchor">
                                  <div class="icon-wrapper">
                                      <div v-if="marker.trials.length > 1" class="icon-text">{{marker.trials.length}}</div>
                                      <img :src="getIcon(marker)" class="zoomed-in-img"/>
                                      <img class="icon-shadow" :src="shadowUrl"/>
                                  </div>
                                </l-icon>
                        </l-marker>

                    </l-map>
                </no-ssr>
            </div>
        </div>
    </div>
</template>

<script>

import {SPARQLQueryDispatcher} from '~/assets/js/SPARQLQueryDispatcher';

export default {
    data: () => ({
        sparqlUrl: 'https://query.wikidata.org/sparql',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, 1919-1947 from the <a href="http://maps.nls.uk/projects/api/">NLS Maps API</a>',
        zoom: 7,
        center: [55.95, -3.198888888],
        markers: [],
        originalMarkers: [],
        currentTileName : 'Modern Map',
        tiles: [{name: 'Modern Map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true},{name: 'Historic Map', url: 'https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg', active : false}],
        sliderYear: [1550, 1750],
        sliderYears: [1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750],
        noItems: '',
    }),
    methods: {
        convertPointToLongLatArray: function(pointString) {
            pointString = pointString.substr(6);
            pointString = pointString.slice(0,-1);
            let pointArray = pointString.split(' ');
            let longLatArray = [pointArray[1], pointArray[0]];
            return longLatArray;

        },
        loadTrials : function() {
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

            const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
            queryDispatcher.query( sparqlQuery ).then( result => {

                this.noItems = result.results.bindings.length;

                for (let i = 0; i < result.results.bindings.length; i++) {
                    let item = result.results.bindings[i];

                    let trialDate = item.date.value;
                    trialDate = trialDate.substr(0, 10);

                    let trialYear = item.date.value;
                    trialYear =  trialDate.substr(0, 4);
                    let trialMonth =  trialDate.substr(5,2);
                    let trialDay =   trialDate.substr(8,2);

                    trialDate = trialDay + '/' + trialMonth + '/' + trialYear;

                    let trial = {
                        id: item.item.value,
                        location: item.residenceLabel.value,
                        witchName: item.personLabel.value,
                        link: 'http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.trialrecord&search_string&trialref=' + item.link.value,
                        longLat: this.convertPointToLongLatArray(item.coords.value),
                        date: trialDate,
                        year: trialYear,
                    }

                    let marker = this.markers.find( marker => {
                        return marker.location === trial.location;
                    });

                    if(marker){
                        marker.trials.push(trial);
                    } else {
                        let marker = {
                            location: item.residenceLabel.value,
                            longLat: this.convertPointToLongLatArray(item.coords.value),
                            trials: [trial],
                        }
                        
                        this.markers.push(marker);
                    }
                }
                
                this.originalMarkers = JSON.parse(JSON.stringify( this.markers ));

                this.filterDates();
            });


        },
        getIcon : function( marker ) {
            return '/images/North-Berwick-witch.png';
        },
        filterTiles : function( tile ){
            this.currentTileName = tile.name;
            this.url = tile.url;
        },
        filterDates : function(){
            let markers = JSON.parse(JSON.stringify(this.originalMarkers));

            markers.forEach(marker => {
                marker.trials = marker.trials.filter(trial => trial.year >= this.sliderYear[0] && trial.year <= this.sliderYear[1]);
            });

            this.markers = markers;
        },
        showPageInfo(){
            this.$swal({
                title: 'Trial Location Map',
                html: '<div>This map indicates the location of trial for the accused witches. There is an option to change the year, to show how the numbers of trials changed with time. A few people had <b class="font-bold">multiple trials</b>, which could have been held in <b class="font-bold">different locations</b>. There are <b class="font-bold">3211</b> recorded trials which have been related to witchcraft within the database. However, there are geographical locations noted for only <b class="font-bold">432</b> trials, meaning that many trial locations were not recorded in the surviving documents.</div>',
                footer: 'witches.is.ed.ac.uk',
                confirmButtonText: 'Close',
                type: 'info',
                showCloseButton: true,
            });
        }
    },
    computed : {
        activeMarkers : function() {
            return this.markers.filter(function(marker) {
                return marker.trials.length > 0;
            });
        },
        iconAnchor : function() {
            return [11, 41];
        },
        shadowUrl : function() {
            return '/images/North-Berwick-witch-shadow.png';
        }
    },
    mounted: function() {
        this.loadTrials();
    }
};
</script>

<style>
.zoomed-in-img {
    float: left;
    width: 25px;
    height: 38px;
}

.icon-shadow{
    position: absolute;
    top: 15px !important;
    left: 0;
    z-index: -1;
    width: 32px;
    height: 22px !important;
}

</style>