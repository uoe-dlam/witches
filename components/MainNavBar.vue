<template>
    <div id="main-nav">
        <nav class="flex items-center justify-between flex-wrap bg-white p-5 w-full">
          <div class="flex items-center mr-6">
              <h1 class="text-2xl sm:text-4xl mr-4">Witches</h1><img src="/images/witches-cluster-composite.png" alt="logo" width="100" >
              <img class="block lg:hidden" src="~/assets/main-logo-badge.png" alt="logo" width="75">
          </div>
          <div class="block lg:hidden">
            <button @click="toggle" class="flex items-center px-3 py-2 border rounded text-grey border-grey hover:text-grey hover:border-grey-dark">
              <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
          </div>
          <div :class="open ? 'block': 'hidden'" class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div class="text-md lg:flex-grow">
                <main-nav-bar-item v-for="link in links" :url="link.url" :key="link.url" :external="link.external" :subpages="link.subpages">
                    {{link.name}}
                </main-nav-bar-item>
            </div>
          </div>
          <div class="flex items-center text-white mr-6 hidden lg:block">
            <img src="~/assets/main-logo.png" alt="logo" width="250">
          </div>
        </nav>
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
            { name : 'Residences', url : '/', external: false, subpages : [
                { name : 'Residences on ArcGIS Online', url : '/gismap', external: false },
                { name : 'Residences Within Each Parish', url : '/parish', external: false },
            ] },
            { name : 'Detention Locations', url : '/detention', external: false, subpages : [] },
            { name : 'Trial Locations', url : '/trials', external: false, subpages : [
             { name : 'Trials in Each Modern Authority', url : '/council', external: false },
            ] },
            { name : 'Death Locations', url : '/death', subpages : [
                 { name : 'Linking Residence to Place of Death', url : '/link', external: false },
            ] },
            { name : 'People Associated', url : '/people', external: false, subpages : [
            { name : 'People Associated with the Witch Trials: Residence', url : '/peopleloc', external: false },
            { name : 'A Witch-Prickers Journey', url : '/john', external: false },
            ] },
             { name : 'Extra Visualisations', url : '/extravisual', external: false, subpages : [
             { name : 'Types of Torture at Different Residence Locations', url : '/torture', external: false },
             { name : 'The Story of Isobel Young', url : '/storymap', external: false },
             { name : 'Ordeal Bubble Chart', url : '/ordeal', external: false },
             ] },
            { name : 'About', url : '/about', external: false, subpages : [ 
                 { name : 'References', url : '/reference', external: false },
                 { name : 'Resources', url : '/Resources', external: false },
                 { name : 'Contact', url : '/contact', external: false },
            ] },
            { name : 'Blog', url : ' https://blogs.ed.ac.uk/ecarroll3_witchcraft_visualisation/', external: true, subpages : [] }
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
