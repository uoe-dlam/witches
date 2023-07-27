<template>
  <div>
    <div>
      <iframe src="https://js.histropedia.com/sheets/index.html?id=1KLGbvzsztzP1BUdskTzjaM-O51iEwjdF-Pe4MpjOhc4&c_Gender&embed=true" width="100%" height="580px" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
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
         html: '<img src="/images/witches-cluster-composite.png" alt="logo" width="50" ><div><p>This timeline has been made using Histropedia Sheets which allows you to generate a <a href="https://js.histropedia.com/" class="underline text-blue-600 dark:text-blue-500"> HistropediaJS </a> timeline using a Google Sheets spreadsheet as the data source. The timeline shows the investigation dates (when known) of named witches in the Survey of Scottish Witchcraft. You can search by individual accused name in the search bar.The timeline is also filterable/colour-coded by the primary investigation characteristic, the accused witch\'s gender, occupation, social classification, marital status, age, and recorded \'cause of witch\'s malice\'.</p><br><p> Please note, the Survey of Scottish witchcraft has over 3,000 accused witches and only a small subset of these have recorded entries for the filters mentioned above. Clicking on the accused witch will allow you to read more about their individual case on the Survey website. Zooming in on the timeline will show more accused witches as the only the prominent individuals with Wikipedia pages are shown on the top level currently.<p></div>',
         footer: 'witches.is.ed.ac.uk',
         confirmButtonText: 'Close',
         type: 'info',
         showCloseButton: true,
         customClass:{
          title: 'info-alert-title',
          confirmButton: 'info-alert-button'
         }
       });
     }
   },
   computed : {

   },
   mounted: function() {
    this.showPageInfo();
   },
   layout: 'basic'
 };

</script>

<style>


</style>
