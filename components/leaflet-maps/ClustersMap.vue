<template>
  <l-map class="w-full h-full z-0 absolute" :zoom="zoom" :center="center" 
         :options="{zoomControl: false}" ref="myMap">

    <l-control-zoom position="bottomright"></l-control-zoom>
    <l-tile-layer :url="baseMapUrl" :attribution="attribution"></l-tile-layer>
    
    <!--historic layer-->
    <div v-if="mapUrl.startsWith('https://mapseries')">
      <l-tile-layer :url="mapUrl" :attribution="attribution"></l-tile-layer>
    </div>

    <!--markers-->
    <v-marker-cluster ref="clusterRef" :options="clusterOptions">
      
      <l-marker v-for="(marker, index) in mapMarkers" :key="index" :lat-lng="marker.longLat">
        <l-popup class="adapted-popup">
          <h2>{{marker.location}}</h2><br>
          <div :class="marker.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'">
            <div v-for="(witch, index) in marker.witches" :key="index">

              <div class="font-semibold text-base">{{ witch.name }}</div><br>
              <div>
                <b>Investigation Date:</b> {{ getJulianDate(witch.investigationDates[1],witch.name) }}<br>
              </div>

              <div v-for="standardAttribute in getStandardAttributesWithValue(witch)">
                <b>{{standardAttributeLabels[standardAttribute]}}:</b>
                {{ witch[standardAttribute] }}
                <br>
              </div>

              <div v-for="locationOption in getLocationsWithValue(witch)">
                <b>{{locationsLabels[locationOption]}}:</b>
                  <template v-for="(subLocation, index) in witch[locationOption].locations">
                    <a @click="flyTo(witch[locationOption].coordinates[index])" :style="{ cursor: 'pointer'}">{{ subLocation }}
                    </a>
                    <template v-if="index < witch[locationOption].locations.length - 1">, </template>
                  </template>
                <br>
              </div>

              

              <div v-for="optionalAttribute in getOptionalsWithValue(witch)">
                <b>{{optionalsLabels[optionalAttribute]}}:</b>
                <template v-for="(subAtribute, index) in witch[optionalAttribute]">
                   {{ subAtribute.toLowerCase() }}<template v-if="index < witch[optionalAttribute].length - 1">,</template>
                </template>
                <br>
              </div>

              <div v-if="witch.mannerOfDeath !== ''">
                <b>Manner of Death:</b> {{ witch.mannerOfDeath }}<br>
              </div>
              <div v-if="witch.wikiPage !== ''">
                <a :href="witch.wikiPage" target="_blank">
                  View Wiki Page
                </a><br>
              </div>
              <a :href="witch.link" target="_blank">More Info</a><br><br>
            </div>
          </div>
        </l-popup>

        <l-icon :icon-anchor="iconAnchor">
          <div class="icon-wrapper">
            <div v-if="marker.witches.length > 1" class="icon-text">
              {{marker.witches.length}}
            </div>
            <img :src="marker.markerIcon" class="zoomed-in-img" />
            <img class="icon-shadow" :src="shadowUrl" />
          </div>
        </l-icon>

      </l-marker>
    </v-marker-cluster>
  </l-map>
</template>

