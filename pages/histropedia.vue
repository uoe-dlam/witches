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
         title: 'Social Class Bubble Charts',
         html: '<div>Histropedia Timeline</div>',
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
