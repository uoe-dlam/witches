<template>
  <div id="main-content" class="text-wrapper w-full">
    <h1 class="text-center mb-6">Introduction to Scottish Witchcraft</h1>

    <p class="mb-3 text-justify">
      This interactive map displays the known residences and detention, trial,
      and death locations of over 3000 accused witches in Scotland, based upon
      information provided by
      <a
        href="https://witches.hca.ed.ac.uk/"
        class="underline hover:text-gray-500"
      >
        The Survey of Scottish Witchcraft </a
      >.
    </p>
    <div class="flex justify-center mb-3">
      <iframe
        id="kaltura_player"
        type="text/javascript"
        src='https://cdnapisec.kaltura.com/p/2010292/embedPlaykitJs/uiconf_id/55171522?iframeembed=true&entry_id=1_yj5c097l&config[provider]={"widgetId":"1_buq8663s"}'
        style="width: 400px; height: 285px; border: 0"
        allowfullscreen
        webkitallowfullscreen
        mozAllowFullScreen
        allow="autoplay *; fullscreen *; encrypted-media *"
        sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
        title="Kaltura Player"
      ></iframe>
    </div>
    <div>
      <div class="lg:float-right lg:w-1/2 w-3/4 mx-auto">
        <img
          src="../public/images/map.png"
          class="w-full lg:ml-6 border border-gray-300"
        />
        <p class="text-xs text-center">Map of Accused Witches. CC-BY-SA 4.0</p>
      </div>
      <p class="mb-3 text-justify">
        During the sixteenth and seventeenth centuries Scotland went through a
        series of changes to the state and church which fuelled the Scottish
        witch hunt. As a result of the Reformation, when Scotland broke away
        from the Catholic Church and moved towards Protestantism, the church
        went through an upheaval of religious belief and became much more
        interested in what ordinary people did and believed. The Church was
        particularly worried about the people of Scotland committing sins, for
        instance having sex outside of marriage, breaking sabbath (not attending
        church on a Sunday), quarrelling with each other, whether they practised
        the ‘right’ religion in the right way or not, and witchcraft. Parish
        committees known as kirk sessions were established to enforce these
        rules. They could impose fines or penances (public shaming rituals) on
        offenders and could be backed up by the secular authorities. Both church
        and secular authorities sought ‘godliness’ as they worried that if sins
        were to go unpunished, then God would punish Scotland with plagues,
        famines, natural disasters and wars. Church and state were both occupied
        with becoming more ‘godly’ and ultimately worked together to fight
        against sin and expose and prosecute suspected witches. Witchcraft
        became a secular capital crime in 1563 by an act of the Scottish
        parliament.
      </p>
    </div>
    <p class="mb-3 text-justify">
      This led to the persecution of upwards of 4000 people in Scotland between
      1563 and 1736, in what we now recognize as the Scottish witch-hunts.
      Evidence was often gathered by kirk sessions, but trials themselves were
      held in secular criminal courts, usually in the accused witch’s own
      locality. Two main kinds of evidence were used: either the testimony of
      the accused witch’s neighbours, or else the confession of the accused
      witch herself or himself, under interrogation. Neighbours usually
      complained about quarrels, bewitchment and everyday magical harm.
      Interrogators, by contrast, tended to focus on the alleged witch’s
      dealings with the Devil. Confession evidence was often gathered under
      torture, with the most common kind of torture being sleep deprivation.
    </p>
    <div>
      <div class="lg:float-right lg:w-1/2 w-3/4 mx-auto">
        <img
          src="../public/images/intro.jpg"
          class="w-full lg:ml-6 border border-gray-300"
        />
        <p class="text-xs text-center">
          Newes from Scotland - Woodcut of North Berwick Witches. Public Domain
        </p>
      </div>
      <p class="mb-3 text-justify">
        Of these people accused as witches it is estimated that around 2,500,
        around two-thirds, were executed. The majority of those executed were
        women, approximately 85%, but men were certainly not safe from
        suspicion, accusation, and condemnation. This gender division is similar
        to that in other mainland European countries. As can be seen on the map,
        the majority of accused witches in Scotland lived in the central belt
        with 32% of named accused witches coming from the Lothians. East
        Lothian, historically known as Haddingtonshire, is the county in which
        witch-hunting was most fierce. There were various ‘panic periods’,
        periods of high levels of accusation and prosecution, particularly in
        1590-1, 1597, 1628-30, 1649, and 1661-2; these can also be explored
        through the map’s timeline function. After 1662, central courts became
        increasingly less convinced by the usual kinds of evidence that were
        used to prove guilt. In particular, the credibility of the use of
        torture in obtaining confessions was questioned. As the state became
        more secular going into the eighteenth century, it no longer needed to
        prove its godliness. The last prosecution of an accused witch in
        Scotland occurred in 1727 and the Scottish Witchcraft Act was repealed
        in 1736.
      </p>
    </div>
    <p class="mb-3 text-justify">
      It is important to remember that, whilst this map allows you to explore
      the accused witches for who names can be found, there are many more not
      included on this map for whom the evidence is too sparse, or unfortunately
      just does not exist. If you are interested in learning more about the
      witch-hunts in Scotland, there are various books and articles that we can
      recommend. Our
      <a href="/further-reading" class="link">Further Reading</a> page gives you
      a list of up-to-date work on witchcraft and witch-hunting in Scotland, for
      an older but more detailed list of works, see the Survey of Scottish
      Witchcraft’s
      <a href="https://witches.hca.ed.ac.uk/reading/" class="link"
        >‘Further Reading’ </a
      >list.
    </p>
  </div>
</template>

<script>
definePageMeta({
  layout: "basic",
});

export default {
  data: () => ({}),
  methods: {},
  computed: {},
  mounted: function () {},
};
</script>

<style scoped></style>
