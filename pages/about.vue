<template>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
        <h1 class="text-sm md:text-xl lg:text-2xl mb-3">About The Project</h1>
        <p class="mb-3"><b class="font-bold">Background to the project</b></p> 
        <p class="mb-3">The Data and Visualisation internship project at the University of Edinburgh had as its core aim to geographically locate and visualise the different locations recorded within the Survey of Scottish Witchcraft Database.</p>
        <p class="mb-3"><b class="font-bold">Teaching data science with ‘real-world’ datasets</b></p> 
        <p class="mb-3">In 2017, Anne-Marie Scott, Deputy Director of Learning, Teaching and Web Services at the University of Edinburgh, suggested that if course leaders on the Data Science for Design MSc were looking for students to learn about data science from working with a ‘real-world’ datasets as part of their annual ‘Data Fair’ then the much-loved (but relatively static) Survey of Scottish Witchcraft database would be an ideal dataset.</p> 
        <p class="mb-3">During the 2017/2018 and 2018/2019 course programme, the University of Edinburgh’s Wikimedian in Residence, Ewan McAndrew, supported Data Science for Design MSc students to surface selected data from the original MS Access database to Wikipedia’s sister project, Wikidata, as structured, machine-readable, linked open data. The success of this project, and the engaging visualisations created as a result, made the case that an internship dedicated to geographically locating the places recorded in the database as linked open data would be the next logical step.</p>
        <p class="mb-3">Emma Carroll, a Geology and Physical Geography undergraduate student, was recruited in May 2019 as the new Data and Visualisation intern, or ‘Witchfinder General’, as part of a three month long Equate Scotland internship.</p> 
        <p class="mb-3"><b class="font-bold">The ‘Witchfinder General’ internship (June to September 2019)</b></p> 
        <p class="mb-3">The bulk of the project work undertaken by Emma was to geographically locate the residence location of these accused witches. There were locations recorded within the dataset for 3141 different accused witches and from these locations there were 822 different place-names. The places of residence which were correctly identified were to be recorded onto each accused witches’ Wikidata page. Wikidata is a sister project of Wikipedia which acts as a hub of structured and machine-readable linked open data. By adding the place of residence to the accused witches’ Wikidata page, it would allow for these places to later be queried using the Wikidata Query Service and then downloaded in different formats to then be visualised.</p> 
        <p class="mb-3">Some of these place-names were already recorded on Wikidata with coordinates however, there were around 500 place-names which were still to be located and added to Wikidata. The unfound place-names were then located using a variety of different sources mainly: Ordnance Survey 1890-1913 maps, place-name books, historical maps, gazetteers and recorded records (see reference section). Once the place-name were geographically identified, a Wikidata page was created for this settlement with coordinate points and then added to the accused witch as their place of residence.</p> 
        <p class="mb-3">However, the issue with using many of these historical resources, is that the majority of these sources were recorded over 200 years after the recording of the witchcraft records. Therefore, many of the locations could have been abandoned or renamed over these years. Consequently, to locate the last few places recorded within the dataset, help from different place-name and history researchers was needed.</p> 
        <p class="mb-3">As a result, there was a place of residence recorded onto each accused witches’ Wikidata page which could then be queried for. Geographical information such as trial location, place of detainment and place of death locations were also added onto the accused witches’ Wikidata pages using the open source software, OpenRefine. There were also other properties added for the accused witches from their charge to inhumane treatment type to build a strong Wikidata page for each accused witch which is displayed for each accused witch on the website maps.</p>
        <p class="mb-3">The uploaded data could then be directly queried for using the Wikidata Query Service and geographically projected onto a map using Leaflet or downloaded into a CSV file and uploaded onto ArcGIS Online. The geographical data was used to create a variety of different visualisations.</p> 
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

<style>


</style>