import { defineNuxtConfig } from "@nuxt/bridge";

export default defineNuxtConfig({
  bridge: false,
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "leaflet.markercluster/dist/MarkerCluster.css",
    "leaflet.markercluster/dist/MarkerCluster.Default.css",
    "vue-slider-component/theme/default.css",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/markercluster", ssr: false },
    { src: "~/plugins/slider", ssr: false },
    { src: "~/plugins/vue-google-analytics", mode: "client" },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    "@nuxtjs/tailwindcss",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "nuxt-leaflet",
    "vue-sweetalert2/nuxt",
    "nuxt-webfontloader",
    "@nuxtjs/axios",
  ],
  axios: {
    // extra config e.g
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8181"
        : "https://witches.is.ed.ac.uk",
  },
  purgeCSS: {
    whitelist: ["lvml"],
    whitelistPatterns: [/leaflet-.+$/, /vue-slider.+$/],
    whitelistPatternsChildren: [/leaflet-.+$/, /vue-slider.+$/],
  },
  webfontloader: {
    google: {
      families: ["EB+Garamond:400,700", "Roboto:300,400,500"], //Loads Lato font with weights 400 and 700
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
});
