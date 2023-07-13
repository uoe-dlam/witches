<template>
  <div>
    <div id="main-content" class="pl-5 pr-5 pt-3 pb-3">
      <div class="flex content-start items-center">
        <h1 class="text-sm md:text-xl lg:text-2xl">Timeline Search</h1>
        <span class="rounded-full border-r border-l border-gray-400 w-6 h-6 flex items-center justify-center ml-2">
          <!-- icon by feathericons.com -->
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#606F7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" @click="showPageInfo()">
            <line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>
          </svg>
        </span>
      </div>

    </div>
    <div>
      <iframe src="https://js.histropedia.com/sheets/index.html?id=1KLGbvzsztzP1BUdskTzjaM-O51iEwjdF-Pe4MpjOhc4&c_Gender&embed=true" width="100%" height="600px" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
    </div>
  </div>
</template>

<script>


 export default {
   data: () => ({
   }),
   methods: {
     showPageInfo(){
       this.$swal({
         title: 'Histropedia Timeline',
         html: '<div><p>This timeline has been made using Histropedia Sheets which allows you to generate a <a href="https://js.histropedia.com/" class="underline text-blue-600 dark:text-blue-500"> HistropediaJS </a> timeline using a Google Sheets spreadsheet as the data source. The timeline shows the investigation dates (when known) of named witches in the Survey of Scottish Witchcraft. You can search by individual accused name in the search bar.The timeline is also filterable/colour-coded by the primary investigation characteristic, the accused witch\'s gender, occupation, social classification, marital status, age, and recorded \'cause of witch\'s malice\'.</p><br><p> Please note, the Survey of Scottish witchcraft has over 3,000 accused witches and only a small subset of these have recorded entries for the filters mentioned above. Clicking on the accused witch will allow you to read more about their individual case on the Survey website. Zooming in on the timeline will show more accused witches as the only the prominent individuals with Wikipedia pages are shown on the top level currently.<p></div>',
         footer: 'witches.is.ed.ac.uk',
         confirmButtonText: 'Close',
         type: 'info',
         showCloseButton: true,
       });
     }
   },
   computed : {

   },
   mounted: function() {
   },
   layout: 'basic'
 };

</script>

<style>


</style>
