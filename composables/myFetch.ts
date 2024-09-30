export const myFetch = async (request, opts = {}) => {
    const config = useRuntimeConfig();
    const url = new URL(request, config.public.baseURL);

    try {
      const data = await $fetch(url, opts)
      if (!data ) {
        throw createError({
          statusMessage: `Could not fetch data.`,
        });
      }
      return data;
  
    } catch (error) {
      console.error("Fetch error");
      throw error;
    }  
  };