<script>
 export default {
   props: {
     mapMarkers: {
       type: Array,
       required: true
     },
     mapUrl: {
       type: String,
       required: true
     },
     center: {
       type: Array,
       required: true
     },
     zoom: {
       type: Number,
       requried: true
     }
   },
   data () {
     return {
       baseMapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
       attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, James Dorret 1750 from the <a href="https://maps.nls.uk/geo/explore/#zoom=6.6&lat=57.29330&lon=-5.04553&layers=125140579&b=1">NLS Maps API</a>',
       clusterOptions: {
         iconCreateFunction: function (cluster) {
           var iconHtml = '<img class="cluster-img" src="/images/witches-cluster-composite-yellow.png">';
           return L.divIcon({ html: iconHtml,
                              className: 'mycluster',
                              iconSize: null});
         },
         disableClusteringAtZoom : 12,
         spiderfyOnMaxZoom: false
       },
       locationOptions: ["residence", "detention", "placeOfDeath"],
       locationsLabels: {
         residence: "Residence",
         detention: "Detention",
         placeOfDeath: "Place of Death"
       },
       standardAttributes:["sex","occupation","socialClass"],
       standardAttributeLabels:{
        sex: "Gender",
        occupation: "Occupation",
        socialClass: "Social Class"
      },
       optionalAttributes: [
        "demonicPact", "propertyDamage", "meetingsInfo", "meetingsPlaces",
        "shapeshifting", "ritualObjects", 'primary', 'secondary'
       ],
       optionalsLabels: {
         demonicPact: "Alleged Pacts with the devil",
         propertyDamage: "Alleged Property Damage",
         meetingsPlaces: "Alleged meetings places",
         meetingsInfo: "Alleged nature of meetings",
         shapeshifting: "Alleged shapeshifting",
         ritualObjects: "Alleged ritual objects",
         primary: "Primary Characteristics",
         secondary: "Secondary Characteristics"
       }
     }
   },
   methods: {
     hasWikiEntry: function (marker){
       let witchesWithEntry = marker.witches.filter( witch => witch.wikiPage !== '');
       return witchesWithEntry.length > 0;
     },
     flyTo: function (coords){
       this.$refs.myMap.mapObject.flyTo(coords ,14);
     },
     emitMapData: function () {
       // Emmits an object containing the information about
       // where the center of the map is, the zoom, and what 
       // map type to change to when the map is turned off,
       // in this case changing to clustersOff.

       let centerInfo = this.$refs.myMap.mapObject.getCenter();
       let centerArray = [centerInfo.lat, centerInfo.lng];
       let changeInfo = {
         center: centerArray,
         zoom: this.$refs.myMap.mapObject.getZoom(),
         changeTo: "clustersOff"
       };
       this.$emit("changeMaps", changeInfo);
     },
     getLocationsWithValue: function (witch) {
       let locationsWithValue = []

       this.locationOptions.map(option => {
         if (witch[option].locations.length !== 0) {
           locationsWithValue.push(option);
         }
       })

       return locationsWithValue
     },
     getStandardAttributesWithValue: function (witch) {
       let standardAttributesWithValue = [];

       this.standardAttributes.map(option => {
         if (witch[option] !== "unknown") {
           standardAttributesWithValue.push(option);
         }
       })

       return standardAttributesWithValue
     },
     getOptionalsWithValue: function (witch) {
       let optionalsWithValue = [];

       this.optionalAttributes.map(option => {
         if (witch.hasOwnProperty(option) && witch[option][0] !== "unknown") {
           optionalsWithValue.push(option);
         }
       })

       return optionalsWithValue
     },
     getJulianDate: function (date,name){
      // these witches shouldn't be converted because there full date isn't known, they will appear as "01/01/1632" which just means the year 1632, so therefore if converted would give the wrong date
      const noconversion = ["Thom Cockburn","Jonat Drummond","Archie Farquhars","Margaret Jo","Jonet Fairlie","Ane Nairn","Marion Ranking","Katherine Muirhead","Andrew Abel","Helen Widdrow","Husband of Elizabeth Rennie","Elizabeth Lawsone","Issobell Ritchardsone","Agnes Murray","Jeane Deanes","Begis Bathcat","Euphame Haliburton","Marion Hutson","Issobell Hutson","George Hutson","Isobel Wilson","Elspeth Baillie","Helene Deanes","Issobell Cairnes","Helen Sharpe","Adam Harlaw","Jonet Wast","Margaret Keltie","Marioun Tailyeor","Adam Robertson","Margaret Kinard","Margaret Fyfe","Elizabeth Dempster","Brand","Agnes Drysdale","Margaret Beveridge","Agnes Beveridge","Christian Young","Margaret McNish","Margaret Lauder","Margaret Young","Christian Crieff","Isabel Condie","Janet Hird","Agnes Sharp","Gilleis Hutton","Elspet Alexander","Agnes Allene","Helen Alexander","Mary Rynd","Jonet Mathie","Mary Mitchell","John Gray","Janet McNair","Thomas Mitchell","Marion Phin","McQuicken","McRorie","Donald Moir","John Lindsay","Agnes Chisolm","Agnes Urich","Janet Walker","Issobel Bairdie","Agnes Gourlay","Janet Castell","Robert Bruce","Janet Galloway","Thomas Humbell","Issobel Fordell","Agnes Gaston","Jonet Birnie","Janet Anderson","Maggy Osborne","Marion Mackbeath","Margaret Cant","Elspeth Craiche","Effie Rosie","John Wauch","Jonet Anderson","John Tailzour","Janet Huit","Margaret Duff","Jonat nein giblie Gow","Margaret Tamsone","Janet Finnie","James McPhee","Janet Conochie","Meggie Cowie","Goodaile","Elspet Smith","Agnes Mor Nin Vick Eanglaish","Isabel Davidson","Margaret Kirkwood","Ann Nin William","Elspeth Kirkland","Marion Purdie","Helen Eliot","William Easone","William Simpson","Marion Dickson","Isobel Dickson","Marion Herbertson","Margaret Laird","Marion Lillie","Margaret Polwart","Alison Nisbet","Jean Hart","Jonnet Buttar","Ellen King","Barbara Tulloch","Agnes Fergusson","Neville","Helen Andrew","Jannet Pyper","Margaret Oisone","Margaret Nin Gilbert","Margaret Drummond","Janet Horne","William Stewart","Patrick Macgueire","Katherine Fergus","Jonat Davidsone","Issobell Oige","Helene Makkie","John Wilson","Janet Smyth","Margaret Atkin","Janet Allane","William Murray","Nicole","Jon Bayne","Elspet Cant","Gelis Gray","Malcome Toir","Kathrene Smyth","George Semple","Issobell Johnestowne","Agnes Anstruther","Catherine McNiven","Geordie Archobald","Helen Wallas","Bessie Finlaysoune","Marion Marnow","Agnes Meldrum","Bessie Archer","Janet Weill","Issobell Monro","Susanna Chancelar","Robert Simpson","James Hall","Thomas Murray","Issobell Traye","Agnes Nemo","Tibbie Smart","Graham","Katherine Kerse","Malie Macwatt","Isabel Cuthbertson","Gilbert Robisone","Lillias Bertram","Agnes Muircone","Katherine Mitchell","Marion Fisher","Agnes Robert","Margaret Balfour","Bessie Carnochan","Kathren Wallace","Janet Anderson","Grissel Morris","Margaret Brand","Katherine Elder","Agnes Kirk","Margaret Donaldson","Isobel Miller","Agnes Wallace","Jonet Tulloch","Agnes Muresone","Christian Roch","Janet Bruce","Margaret Ramsay","Bessie Mason","Marion Ramsay","Rosina McCoskrie","(wife of John) McNaught","Margaret Sinclair","Margaret Clerk","Janet McGoane","Janet Mowbray","Margaret Brown","Catherin Thompson","Marion Dauline","Marion Stein","Seweis","Marg Donald","Parker","William Chrictoun","Isabell Peacock","Isobel Gairdner","Janet Thomson","Janet Brown","James Henrison","Marion Henrison","Isobel Thompson","Jonet Bennet","Marione McNab","Maly Purdie","Murray","Marg Robisone","Jean Campbell","Barbara Milne","Margaret Carvie","Barbara Horniman","John Rind","Ketheren Portour","Agnes Sparke","Isobell Shyrie","Bessie Croket","George Patersone","Meg Lawson","Janet McRobert","Elizabeth Dick","Molly Redmond","Tonderghee","Grissel Anderson","Robert Bainzie","Euphan Stirt","Janet McMurray","Anna Wood","Elspeth Williamson","Lillias Adie","White","Mary Wilson","Janet Whyte","Mary McNarin","Mary Stewart","John McNairn","Alexander Deuart","Kathrine Taylor","Isobel Anderson","Margaret Ogilvy","Sarah Johnson","M'huistan","Margaret Callum","Isbell Dairsie","Christine Dote","Margaret Myrton","Agnes Anstruther","Marioun Tailzeour","Geillis Gray","Maggie","wife of William Barton","Margaret Patoune","Margaret Laurymer","Janet Tucidie","Janet Allane","Janet Bowis","Effie Pothif","wife of Robert Wir","Janet Coldane","Janet Robison","Elspeth Chib","Bessie Nicoson","Margaret Waldon","Marin Coran","Agnes Williamsone","Helen Reid","Patrick Meikle","Margaret Blak","John Homme","Janet Pook","Issobell Cathie","Susanna Bannytyne","Christian Blaik","Jonnet Kempe","Anna Pilmure","Marion Blaik","Jeane Martin","Jean Kerse","Janet Symson","Bessie Lamb","Jon Russell","Jon Lyll","wife of Thomas Hay","Marion Cumming","George Binnie","George Lacost","Helen Nicolson","David Schankis","Neving","Thomas Weir","Cristian Brake","James Anderson","Janet Anderson","Jeane Laying","James Beverley","Grissel McIlney","Bessie Paine","Margaret McGuffock","Grissell Rae","Jonet Howat","Janet Robertson","Jonet Losk","Hopkin","Janet Fisher","Helen Wilson","Joan Graham","Marion McRae","Issabell Reid","Catharin Lorimer","Jean Gray","Jennet Broun","John Black","Margaret Wilkin","John Glass","John Paterson","Jean Woodrow","Elspeth Rule","Christian Bonn","Geddoch McAlester Boyne","Bornlie","Gilbert Mowat","Patrick Barnett","Bessie Andro","Agnes Gune","Jonet Dow","Marshall Sutherland","Adam Barnie","Marione Kenock","John Harper","William McAngus","Thomas Mrgillie Lukell","Margaret Nakoch","Gretchach Unchach","Henrie Lyell","Donald McChereich","Jean Rutherd","Elspeth Chousley","Christian Wilkieson","Katie","Margaret Hay","Isobel Insh","Johne Young","Charles Wat","Janet Campbell","Margaret Nidrie","Margaret Dalgleish","Margaret Garvie","Barbara Honeyman","Jonet Hood","James Og","Elspet Strachund","Christiane Arcly","George Milton","Agnes Nevie","Margrat NcWilliam","wife of Wilsone","Katherine Gilmore","Issobell Pain","Marion Wood","James Jervie","Jonet Mackley","Agnes Baxter","wife of Alexander Aitkin","Mathew Connell","Mareoun","Scota Bess","Margaret Wick","Eupham Wright","Adam Donaldson","Jonet Durie","Elspeth Durie","Agnes Anderson","Issobell Davidson","Bessie Dock","Euphame Henderson","Agnes Mertene","Bessie Smith","Marie Dick","Margaret Gray","Margaret Lummisdane","Issobell Chrystie","Marie Broun","Helen Wood","Jonet Inglyses","Jonet Lummisdane","Issobell Oster","Beatrix Dolt","Bessie Boyd","Jonet Kennedy","wife of George Mot","Jonet Young","Bessie Bell","Janet M'Allexander","Effie McBrwme","Helen Pennant","Agnis Quhytelaw","Elizabeth Hunter","Agnes Peramorris","Geilis Feirour","Jonet Barroman","Agnes Gordoun","Bessie Ramsay","Bessie Lamb","Gelis Durye","Bessye Brodye","Maldye Sturrok","Issobell Robertsoun","Jonet Gardyn","Dame Logye","Johnne Stevin","Henrye Stevin","wife of Johnne Durwart","Jonet Harbertson","Jonet Newton","Cristiane Twych","Betie Wobster","Jonet Duncane","Katherine Cusing","Issobell Sutye","Law","Fischearis Docter","James Ochterlonyes","Margaret Mowbray","Dowglass","Cristeane Incheot","Lyvelyke","James Kilgour","Effie Roger","Cristeane Johnnestoun","Jonet Curchan","James Chalmer","Catherine Campbell","Cristeane Jak"];
      
      if (noconversion.includes(name)){
        return date; //return same date if in noconversion
      }
      let [day, month, year] = date.split('/');
      day = Number(day);
      month = Number(month)
      year = Number(year);
      let currentDate = new Date(year, month - 1, day);
      let earlierDate = new Date(currentDate);
      const cutoffDate = new Date(1700,3,1)

      if (currentDate < cutoffDate) {
        earlierDate.setDate(currentDate.getDate()-10);
      }
      else {
        earlierDate.setDate(currentDate.getDate()-11);
      }

      const earlierDateString =
        `${earlierDate.getDate().toString().padStart(2, '0')}/` +
        `${(earlierDate.getMonth() + 1).toString().padStart(2, '0')}/` +
        `${earlierDate.getFullYear()}`;

      return earlierDateString;
     }
   },
   computed: {
     iconAnchor : function () {
       return [11, 41];
     },
     shadowUrl : function () {
       return '/images/North-Berwick-witch-shadow.png';
     }
   },
   beforeDestroy: function () {
     this.emitMapData();
   }
 }
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
</style>
