<template>
  <div id="main-wrapper">
    <main-nav-bar></main-nav-bar>
    <slot />
  </div>
</template>

<script>
import MainNavBar from "~/components/MainNavBar.vue";

export default {
  components: {
    MainNavBar,
  },
};
</script>

<style>
body {
  padding: 0 0;
  margin: 0 0 0 0;
  font-family: Arial;
  background: #f8fafc;
}

@tailwind base;

h1 {
  font-family: "EB Garamond", sans-serif;
  font-weight: 600;
  margin-top: 0;
  font-size: 3.05em;
}
h2 {
  font-family: "EB Garamond", sans-serif;
  font-size: 2.44em;
}
h3 {
  font-family: "EB Garamond", sans-serif;
  font-size: 1.95em;
}
h3 {
  font-family: "EB Garamond", sans-serif;
  font-size: 1.95em;
}
h4 {
  font-size: 1.56em;
}
</style>
