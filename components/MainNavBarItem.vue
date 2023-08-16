<template>
  <span class="dropdown block lg:inline-block">
    <a :href="url" class="block mt-4 xl:pt-1 xl:pb-1 xl:inline-block lg:mt-0 text-gray-500 hover:text-black lg:mr-2 xl:mr-4" v-if="external">
      <slot></slot>
    </a>
    <nuxt-link :to="url" class="block xl:pt-1 xl:pb-1 mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-black lg:mr-2 xl:mr-4" :class="{ 'menuBarItemActive' :  isSubpageActive(subpages)}" v-else>
      <slot></slot>
    </nuxt-link>
    <div v-if="subpages.length > 0" class="block dropdown-content lg:absolute lg:hidden lg:bg-gray-200 lg:shadow-xl text-gray-500">
      <a v-for="(page, index) in subpages" :href="page.url" class="block pt-3 pb-0 pl-2 pr-2 lg:p-2 hover:text-black" :class="{ 'subMenuItemActive' : isSubActive(page.url)}">{{ page.name }}</a>
    </div>
  </span>
</template>

<script>

 export default {
   props: ['url', 'external', 'subpages'],
   methods: {
     isSubActive : function(url){
       return url === this.$route.path || url + "/" === this.$route.path ;
     },
     isSubpageActive: function(subpages){
       return subpages.some(page => page.url === this.$route.path || page.url + "/" === this.$route.path)
     }
   }
 }
</script>

<style>

 .menuBarItemActive {
   color: #000;
   text-decoration-line: underline;
 }

 .subMenuItemActive {
   color: #000;
 }

 .dropdown-content {
   min-width: 160px;
   z-index: 1;
 }

 .dropdown:hover .dropdown-content {display: block;}

</style>
