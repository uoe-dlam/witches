<template>
  <main id="main-content" class="text-wrapper">
    <h1 class="mb-3">Accessibility statement for witches.is.ed.ac.uk</h1>
    <p>This accessibility statement applies to witches.is.ed.ac.uk</p>
    <p>
      We want as many people as possible to be able to use this website. For
      example, that means you should be able to:
    </p>
    <ul class="ml-5 mb-3">
      <li class="list-disc">change colours, contrast levels and fonts</li>
      <li class="list-disc">
        zoom in up to 200% without the text spilling off the screen
      </li>
      <li class="list-disc">
        navigate most of the website using just a keyboard
      </li>
      <li class="list-disc">
        navigate most of the website using speech recognition software
      </li>
      <li class="list-disc">
        listen to most of the website using a screen reader (including the most
        recent versions of JAWS, NVDA and VoiceOver)
      </li>
    </ul>
    <p>
      <a href="https://mcmw.abilitynet.org.uk" target="_blank" class="link"
        >AbilityNet</a
      >
      has advice on making your device easier to use if you have a disability.
    </p>

    <h2 class="mb-3">How accessible this website is</h2>
    <p>We know some parts of this website are not fully accessible:</p>
    <ul class="ml-5 mb-3">
      <li class="list-disc">Page html elements do not have a lang attribute</li>
      <li class="list-disc">Some images are missing alternative text.</li>
      <li class="list-disc">Pages don't have one main landmark</li>
      <li class="list-disc">
        Some links (e.g. drop downs on main menu and filters) are not navigable
        using keyboard only
      </li>
    </ul>

    <h2 class="mb-3">Feedback and contact information</h2>
    <p>
      If you need information on this website in a different format like
      accessible PDF, large print, easy read, audio recording or braille:
    </p>
    <ul class="ml-5 mb-3">
      <li class="list-disc">
        email the
        <a :href="`mailto:${supportEmail}`" class="link"
          >Digital Learning Applications and Media Team</a
        >
      </li>
    </ul>
    <p>We shall consider your request and get back to you in 5 days.</p>

    <h2 class="mb-3">Reporting accessibility problems with this website</h2>
    <p>
      We're always looking to improve the accessibility of this website. If you
      find any problems not listed on this page or think we are not meeting
      accessibility requirements, contact the
      <a :href="`mailto:${supportEmail}`" class="link"
        >Digital Learning and Applications Media Team</a
      >
    </p>

    <h2>Enforcement procedure</h2>
    <p>
      The Equality and Human Rights Commission (EHRC) is responsible for
      enforcing the Public Sector Bodies (Websites and Mobile Applications) (No.
      2) Accessibility Regulations 2018 (the 'accessibility regulations'). If
      you're not happy with how we respond to your complaint,
      <a
        class="link"
        href="https://www.equalityadvisoryservice.com"
        target="_blank"
        >contact the Equality Advisory and Support Service (EASS).</a
      >
    </p>

    <h2>Technical information about this website's accessibility</h2>
    <p>
      The University is committed to making websites accessible, in accordance
      with the Public Sector Bodies (Websites and Mobile Applications) (No. 2)
      Accessibility Regulations 2018.
    </p>

    <h2 class="mb-3">Compliance status</h2>
    <p>
      This website is partially compliant with the Web Content Accessibility
      Guidelines 2.1 AA standard, due to the non-compliances listed below.
    </p>
    <p>The full guidelines are available at:</p>
    <p>
      <a href="https://www.w3.org/TR/WCAG21/" target="_blank" class="link"
        >Web Content Accessibility Guidelines version 2.1</a
      >
    </p>

    <h2 class="mb-3">Non Accessible Content</h2>
    <p>The content listed below is non-accessible for the following reasons.</p>

    <h3 class="mb-3">Noncompliance with the accessibility regulations</h3>
    <p>
      The following items do not comply with the WCAG 2.1 AA success criteria
    </p>
    <ul class="ml-5 mb-3">
      <li class="list-disc">
        Page html elements do not have a lang attribute (<a
          href="https://www.w3.org/TR/WCAG21/#language-of-page"
          target="_blank"
          class="link"
          >3.1.1 Language of Page</a
        >)
      </li>
      <li class="list-disc">
        Some images are missing alternative text (<a
          href="https://www.w3.org/TR/WCAG21/#text-alternatives"
          target="_blank"
          class="link"
          >1.1 Text Alternatives</a
        >)
      </li>
      <li class="list-disc">
        Pages don't have one main landmark (<a
          href="https://www.w3.org/TR/WCAG21/#info-and-relationships"
          target="_blank"
          class="link"
          >1.3.1 Info and Relationships</a
        >)
      </li>
      <li class="list-disc">
        Some links (e.g. drop downs on main menu and filters) are not navigable
        using keyboard only ( <a
          href="https://www.w3.org/TR/WCAG21/#keyboard-accessible"
          target="_blank"
          class="link"
          >2.1 Keyboard Accessible</a
        >).
      </li>
    </ul>
    <p>
      We will be looking at making sure that this website complies in the near
      future.
    </p>

    <h2 class="mb-3">Preparation of this accessibility statement</h2>
    <p>
      This statement was prepared on 08/02/2021. It was last reviewed on
      08/02/2021.
    </p>
    <p>
      This website was last tested on 08/02/2021. The test was carried out by
      the Digital Learning Applications and Media Team.
    </p>
    <p>
      This involved manual testing of a number of sample pages. We also ran axe
      and wave automated tests on a number of sample pages.
    </p>
  </main>
</template>

<script>
definePageMeta({
  layout: "default",
});

export default {
  data: () => ({
    supportEmail: useRuntimeConfig().public.supportEmail,
  }),
  methods: {},
  computed: {},
  mounted: function () {},
};
</script>

<style></style>
