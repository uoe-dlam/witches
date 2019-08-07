<template>
    <div id="outer">
        <div id="inner">
            <div id="map-filters"  class="p-6">
                <h1>Locations of trials for accused witches</h1><br>
                <div>
                    <span v-for="(tile, index) in tiles">
                        <input type="radio" name="tile" :checked="tile.name === currentTileName" @change="filterTiles(tile)"/>&nbsp;{{tile.name}}&nbsp;
                    </span>
                </div>
                <br>
                <h2>Year: {{ sliderYear }}</h2>
                <vue-slider v-model="sliderYear" :adsorb="false" :data="sliderYears" :marks="true" @change="filterDates()"></vue-slider>
                <br><br>
            </div>
            <div id="map-wrapper">
                <no-ssr>
                    <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
                        <l-tile-layer :url="url"></l-tile-layer>

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
                                      <img :src="getIcon(marker)" width="100%"/>
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
        attribution: 'Historical Maps Layer, 1919-1947 from the <a href="http://maps.nls.uk/projects/api/">NLS Maps API</a>',
        zoom: 8,
        center: [55.95, -3.198888888],
        markers: [],
        originalMarkers: [],
        currentTileName : 'modern map',
        tiles: [{name: 'modern map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true},{name: 'historic map', url: 'https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg', active : false}],
        sliderYear: 1750,
        sliderYears: [1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750],
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
                
                for (let i = 0; i < result.results.bindings.length; i++) {
                    let item = result.results.bindings[i];

                    let trialDate = item.date.value;
                    trialDate = trialDate.substr(0, 10);

                    let trialYear = item.date.value;
                    trialYear =  trialDate.substr(0, 4);

                    let trial = {
                        id: item.item.value,
                        location: item.residenceLabel.value,
                        witchName: item.personLabel.value,
                        link: 'http://http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.trialrecord&search_string&trialref=' + item.link.value,
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
                marker.trials = marker.trials.filter(trial => trial.year <= this.sliderYear);
            });

            this.markers = markers;
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

#map-filters{
    font-size:12px;
}

#map-wrapper {
  background-color: #DDDDDD;
  flex-grow : 1;
}

.icon-wrapper{
  position: relative;
  text-align: center;
  width: 25px;
  height: 41px;
  font-color: #fff;
}

.icon-text{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    text-shadow: 1px 1px 3px #000;
}

.icon-wiki{
    position: absolute;
    top: -5px;
    left: 13px;
    color: #fff;
    text-shadow: 1px 1px 3px #000;
}

.icon-shadow{
    position: absolute;
    top: 15px !important;
    left: 0;
    z-index: -1;
    width: 32px;
    height: 22px !important;
}

.witch-scroller{
    height:225px; 
    overflow:scroll;
    padding-right:5px;
}

.no-witch-scroller{

}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0,0,0,.5);
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

div.leaflet-popup.leaflet-zoom-animated{
    bottom: 1px !important;
}

/*
div.leaflet-marker-icon.marker-cluster.marker-cluster-small.leaflet-zoom-animated.leaflet-interactive span{
    display: none;
}

div.leaflet-marker-icon.marker-cluster.marker-cluster-medium.leaflet-zoom-animated.leaflet-interactive span{
    display: none;
}

div.leaflet-marker-icon.marker-cluster.marker-cluster-large.leaflet-zoom-animated.leaflet-interactive span{
    display: none;
}
*/


</style>