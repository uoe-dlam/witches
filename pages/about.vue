<template>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
        <h1 class="text-sm md:text-xl lg:text-2xl mb-3">About The Project</h1>
        <p class="mb-3">This project has been working towards geographically locating the residence location of each accused witch recorded within the Survey of Scottish Witchcraft Database. The database has residence locations recorded for 3140 different accused witches dating from 1563-1736. There were a total of 822 different place-names recorded for the residence of the accused witches with 500 place-names which had yet to be recorded as place-names on Wikidata.</p> 
        <p class="mb-3">Over the course of a three month Equate Scotland internship, these place-names were able to be located using a variety of different sources from Ordnance Survey maps to place-name books. There is a blog page and reference list for the project which provide detailed information on the place-finding process. By the end of the project, the place-names were geographically located for all of the locations apart from 25 places which are recorded as ‘County of ….’.</p>  
        <p class="mb-3">Wikidata was used to connect each identified geographical location with the accused witch making the dataset open-source and publically downloadable for further data analysis.</p> 
        <p class="mb-3">Once the places of residence were identified, the location of trials, detainment and death were also located for each of the accused witches. These datasets were far smaller and mostly recorded as larger settlements which made these datasets far easier to locate making these datasets completely identified. There was also other information taken from the Survey of Scottish Witchcraft database such as gender and occupation which were also upload to Wikidata to help build more of fact file for each accused witch</p> 
        <p class="mb-3">The dataset could then be visualised on maps using ArcGIS Online and Leaflet to create these interactive maps which visualise the data in a variety of ways.</p>
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