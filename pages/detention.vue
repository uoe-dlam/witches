<template>
    <div id="outer">
        <div id="inner">
            <div id="map-filters" class="p-6">
                <h1>Places of detention for accused witches <span v-if="noItems > 0">(total no witches: {{noItems}})</span></h1><br>
                <div>
                    <span v-for="(tile, index) in tiles">
                        <input type="radio" name="tile" :checked="tile.name === currentTileName" @change="filterTiles(tile)"/>&nbsp;{{tile.name}}&nbsp;
                    </span>
                </div>
                <br>
                <div>
                    <span v-for="(layer, index) in layers">
                        <input type="radio" name="layer" :checked="layer.id === currentLayer.id" @change="filterLayers(layer)"/>&nbsp;{{layer.label}}&nbsp;
                    </span>
                </div>
                <br>
                <div v-if="currentLayer.id === 'sexes'" >
                    <span v-for="(sex, index) in sexes" class="flex items-center float-left">
                        <input type="checkbox" v-model="sex.active" @change="filterMarkers()"/>&nbsp;<img :src="sex.iconUrl" width="12" height="20"/>&nbsp;{{sex.type}}&nbsp;
                    </span>
                </div>
                <div v-if="currentLayer.id === 'occupations'" >
                    <span v-for="(occupation, index) in occupations" class="flex items-center float-left">
                        <input type="checkbox" v-model="occupation.active" @change="filterMarkers()"/>&nbsp;<img :src="occupation.iconUrl" width="12" height="20"/>&nbsp;{{occupation.type}}&nbsp;
                    </span>
                </div>
                <div v-if="currentLayer.id === 'socials'" >
                    <span v-for="(social, index) in socials" class="flex items-center float-left">
                        <input type="checkbox" v-model="social.active" @change="filterMarkers()"/>&nbsp;<img :src="social.iconUrl" width="12" height="20"/>&nbsp;{{social.type}}&nbsp;
                    </span>
                </div>
                <div v-if="currentLayer.id === 'wikis'" >
                    <span v-for="(wiki, index) in wikis" class="flex items-center float-left">
                        <input type="checkbox" v-model="wiki.active" @change="filterMarkers()"/>&nbsp;<img :src="wiki.iconUrl" width="12" height="20"/>&nbsp;{{wiki.type}}&nbsp;
                    </span>
                </div>
            </div>
            <div id="map-wrapper">
                <no-ssr>
                    <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center" ref="myMap">
                        <l-tile-layer :url="url"></l-tile-layer>
                        <v-marker-cluster :options="clusterOptions">
                        <l-marker v-for="(marker, index) in activeMarkers"
                                      :lat-lng="marker.longLat">
                                <l-popup class="adapted-popup">
                                    <h2>{{marker.location}}</h2><br>
                                    <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
                                        <div v-for="(witch, index) in marker.witches">
                                            <strong>{{ witch.name }}</strong><br>
                                            Gender: {{ witch.sex }}<br>
                                            Occupation: {{ witch.occupation }}<br>
                                            Social Class: {{ witch.socialClassification }}<br>
                                            <div v-if="witch.residence !== ''">
                                                Residence: <a @click="flyTo(witch.residenceCoords)" :style="{ cursor: 'pointer'}">{{ witch.residence }}</a><br>
                                            </div>
                                            <div v-if="witch.detentionLocation !== ''">
                                                Place of Detention: <a @click="flyTo(witch.detentionLocationCoords)" :style="{ cursor: 'pointer'}">{{ witch.detentionLocation }}</a><br>
                                            </div>
                                            <div v-if="witch.placeOfDeath !== ''">
                                                Place of Death: <a @click="flyTo(witch.placeOfDeathCoords)" :style="{ cursor: 'pointer'}">{{ witch.placeOfDeath }}</a><br>
                                            </div>
                                            <div v-if="witch.mannerOfDeath !== ''">
                                                Manner of Death: {{ witch.mannerOfDeath }}<br>
                                            </div>
                                            <div v-if="witch.wikiPage !== ''">
                                                <a :href="witch.wikiPage" target="_blank">View Wiki Page</a><br>
                                            </div>
                                            <a :href="witch.link" target="_blank">More Info</a><br><br>
                                        </div>
                                    </div>
                                </l-popup>
                                <l-icon :icon-anchor="iconAnchor" :key="marker">
                                  <div class="icon-wrapper">
                                      <div v-if="hasWikiEntry(marker)" class="icon-wiki">W</div>
                                      <div v-if="marker.witches.length > 1" class="icon-text">{{marker.witches.length}}</div>
                                      <img :src="getIcon(marker)" width="100%"/>
                                      <img class="icon-shadow" :src="shadowUrl"/>
                                  </div>
                                </l-icon>
                        </l-marker>
                        </v-marker-cluster>
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
        noItems: 0,
        sparqlUrl: 'https://query.wikidata.org/sparql',
        url: 'https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg',
        attribution: 'Historical Maps Layer, 1919-1947 from the <a href="http://maps.nls.uk/projects/api/">NLS Maps API</a>',
        zoom: 7,
        center: [55.95, -3.198888888],
        clusterOptions: {
            iconCreateFunction: function (cluster) {
                var html = '<div><img src="/images/witches-cluster-composite.png" width="72" height="54"></div>';
                return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(72, 54) });
            },
            disableClusteringAtZoom : 12,
            spiderfyOnMaxZoom: false
        },
        wikiPages: [],
        markers: [],
        originalMarkers: [],
        currentTileName : 'Historic Map',
        tiles: [{name: 'Historic Map', url: 'https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg', active : false},{name: 'Modern Map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true}],
        layers: [{id: 'sexes', label: 'Gender', property : 'sex'}, {id: 'socials', label: 'Social Classification', property : 'socialClassification'}, {id: 'occupations', label: 'Occupations', property : 'occupation'},  {id: 'wikis', label: 'Wiki Entries', property : 'hasWikiPage'}],
        currentLayer : {id: 'sexes', label: 'gender', property : 'sex'},
        sexes: [{type: 'male', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'},{type: 'female', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'}, {type: 'unknown', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'}],
        wikis: [{type: 'has wiki', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'},{type: 'no wiki', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'}],
        socials: [],
        occupations: [],
        icons: ['https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
               ]
    }),
    methods: {
        convertPointToLongLatArray: function(pointString) {
            pointString = pointString.substr(6);
            pointString = pointString.slice(0,-1);
            let pointArray = pointString.split(' ');
            let longLatArray = [pointArray[1], pointArray[0]];
            return longLatArray;

        },
        loadWikiEntries : function() {
            const sparqlQuery = `SELECT DISTINCT ?item ?LabelEN ?page_title
            WHERE { 
              ?item wdt:P4478 ?witch .
              ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ;  schema:name ?page_title .
              ?item rdfs:label ?LabelEN filter (lang(?LabelEN) = "en") .
            }`;

            const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
            queryDispatcher.query( sparqlQuery ).then( result => {
                
                for (let i = 0; i < result.results.bindings.length; i++) {
                    let item = result.results.bindings[i];
                    
                    let wikiPage = {
                        id: item.item.value,
                        pageTitle: item.page_title.value,
                    }
                    
                    this.wikiPages.push(wikiPage);
                }
                
                this.loadAccussed();
            });   
        },
        loadAccussed : function() {
            const sparqlQuery = ` SELECT ?item ?itemLabel ?residenceLabel ?residenceCoords ?sexLabel ?link ?occupationLabel ?socialClassificationLabel ?placeOfDeathLabel ?placeOfDeathCoords ?mannerOfDeathLabel ?detentionLocationLabel ?detentionLocationCoords
            WHERE
            {
              ?item wdt:P4478 ?witch .
              optional {
                ?item wdt:P551 ?residence .
                ?residence wdt:P625 ?residenceCoords .
              }
              optional { ?item wdt:P21 ?sex } .
              ?item wdt:P4478 ?link .
              optional { ?item wdt:P106 ?occupation}
              optional { ?item wdt:P3716 ?socialClassification}
              optional {
                ?item wdt:P20 ?placeOfDeath .
                ?placeOfDeath wdt:P625 ?placeOfDeathCoords
              }
              optional { ?item wdt:P1196 ?mannerOfDeath}
              ?item wdt:P2632 ?detentionLocation .
              ?detentionLocation wdt:P625 ?detentionLocationCoords
              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`;

            const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
            queryDispatcher.query( sparqlQuery ).then( result => {

                this.noItems = result.results.bindings.length;

                for (let i = 0; i < result.results.bindings.length; i++) {
                    let item = result.results.bindings[i];
                    let sex = item.hasOwnProperty('sexLabel') ? item.sexLabel.value : 'unknown';
                    let occupation = item.hasOwnProperty('occupationLabel') ? item.occupationLabel.value : 'unknown';
                    let residence = item.hasOwnProperty('residenceLabel') ? item.residenceLabel.value : '';
                    let residenceCoords = item.hasOwnProperty('residenceCoords') ? this.convertPointToLongLatArray(item.residenceCoords.value) : '';
                    let socialClassification = item.hasOwnProperty('socialClassificationLabel') ? item.socialClassificationLabel.value : 'unknown';
                    let placeOfDeath = item.hasOwnProperty('placeOfDeathLabel') ? item.placeOfDeathLabel.value : '';
                    let placeOfDeathCoords = item.hasOwnProperty('placeOfDeathCoords') ? this.convertPointToLongLatArray(item.placeOfDeathCoords.value) : '';
                    let mannerOfDeath = item.hasOwnProperty('mannerOfDeathLabel') ? item.mannerOfDeathLabel.value : '';
                    let detentionLocation = item.hasOwnProperty('detentionLocationLabel') ? item.detentionLocationLabel.value : '';
                    let detentionLocationCoords = item.hasOwnProperty('detentionLocationCoords') ? this.convertPointToLongLatArray(item.detentionLocationCoords.value) : '';
                    let wikiPage = this.getItemWikiPage(item);

                    if(!this.occupations.find(item => item.type === occupation)){
                        this.occupations.push({type: occupation, active: true, iconUrl: this.icons[this.occupations.length]});
                    }

                    if(!this.socials.find(item => item.type === socialClassification)){
                        this.socials.push({type: socialClassification, active: true, iconUrl: this.icons[this.socials.length]});
                    }

                    let witch = {
                        id: item.item.value,
                        location: detentionLocation,
                        name: item.itemLabel.value,
                        link: 'http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.accusedrecord&accusedref=' + item.link.value + '&search_string=lastname',
                        longLat: detentionLocationCoords,
                        sex: sex,
                        occupation: occupation,
                        socialClassification: socialClassification,
                        wikiPage: wikiPage,
                        hasWikiPage: wikiPage === '' ? 'no wiki' : 'has wiki',
                        residence: residence,
                        residenceCoords: residenceCoords,
                        placeOfDeath: placeOfDeath,
                        placeOfDeathCoords: placeOfDeathCoords,
                        mannerOfDeath: mannerOfDeath,
                        detentionLocation: detentionLocation,
                        detentionLocationCoords: detentionLocationCoords,
                    }

                    this.addWitchToMarkers(witch);
                }
                
                this.originalMarkers = JSON.parse(JSON.stringify( this.markers ));
            });


        },
        addWitchToMarkers: function( witch ){
            // find marker for current location so you can add witch
            let marker = this.markers.find( marker => {
                return marker.location === witch.location;
            });

            // if a marker exists for the witche's location add the witch to it. if not create a new marker for the location and add the witch.
            if(marker){
                marker.witches.push(witch);
            } else {
                let marker = {
                    location: witch.location,
                    longLat: witch.longLat,
                    witches: [witch],
                }

                this.markers.push(marker);
            }
        },
        filterMarkers : function(){
            let markers = JSON.parse(JSON.stringify( this.originalMarkers));
            let layerCollection = this[this.currentLayer.id];
            for (let i = 0; i < layerCollection.length; i++) {
                if (layerCollection[i].active === false) {
                    markers.forEach(marker => {
                        marker.witches = marker.witches.filter(witch => layerCollection[i].type !== witch[this.currentLayer.property]);
                    });
                }
            }

            this.markers = markers;
        },
        hasWikiEntry : function( marker ){
            let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
            return witchesWithEntry.length > 0;
        },
        getItemWikiPage : function( item ){
            let wikiPage = '';

            for(let i = 0; i < this.wikiPages.length; i++){
                if(this.wikiPages[i].id === item.item.value){
                    wikiPage = this.wikiPages[i].pageTitle;
                    wikiPage.split(' ').join('_');
                    wikiPage = 'https://en.wikipedia.org/wiki/' + wikiPage;
                }
            }

            return wikiPage;
        },
        getIcon : function( marker ) {
            let layerCollection = this[this.currentLayer.id];
            let type = this.getMarkerType( marker, layerCollection, this.currentLayer.property );
            let iconUrl = '';

            if( type === 'mixed' ) {
                iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
            } else {
                let item = layerCollection.find( item => item.type === type );
                iconUrl = item.iconUrl;
            }

            return iconUrl;
        },
        getMarkerType : function( marker, layerCollection, property) {
            let type = '';
            let noDifferntTypes = 0;
            for(let i = 0; i < layerCollection.length; i++){
                let witches = marker.witches.filter( witch => {
                    return witch[property] === layerCollection[i].type;
                });

                if(witches.length > 0){
                    type = layerCollection[i].type;
                    noDifferntTypes++;
                }

                if(noDifferntTypes > 1){
                    return 'mixed';
                }
            }

            return type;
        },
        filterTiles : function( tile ){
            this.currentTileName = tile.name;
            this.url = tile.url;
        },
        filterLayers : function( layer ){
            this.currentLayer = layer;
            this.filterMarkers();
        },
        flyTo : function( coords ){
            this.$refs.myMap.mapObject.flyTo(coords ,18);
        }
    },
    computed : {
        activeMarkers : function() {
            return this.markers.filter(function(marker) {
                return marker.witches.length > 0;
            });
        },
        iconAnchor : function() {
            return [11, 41];
        },
        shadowUrl : function() {
            return 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';
        }
    },
    mounted: function() {
        this.loadWikiEntries();
        //this.loadAccussed();
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
    top: 0;
    left: 0;
    z-index: -1;
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


</style>