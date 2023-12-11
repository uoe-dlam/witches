<template>
  <div id="main-content" class="text-wrapper">
    <h1 class="text-center text-2xl md:text-3xl lg:text-4xl mb-6">Further Reading</h1>
    <div v-for="(book, index) in books" :key="index" class="book-container">
      <div>
        <p class="mt-6 mb-3 text-lg md:text-xl lg:text-xl font-medium">{{ book.title }}</p>
        <p class="mb-3">{{ book.author }}</p>
      </div>
      <img :src="book.image" width="75" class="book-image">
    </div>
  </div>
</template>

<script>


 export default {
   data: () => ({
    books: [
        {
          title: "Satan and the Scots: The Devil in Post-Reformation, c1560-1700",
          author: "Michelle D.Brock (Farnham: Ashgate, 2016)",
          image: "@/assets/img/book.png"
        },
        {
          title: "The Scottish Witch-Hunt in Context",
          author: "Julian Goodare (Manchester: Manchester University Press, 2002)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Scottish Witches and Witch-Hunters",
          author: "Julian Goodare (Basingloke: Palgrave Macmillan, 2013)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Witchcraft and Belief in Early Modern Scotland",
          author: "Julian Goodare, Lauren Martin and Joyce Miller eds. (Basingloke: Palgrave Macmillan, 2008)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Witchcraft and Folk Belief in Early Modern Scotland",
          author: "Lizanne Henderson (Basingloke: Palgrave Macmillan, 2016)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Witchcraft and Folk Belief in the Age of Enlightenment: Scotland, 1670-1740",
          author: "Lizanne Henderson (Basingloke: Palgrave Macmillan, 2016)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Enemies of God: The Witch-Hunt in Scotland",
          author: "Christina Larner (London: Chatto & Windus, 1981)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Witch-Hunting in Scotland: Law, Politics and Religion",
          author: "Brian P. Levack (London: Routledge, 2008)",
          image: "@/assets/img/book.png"
        },
        {
          title: "The Witches of Fife: Witch-Hunting in a Scottish Shire",
          author: "Stuart Macdonald (East Linton: Tuckwell, 2001)",
          image: "@/assets/img/book.png"
        },
        {
          title: "The Visions of Isobel Gowdie: Magic, Witchcraft and Dark Shamanism in Seventeenth-Century Scotland",
          author: "Emma Wilby (Brighton: Sussex Academic Press, 2010)",
          image: "@/assets/img/book.png"
        },
        {
          title: "Witches of the North: Scotland and Finmark",
          author: "Liv Helene Willumson (Leiden: Brill, 2013)",
          image: "@/assets/img/book.png"
        }
 
      ]

   }),
   methods: {

   },
   computed : {

   },
   mounted: function() {
   },
   layout: 'basic'
 };
</script>

<style scoped>
.custom-margin {
  margin-left: 8%;
  margin-right: 8%;
}

.book-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.book-image {
  margin-left: 20px; /* Adjust the margin as needed */
}


</style>
