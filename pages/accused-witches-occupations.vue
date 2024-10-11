<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl mb-3">
          Accussed Witches Occupations
        </h1>
      </div>
      <div>
        These bubble charts show the different occupations recorded for the
        accused witches from within the database using the Wikidata Query
        Service. There is no occupation recorded for most of the witches listed
        in the Survey, for two reasons. The first reason is that for many of the
        witches we have only limited information of any kind about them. The
        second and more interesting reason concerns the way in which occupations
        were understood. Most people in early modern Scotland were not known as
        having a distinct occupation, because most people, most of the time,
        were engaged in farming. It would have been meaningless to call someone
        a farmer. But it was also meaningless to designate someone as having an
        occupation other than farmer unless that was recognisably their main
        occupation. And some people had several occupations.
        <strong
          >The first bubble chart includes people with no recorded occupation
          while the second chart only includes the recorded occupations.</strong
        >
      </div>
      <h2 class="text-sm md:text-l lg:text-xl mt-3">
        Occupations with Unknown Values
      </h2>
      <div>
        <iframe
          style="width: 80vw; height: 70vh; border: none"
          src="https://query.wikidata.org/embed.html#%23Social%20class%20of%20the%20accused%20witches%20in%20the%20Survey%20of%20Scottish%20witchcraft%0A%0A%23defaultView%3ABubbleChart%0ASELECT%20(IF(BOUND(%3Foccupation)%2C%20%3FoccupationLabel%2C%20%22unknown%22)%20as%20%3Flabel)%20%3Fcount%0A%3Foccupation%20%3FoccupationLabel%20%0A%0AWHERE%0A%7B%0A%20%20%7B%0A%20%20%20%20SELECT%20%3Foccupation%20(COUNT(%3Fperson)%20AS%20%3Fcount)%20WHERE%20%7B%0A%20%20%20%20%20%20%3Fperson%20wdt%3AP4478%20%3Faccused%20.%0A%20%20%20%20%20%20OPTIONAL%20%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%3Fperson%20wdt%3AP106%20%3Foccupation.%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20GROUP%20BY%20%3Foccupation%0A%20%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%7D%0A%7D%0AORDER%20BY%20DESC(%3Fcount)%0ALIMIT%204000"
          referrerpolicy="origin"
          sandbox="allow-scripts allow-same-origin allow-popups"
        ></iframe>
      </div>
      <h2 class="text-sm md:text-l lg:text-xl mt-3">
        Occupations without Unknown Values
      </h2>
      <iframe
        style="width: 80vw; height: 70vh; border: none"
        src="https://query.wikidata.org/embed.html#%23People%20Associated%20%0A%23defaultView%3ABubbleChart%0ASELECT%20%3FoccupationLabel(COUNT(%3Fperson)%20as%20%3Fcount)%20%0AWHERE%20%0A%7B%0A%20%20%3Fitem%20wdt%3AP4478%20%3Fperson.%0A%20%0A%20%20%3Fitem%20wdt%3AP106%20%3Foccupation.%20%0A%20%20%0A%20%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%7D%0A%7D%0AGROUP%20BY%20%3FoccupationLabel%0A%0AORDER%20BY%20DESC%20(%3Fcount)"
        referrerpolicy="origin"
        sandbox="allow-scripts allow-same-origin allow-popups"
      ></iframe>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "default",
});

export default {
  data: () => ({}),
  methods: {},
  computed: {},
  mounted: function () {},
};
</script>

<style></style>
