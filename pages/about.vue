<template>
  <div id="main-content" class="text-wrapper" style="width:100%">
    <h1 class="text-center text-2xl md:text-3xl lg:text-4xl mb-6">About The Project</h1>
    <p class="mb-3"><span class="font-medium">Please Note: </span>This is a first attempt to geolocate this data. We have consulted a number of historical sources to locate places that have variant spellings in the records or that have since disappeared. We appreciate all feedback and will incorporate it into future iterations of the map. <a class="underline hover:text-gray-500" href="https://blogs.ed.ac.uk/witchcraft_visualisation/week-3-time-travel-through-scotland-in-search-of-the-missing-locations/" target="_blank">Read more about how we went about geo locating some of this information</a>.</p>
    <p class="mt-6 mb-3 text-lg md:text-xl lg:text-xl font-medium">Background to the project</p>
    <p class="mb-3">The Data and Visualisation internship project at the University of Edinburgh had as its core aim to geographically locate and visualise the different locations recorded within the Survey of Scottish Witchcraft Database - <a class="underline hover:text-gray-500" href="http://www.shca.ed.ac.uk/witches/" target="_blank">http://www.shca.ed.ac.uk/witches</a>.</p>
    <p class="mb-3">You can read an excellent summary of the project to date on Anne-Marie Scott's blog here: <a class="underline hover:text-gray-500" href="https://ammienoot.com/brain-fluff/some-witchy-history-and-a-very-smart-woman-in-data-science/" target="_blank">Some witchy history and a very smart woman in data science</a></p>
    <p class="mt-6 mb-3 text-lg md:text-xl lg:text-xl font-medium">Teaching data science with ‘real-world’ datasets</p>
    <p class="mb-3">In 2017, Anne-Marie Scott, Deputy Director of Learning, Teaching and Web Services at the University of Edinburgh, suggested that if course leaders on the Data Science for Design MSc were looking for students to learn about data science from working with a ‘real-world’ datasets as part of their annual ‘Data Fair’ then the much-loved (but relatively static) Survey of Scottish Witchcraft database would be an ideal dataset.</p>
    <div class="paragraph-container">
      <div class="text">
        <p class="mb-3">During the 2017/2018 and 2018/2019 course programme, the University of Edinburgh’s Wikimedian in Residence, Ewan McAndrew, supported Data Science for Design MSc students to surface selected data from the original MS Access database to Wikipedia’s sister project, Wikidata, as structured, machine-readable, linked open data. The success of this project, and the engaging visualisations created as a result, made the case that an internship dedicated to geographically locating the places recorded in the database as linked open data would be the next logical step.</p>
      </div>
      <div class="image">
        <img src="~/static/images/data-science.png">
        <p class="text-xs text-center"> Data Science for Design MSc students with thier project. CC-BY-SA 4.0</p>
      </div>
    </div>
    <p class="mb-3">Emma Carroll, a Geology and Physical Geography undergraduate student, was recruited in May 2019 as the new Data and Visualisation intern, or ‘Witchfinder General’, as part of a three month long Equate Scotland internship.</p>
    <p class="mt-6 mb-3 text-lg md:text-xl lg:text-xl font-medium">The ‘Witchfinder General’ Internship</p>
    <p class="mt-6 mb-3 text-md md:text-gl lg:text-lg font-medium">Emma Carroll (June to September 2019)</p>
    <div class="paragraph-container">
      <div class="text" style="width:calc(60% - 20px)">
        <p class="mb-3">The bulk of the project work undertaken by Emma was to geographically locate the residence location of these accused witches. There were locations recorded within the dataset for 3141 different accused witches and from these locations there were 822 different place-names. The places of residence which were correctly identified were to be recorded onto each accused witches’ Wikidata page. Wikidata is a sister project of Wikipedia which acts as a hub of structured and machine-readable linked open data. By adding the place of residence to the accused witches’ Wikidata page, it would allow for these places to later be queried using the Wikidata Query Service and then downloaded in different formats to then be visualised.</p>
      </div>
      <div class="image" style="width:calc(40% - 20px)">
        <img src="~/static/images/emma.png">
        <p class="text-xs text-center"> Emma Carrol locating the accused witches residencies. CC-BY-SA 4.0</p>
      </div>
    </div>
    <p class="mb-3">Some of these place-names were already recorded on Wikidata with coordinates however, there were around 500 place-names which were still to be located and added to Wikidata. The unfound place-names were then located using a variety of different sources mainly: Ordnance Survey 1890-1913 maps, place-name books, historical maps, gazetteers and recorded records (see reference section). Once the place-name were geographically identified, a Wikidata page was created for this settlement with coordinate points and then added to the accused witch as their place of residence.</p>
    <div class="paragraph-container">
      <div class="text">
        <p class="mb-3">However, the issue with using many of these historical resources, is that the majority of these sources were recorded over 200 years after the recording of the witchcraft records. Therefore, many of the locations could have been abandoned or renamed over these years. Consequently, to locate the last few places recorded within the dataset, help from different place-name and history researchers was needed.</p>
      </div>
      <div class="image">
        <img src="~/static/images/emma-map.png">
        <p class="text-xs text-center"> Emma Carrol exploring collectins at the National Library of Scotland. CC-BY-SA 4.0</p>
      </div>
    </div>
    <p class="mb-3">As a result, there was a place of residence recorded onto each accused witches’ Wikidata page which could then be queried for. Geographical information such as trial location, place of detainment and place of death locations were also added onto the accused witches’ Wikidata pages using the open source software, OpenRefine. There were also other properties added for the accused witches from their charge to inhumane treatment type to build a strong Wikidata page for each accused witch which is displayed for each accused witch on the website maps.</p>
    <p class="mb-3">The uploaded data could then be directly queried for using the Wikidata Query Service and geographically projected onto a map using Leaflet or downloaded into a CSV file and uploaded onto ArcGIS Online. The geographical data was used to create a variety of different visualisations.</p>
    <div>
    <div style="display: flex; justify-content: center;">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/j3Hf4lTHJj4?si=qiMt9Z8em4LnkCUe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <p class="text-xs text-center"> Emma Carrol giving a TEDx Talk at the University of St Andrews</p>
   </div>
    <p class="mt-6 mb-3 text-md md:text-gl lg:text-lg font-medium">Richard Lawson (June 2019 to October 2023)</p>
    <p class="mb-3">Emma was supported by Learning, Teaching & Web colleagues to embed her visualisations in a newly created University of Edinburgh website. Richard Lawson, a Software Developer with over 15 years’ experience developing for the web had been with us since 2016. Richard was the person most responsible for creating this website and for always giving his time generously to Emma and to this project; to support student learning within the University and to support understanding about the Scottish witch trials globally. He taught himself within two weeks how to work with an unfamiliar platform and achieved the remarkable in always using his considerable technical expertise to solve any issue we had in creating the site and helping put these persecuted women on the map. Richard supported all subsequent ‘Witchfinder General’: Data Visualisation student interns and always with kindness, humility and a gentle humour. He died suddenly on 10 October 2023 and this site is a tribute to his brilliance and commitment to the project and we dedicate it to his memory.</p>
    <p class="mt-6 mb-3 text-md md:text-gl lg:text-lg font-medium">Maggie Lin (June to September 2022)</p>
    <div class="paragraph-container">
      <div class="text" style="width:calc(60% - 20px)">
        <p class="mb-3">4th year Computer Science student, Maggie Lin, was employed as our second ‘Witchfinder General’: Data Visualisation intern and worked incredibly hard to help illuminate what happened in the Scottish witchhunts of 1563 to 1736 by focusing on opening up the rich historical data in the Survey of Scottish Witchcraft database and turning it into linked open data, creating user-friendly web visualisations with her developer colleague Josep Garcia-Reyero (also an undergrad student). </p>
        <p class="mb-3">Maggie’s focus was on the hitherto unexplored temporal data and the all the rich information on the witchcraft investigations, which encompassed the initial or supposed denunciation, the arrest, the investigation, the trial, and its aftermath.  She focused especially on all the different accusations: who named/denounced who, what occurred in the supposed witches’ meetings, the ritual objects used, accusations of shapechanging and much more. By working round the clock to turn this data into something parseable she created timelines, network analyses of who named who, helped show how the hysteria spread in space and time during panic and non panic periods and even investigated accusations of demonology and attended a symposium on such. She presented on her work at the Edinburgh Book Festival 2022 before the Jenni Fagan book event, Hex, and has contributed blog articles documenting her work and recorded a podcast interview.</p>
      </div>
      <div class="image" style="width:calc(40% - 20px)">
        <img src="~/static/images/Maggie.png">
        <p class="text-xs text-center"> Maggie Lin displaying the map of accuesed witches. CC-BY-SA 4.0</p>
      </div>
    </div>
    <p class="mt-6 mb-3 text-md md:text-gl lg:text-lg font-medium">Josep Garcia-Reyero (June to September 2023)</p>
    <p class="mb-3">Josep worked as our Open Source Web Developer intern and had a close collaboration with Maggie Lin to embed her new visualisations in the website by the end of the Summer</p>
    <p class="mb-3">His goals were:</p>
    <div class="paragraph-container">
      <div class="text">
        <ul class="mb-3">
          <li>To update the software packages and re-factor the site code.</li>
          <li>Improve the site functionality, accessibility and user interface.</li>
          <li>Added a group clusters on/off button on the map.</li>
          <li>Allow filtering on multiple filter options at a time and move the filters to the left hand side of the screen to allow more space for the map.</li>
          <li>Add a new customizable and more responsive timeline of witchcraft investigations which can be filtered to search for ‘witchcraft panic’ periods and ‘non-panic’ periods.</li>
          <li>Add Maggie’s new visualisations including: filters for accusations of shape-shifting, demonic pacts, property damage, ritual objects used, witches’ meetings, a network analysis of who named/denounced who and an interactive Histropedia timeline that is searchable by name of accused.</li>
        </ul>
      </div>
      <div class="image">
        <img src="~/static/images/josep.png">
        <p class="text-xs text-center">Josep Garcia-Reyero working on the website. CC-BY-SA 4.0 </p>
      </div>
    </div>
    <p class="mt-6 mb-3 text-md md:text-gl lg:text-lg font-medium">Claire Panella (February to May 2023)</p>
    <div class="paragraph-container">
      <div class="text" style="width:calc(65% - 20px)">
        <p class="mb-3">Claire Panella worked as the Scottish Witchhunter intern for 1 day a week from February to May 2023. During this time she created and documented a robust and reusable quality assurance process (using RStudio) for the data behind our website so that we could compare the original 2003 Survey of Scottish Witchcraft data with the data shared to Wikidata since 2017 to check for any data anomalies.</p>
      </div>
      <div class="image" style="width:calc(35% - 20px)">
        <img src="~/static/images/claire.png">
        <p class="text-xs text-center">Claire Panella developing a quality assurace process. CC-BY-SA 4.0 </p>
      </div>
    </div>
    <p class="mt-6 mb-3 text-md md:text-gl lg:text-lg font-medium">Ruby Imrie (June to September 2023 (and ongoing))</p>
    <div class="paragraph-container">
      <div class="text">
        <p class="mb-3">Ruby has been quality checking and consistency checking the data using newly developed quality assurance methods in R Studio created by another student intern, Claire Panella, earlier this year that can be reused for many years to come. Ruby’s other focus has been on taking the extremely rich) data Maggie Lin added on all the 3,816 full witchcraft investigations recorded in Scotland from 1563-1736 and embedding those new interactive visualisations on our Map of Accused Witches in Scotland website using a Javascript and the Vue.js framework. By also identifying and addressing bug fixes, conducting rigorous user testing sessions and using the feedback received to address areas for site improvement and action planning for developing new features she has helped to show how the data, and the individual human stories behind the data, can be better visualised, explored and interrogated as never before.</p>
      </div>
      <div class="image">
        <img src="~/static/images/ruby-julian.png">
        <p class="text-xs text-center">Ruby Imrie with Professor Julian Goodare. CC-BY-SA 4.0 </p>
      </div> 
    </div>
</div>
</template>

<script>


 export default {
   data: () => ({

   }),
   methods: {

   },
   computed : {

   },
   mounted: function() {
   },
   layout: 'basic'
 };
</script>

<style scoped>
.custom-margin {
  margin-left: 8%;
  margin-right: 8%;
}

.paragraph-container {
            overflow: hidden; 
        }

  .text {
      float: left; 
      width: calc(70% - 20px);
      margin-right: 20px;
  }

  .image {
      float: right; 
      width: calc(30% - 20px);
      margin-left: 20px;
      
  }

  @media screen and (max-width: 767px) {
  .paragraph-container {
    display: block; 
    margin-bottom: 20px; 
  }

  .text,
  .image {
    width: 80%; 
    float: none; 
    margin: 0; 
  }

  .image {
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}

  ul {
  list-style-type: disc; 
  padding-left:20px;
}

</style>
