<template>
  <div style="height: 100%">
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1>Trial Mentions Network Graph</h1>
        <div
          class="inline-flex items-center justify-center align-middle rounded-full w-6 h-6 hover:w-7 hover:h-7 mb-0.5 ml-1 cursor-pointer"
        >
          <img
            src="/images/infoIcon.svg"
            class="w-full h-full pt-0.5"
            alt="Page Information Popup"
            @click="showPageInfo()"
          />
        </div>
      </div>
    </div>
    <div style="height: 90%; min-height: 400px">
      <iframe
        src="https://flo.uri.sh/story/1664928/embed"
        title="Interactive or visual content"
        class="flourish-embed-iframe"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 100%"
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
          href="https://public.flourish.studio/story/1664928/?utm_source=embed&utm_campaign=story/1664928"
          target="_top"
          style="text-decoration: none !important"
          ><img
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
import Swal from "sweetalert2";

definePageMeta({
  layout: "default",
});
export default {
  data: () => ({}),
  methods: {
    showPageInfo() {
      Swal.fire({
        title: "Social Class Bubble Charts",
        html: "<div>Histropedia Timeline</div>",
        footer: "witches.is.ed.ac.uk",
        confirmButtonText: "Close",
        type: "info",
        showCloseButton: true,
      });
    },
  },
  computed: {},
  mounted: function () {},
};
</script>

<style></style>
