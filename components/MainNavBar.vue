<template>
    <nav class="flex items-center justify-between flex-wrap bg-white p-6">
      <div class="flex items-center text-white mr-6">
        <img src="~/assets/main-logo.png" alt="logo" width="250">
      </div>
      <div class="block lg:hidden">
        <button @click="toggle" class="flex items-center px-3 py-2 border rounded text-grey border-grey hover:text-grey hover:border-grey-dark">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>
      <div :class="open ? 'block': 'hidden'" class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
            <main-nav-bar-item v-for="link in links" :url="link.url" :key="link.url">
                {{link.name}}
            </main-nav-bar-item>
        </div>
      </div>
    </nav>
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
            { name : 'Residences', url : '/' },
            { name : 'Death Locations', url : '/death' },
            { name : 'Detention Locations', url : '/detention' },
            { name : 'Trial Locations', url : '/trials' }
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
