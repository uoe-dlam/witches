export const useMyFetch = async (request, opts) => {
  const config = useRuntimeConfig();

  try {
    const { data, error } = await useFetch(request, {
      baseURL: config.public.baseURL,
      ...opts,
    });
    if (!data.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch data.`,
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};
