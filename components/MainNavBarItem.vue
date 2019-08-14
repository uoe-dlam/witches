<template>
  <a :href="url" class="block mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-black mr-4" v-if="external">
    <slot></slot>
  </a>
  <nuxt-link :to="url" class="block mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-black mr-4" :class="{ 'menuActive' : isActive}" v-else>
    <slot></slot>
  </nuxt-link>
</template>

<script>

export default {
  props: ['url', 'external'],
  computed: {
    isActive : function(){
        return this.url === this.$route.path;
    }
  }
}
</script>

<style>

    a.menuActive {
        color: #000;
    }

</style>
