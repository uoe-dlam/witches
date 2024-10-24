<template>
  <div>
    <div class="h-full">
      <iframe
        v-if="isLargeScreen"
        src="https://flo.uri.sh/visualisation/11211885/embed"
        title="Interactive or visual content"
        class="flourish-embed-iframe"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <iframe
        v-else
        src="https://flo.uri.sh/visualisation/19923204/embed"
        title="Interactive or visual content"
        class="flourish-embed-iframe"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div
        style="
          width: 100%!;
          margin-top: 4px !important;
          text-align: right !important;
        "
      >
        <a
          class="flourish-credit"
          :href="
            isLargeScreen
              ? 'https://public.flourish.studio/visualisation/11211885/?utm_source=embed&utm_campaign=visualisation/11211885'
              : 'https://public.flourish.studio/visualisation/19923204/?utm_source=embed&utm_campaign=visualisation/19923204'
          "
          target="_top"
          style="text-decoration: none !important"
        >
          <img
            alt="Made with Flourish"
            src="https://public.flourish.studio/resources/made_with_flourish.svg"
            style="
              width: 105px !important;
              height: 16px !important;
              border: none !important;
              margin: 0 !important;
            "
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLargeScreen: false,
    };
  },
  methods: {
    getScreenSize() {
      this.isLargeScreen = window.innerWidth > 768;
    },
  },
  mounted() {
    this.getScreenSize();
    window.addEventListener("resize", this.getScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenSize);
  },
};
</script>

<style></style>
