export const useMyFetch = async (request, opts) => {
  const config = useRuntimeConfig()

  try {
    const {data,error} = await useFetch(request, { baseURL: config.public.baseURL, ...opts })
    console.log("Fetch error:", data);
    if (!data.value ) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch data.`,
      });
    }

    return data;

  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
