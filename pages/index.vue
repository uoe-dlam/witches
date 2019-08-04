<template>
    <div id="outer">
        <br>
        <div id="map-filters">
            <div>
                <span v-for="(tile, index) in tiles">
                    <input type="radio" name="tile" :checked="tile.name === currentTileName" @change="filterTiles(tile)"/>{{tile.name}}
                </span>
            </div>
            <br>
            <div>
                <span v-for="(layer, index) in layers">
                    <input type="radio" name="layer" :checked="layer.id === currentLayer.id" @change="filterLayers(layer)"/>{{layer.label}}
                </span>
            </div>
            <br>
            <div v-if="currentLayer.id === 'sexes'">
                <span v-for="(sex, index) in sexes">
                    <input type="checkbox" v-model="sex.active" @change="filterMarkers()"/><img :src="sex.iconUrl" width="12" height="20"/>{{sex.type}}
                </span>
            </div>
            <div v-if="currentLayer.id === 'occupations'">
                <span v-for="(occupation, index) in occupations">
                    <input type="checkbox" v-model="occupation.active" @change="filterMarkers()"/><img :src="occupation.iconUrl" width="12" height="20"/>{{occupation.type}}
                </span>
            </div>
            <div v-if="currentLayer.id === 'socials'">
                <span v-for="(social, index) in socials">
                    <input type="checkbox" v-model="social.active" @change="filterMarkers()"/><img :src="social.iconUrl" width="12" height="20"/>{{social.type}}
                </span>
            </div>
            <br>
        </div>
        <div id="map-wrapper">
            <no-ssr>
                <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
                    <l-tile-layer :url="url"></l-tile-layer>
                
                    <!--
                    <v-marker-cluster>
                        <l-marker v-for="(marker, index) in activeMarkers"
                                  :lat-lng="marker.longLat" :icon="getIcon(marker)">
                            <l-popup>
                                <h2>{{marker.location}}</h2>
                                <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
                                    <div v-for="(witch, index) in marker.witches">
                                        {{ witch.name }}<br>
                                        Gender: {{ witch.sex }}<br>
                                        Occupation: {{ witch.occupation }}<br>
                                        Social Class: {{ witch.socialClassification }}<br>
                                        <a :href="witch.link" target="_blank">More Info</a><br><br>
                                    </div>
                                </div>
                            </l-popup>
                        </l-marker>
                    </v-marker-cluster>
                    -->
                    
            
                    <v-marker-cluster>
                         <l-marker v-for="(marker, index) in activeMarkers"
                                      :lat-lng="marker.longLat">
                                <l-popup class="adapted-popup">
                                    <h2>{{marker.location}}</h2>
                                    <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
                                        <div v-for="(witch, index) in marker.witches">
                                            {{ witch.name }}<br>
                                            Gender: {{ witch.sex }}<br>
                                            Occupation: {{ witch.occupation }}<br>
                                            Social Class: {{ witch.socialClassification }}<br>
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
                                      <img class="shadow" :src="shadowUrl"/>
                                  </div>
                                </l-icon>
                        </l-marker>
                    </v-marker-cluster>
                   
                   
                </l-map>
            </no-ssr>
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
        wikiPages: [],
        markers: [],
        originalMarkers: [],
        currentTileName : 'modern map',
        tiles: [{name: 'modern map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true},{name: 'historic map', url: 'https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg', active : false}],
        layers: [{id: 'sexes', label: 'gender', property : 'sex'}, {id: 'socials', label: 'social classification', property : 'socialClassification'}, {id: 'occupations', label: 'occupations', property : 'occupation'}],
        currentLayer : {id: 'sexes', label: 'gender', property : 'sex'},
        sexes: [{type: 'male', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'},{type: 'female', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'}, {type: 'unknown', active: true, iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'}],
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
            const sparqlQuery = `#Places of residence of accused witches in Scotland 1563-1736
            SELECT ?item ?residenceLabel ?sexLabel ?coords ?itemLabel ?link ?occupationLabel ?socialClassificationLabel
            WHERE
            {
              ?item wdt:P4478 ?witch .
              ?item wdt:P551 ?residence .
              optional { ?item wdt:P21 ?sex } .
              ?residence wdt:P625 ?coords .
              ?item wdt:P4478 ?link .
              optional { ?item wdt:P106 ?occupation}
              optional { ?item wdt:P3716 ?socialClassification}
              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`;

            const queryDispatcher = new SPARQLQueryDispatcher( this.sparqlUrl );
            queryDispatcher.query( sparqlQuery ).then( result => {
                
                for (let i = 0; i < result.results.bindings.length; i++) {
                    let item = result.results.bindings[i];
                    let sex = item.hasOwnProperty('sexLabel') ? item.sexLabel.value : 'unknown';
                    let occupation = item.hasOwnProperty('occupationLabel') ? item.occupationLabel.value : 'unknown';
                    let socialClassification = item.hasOwnProperty('socialClassificationLabel') ? item.socialClassificationLabel.value : 'unknown';

                    if(!this.occupations.find(item => item.type === occupation)){
                        this.occupations.push({type: occupation, active: true, iconUrl: this.icons[this.occupations.length]});
                    }

                    if(!this.socials.find(item => item.type === socialClassification)){
                        this.socials.push({type: socialClassification, active: true, iconUrl: this.icons[this.socials.length]});
                    }
                    
                    let wikiPage = '';
                
                    for(let i = 0; i < this.wikiPages.length; i++){
                        if(this.wikiPages[i].id === item.item.value){
                            wikiPage = this.wikiPages[i].pageTitle;
                            wikiPage.split(' ').join('_');
                            wikiPage = 'https://en.wikipedia.org/wiki/' + wikiPage;
                        }
                    }

                    let witch = {
                        id: item.item.value,
                        location: item.residenceLabel.value,
                        name: item.itemLabel.value,
                        link: 'http://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.accusedrecord&accusedref=' + item.link.value + '&search_string=lastname',
                        longLat: this.convertPointToLongLatArray(item.coords.value),
                        sex: sex,
                        occupation: occupation,
                        socialClassification: socialClassification,
                        wikiPage: wikiPage
                    }

                    let marker = this.markers.find( marker => {
                        return marker.location === witch.location;
                    });

                    if(marker){
                        marker.witches.push(witch);
                    } else {
                        let marker = {
                            location: item.residenceLabel.value,
                            longLat: this.convertPointToLongLatArray(item.coords.value),
                            witches: [witch],
                        }
                        
                        this.markers.push(marker);
                    }
                }
                
                this.originalMarkers = JSON.parse(JSON.stringify( this.markers ));
            });


        },
        toggleSex : function( type ){
            let sex = this.sexes.find( sex => type === sex.type);
            sex.active = !sex.active;
            this.filterMarkers();
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
            
            /*
            L.icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            */
            
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

#outer {
  display: flex;
  flex-flow: column;
  height: 100vh;
}

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

.shadow{
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