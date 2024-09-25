<template>
  <div class="w-full flex flex-col z-40 py-2 
             bg-slate-400 pr-3 absolute bottom-0" 
        v-if="!hideBanner">
    <p class="text-xs md:text-sm ml-2 mt-1">
      We use cookies to analyse site traffic to understand our
      users' behaviour and how the site is doing, and to store
      your cookie preferences. This includes Google Analytics
      anonymised data.
      If you wish to turn off Google Analytics you can do so
      by clicking reject non essential cookies.
    </p>
    <div class="xflex self-end">
      <button class="rounded-sm bg-sky-600 hover:border-2
                  hover:border-sky-800 h-8  px-2 mr-3 mt-2
                  text-xs md:text-sm" @click="consentCookies()">
        Accept all
      </button>
      <button class="rounded-sm bg-sky-600 hover:border-2
                  hover:border-sky-800 h-8 px-2 mr-4 mt-2
                  text-xs md:text-sm" @click="rejectCookies()">
        Reject non essential cookies
      </button>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies' 

export default {
  components: { VueCookies },
  data: () => ({
    hideBanner: true,
  }),
  methods: {
    consentCookies: function () {
      $cookies.set("edW", 'yes');
      this.hideBanner = true;

      if (process.client) {
        this.isOpen = false;
        localStorage.setItem("GDPR:accepted", "yes");
        this.$gtag.optIn();
        this.$gtag.pageview(this.$route.fullPath);
      }
    },
    rejectCookies: function () {
      $cookies.set("edW", 'yes');
      this.hideBanner = true;

      if (process.client) { 
        this.isOpen = false;
        localStorage.setItem("GDPR:accepted", "no");
        this.$gtag.optOut();
      }
    },
  },
  mounted: function () {
    if ($cookies.get('edW') === null) {
      this.hideBanner = false;
    }
  },
}
</script>

<style>
a.normal:link {
  color: #0000EE;
  background-color: transparent;
  text-decoration: underline;
}

a.normal:visited {
  color: #551A8B;
  background-color: transparent;
  text-decoration: underline;
}
</style>