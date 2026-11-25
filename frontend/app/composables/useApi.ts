// The one place that knows where the backend lives.
export function useApi() {
  return $fetch.create({ baseURL: useRuntimeConfig().public.apiBase })
}
