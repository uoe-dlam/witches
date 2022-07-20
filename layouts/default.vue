<template>
  <div id="main-wrapper">
    <main-nav-bar></main-nav-bar>
    <nuxt />
  </div>
</template>

<script>
    import  MainNavBar from '~/components/MainNavBar.vue'

    export default {
        components: {
            MainNavBar
        }
    }
</script>

<style>

body{
    padding: 0 0;
    margin: 0 0 0 0;
    font-family: Arial;
    background: #F8FAFC;
}


@tailwind base;

h1 {
    @apply text-2xl;
    font-family: 'EB Garamond';
}
h2 {
    @apply text-xl;
}
h3 {
    @apply text-lg;
}
p {
  font-family: 'Roboto';
}

.lds-facebook {
  display: inline-block;
  position: relative;
  width: 50px;
  height: 50px;
  margin-top: -25px;
}

.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 13px;
  background: #3490dc;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.lds-facebook div:nth-child(1) {
  left: 6px;
  animation-delay: -0.24s;
}

.lds-facebook div:nth-child(2) {
  left: 26px;
  animation-delay: -0.12s;
}

.lds-facebook div:nth-child(3) {
  left: 45px;
  animation-delay: 0;
}

@keyframes lds-facebook {
  0% {
    top: 6px;
    height: 51px;
  }
  50%, 100% {
    top: 19px;
    height: 26px;
  }
}

#main-wrapper{
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#page-intro{
  height: 10%;
}

#map-wrapper {
  background-color: #DDDDDD;
  -webkit-flex: 1;
  flex : 1;
}

.icon-wrapper{
  position: relative;
  text-align: center;
  width: 25px;
  height: 41px;
  font-color: #fff;
}

.icon-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  text-shadow: 1px 1px 3px #000;
}

.icon-wiki{
  position: absolute;
  top: -5px;
  left: 13px;
  color: #fff;
  text-shadow: 1px 1px 3px #000;
}

.icon-shadow{
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.witch-scroller{
  height:225px;
  overflow:scroll;
  padding-right:5px;
}

.no-witch-scroller{

}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0,0,0,.5);
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

div.leaflet-popup.leaflet-zoom-animated{
  bottom: 1px !important;
}

#main-nav {
  font-family: 'EB Garamond';
}

.text-wrapper {
  @apply mx-auto max-w-screen-lg px-5 py-3;
}

</style>
