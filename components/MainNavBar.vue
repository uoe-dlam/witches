<template>
  <div id="main-nav">
    <nav class="flex items-center justify-betweern flex-wrap bg-white pl-5 pr-5 pt-5 pb-3 w-full">
      <nuxt-link to="/">
        <div class="flex items-center mr-3" >
          <div class="mr-4">
            <h1 class="text-xl lg:text-4xl">Witches</h1>
            <span class="text-xs -mt-5">Survey of Scottish Witchcraft</span>
          </div>
          <img src="/images/witches-cluster-composite.png" alt="logo" width="90" >
          <img class="block lg:hidden" src="~/assets/img/main-logo-badge.png" alt="logo" width="75">
        </div>
      </nuxt-link>
      <div class="block lg:hidden">
        <button @click="toggle" class="flex items-center px-3 py-2 border rounded text-grey border-grey hover:text-grey hover:border-grey-dark">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>
      <div :class="open ? 'block': 'hidden'" class="w-full block flex-grow lg:flex lg:items-center lg:w-auto" style="z-index:1000">
        <div class="text-md lg:flex-grow">
          <main-nav-bar-item v-for="link in links" :url="link.url" :key="link.url" :external="link.external" :subpages="link.subpages">
            {{link.name}}
          </main-nav-bar-item>
        </div>
      </div>
      <div class="flex items-center text-white mr-6 hidden xl:block">
        <img src="~/assets/img/main-logo.png" alt="logo" width="225">
      </div>
    </nav>
    <div class="pr-12 border border-gray-200 bg-white pt-1 pb-1 text-xs w-full block float-left">
      <nuxt-link to="/accessibility-statement" class="font-sans float-right text-gray-500">Accessibility</nuxt-link>
    </div>
  </div>
</template>

<script>
 import MainNavBarItem from '~/components/MainNavBarItem.vue'

 export default {
   components: {
     MainNavBarItem
   },
   data : function(){
     return {
       open : false,
       links : [
         { name : 'Accused Witches', url : '#', external: false, subpages : [
           { name : 'Witchcraft Prosecutions In Time and Place', url: '/', external: false },
           { name : 'Timeline Search', url: '/histropedia', external: false },
           { name : 'Residences on ArcGIS Online', url : '/gismap', external: false },
           { name : 'Residences Within Each Parish', url : '/parish', external: false },
           { name : 'Death Locations', url : '/death', external: false },
           { name : 'Linking Residence to Place of Death', url : '/link', external: false },
         ] },
         { name : 'Investigations', url : '#', external: false, subpages : [
             { name: 'Case Characterisations', url: '/PrimarySecondary', external: false },
             { name: 'Witches Meetings', url: '/CaseInformation', external: false },
             { name: 'Shapeshifting and Ritual Objects', url: '/ritual', external: false },
         ] },
         { name : 'Trials', url : '#', external: false, subpages : [
             { name : 'Named Witches', url: '/flourish', external: false },
             { name : 'Detention Locations', url: '/detention', external: false },
             { name : 'Trial Locations', url: '/trials', external: false },
             { name : 'Trials in Each Modern Authority', url: '/council', external: false },
         ] },
         { name : 'People Involved', url : '#', external: false, subpages : [
           { name : 'People Associated with the Witch Trials: Residence', url : '/peopleloc', external: false },
           { name : 'People Associated with the Witch Trials: Residence and Occupation', url : '/people', external: false },
           { name : 'A Witch-Prickers Journey', url : '/john', external: false },
         ] },
         { name : 'Extra Visualisations', url : '#', external: false, subpages : [
           { name : 'Accused Witches Occupations with Unknown Values', url : '/extravisual', external: false },
           { name : 'Types of Torture at Different Residence Locations', url : '/torture', external: false },
           { name : 'The Story of Isobel Young', url : '/storymap', external: false },
           { name : 'Ordeal Bubble Chart', url : '/ordeal', external: false },
           { name : 'Social Bubble Chart', url : '/social', external: false },
         ] },
         { name : 'About', url : '#', external: false, subpages : [
           { name : 'Overview', url : '/about', external: false },
           { name : 'References', url : '/reference', external: false },
           { name : 'Resources', url : '/resources', external: false },
           { name : 'Contact', url : '/contact', external: false },
         ] },
         { name: 'Blog', url: 'https://blogs.ed.ac.uk/witchcraft_visualisation/', external: true, subpages : [] }
       ]
     }
   },
   methods: {
     toggle() {
       this.open = !this.open;
     }
   }

 }
</script>
