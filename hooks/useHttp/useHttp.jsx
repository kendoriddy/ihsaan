import http from '../axios/axios'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useFetch = (
  key,
  url,
  success,
  errorfn,
  refetchInterval,
  enabled = true,
  retry
) => {
  const {
    isLoading,
    isFetching,
    data,
    error,
    isError,
    refetch,
    isInitialLoading
  } = useQuery(
    [key, url],
    async () =>
      http.get(
        url.startsWith('https') ? url : `${http.defaults.baseURL}${url}`
      ),
    {
      onSuccess: data => {
        if (success) success(data?.data)
      },
      onError: errorfn,
      enabled,
      refetchInterval,
      staleTime: Infinity,
      retry
    }
  )

  return {
    isLoading,
    data,
    error,
    isError,
    refetch,
    isInitialLoading,
    isFetching
  }
}

export const usePost = (url, options) => {
  const { mutate, isLoading } = useMutation(
    postData =>
      http.post(
        url.startsWith('http') ? url : `${http.defaults.baseURL}${url}`,
        postData
      ),
    options
  )

  return {
    mutate,
    isLoading
  }
}

export const usePatch = (url, options) => {
  const { mutate, isLoading } = useMutation(
    postData =>
      http.patch(
        url.startsWith('http') ? url : `${http.defaults.baseURL}${url}`,
        postData
      ),
    options
  )

  return {
    mutate,
    isLoading
  }
}

export const useDelete = (url, options) => {
  const { mutate, isLoading } = useMutation(
    id =>
      http.delete(
        `${
          url.startsWith('http') ? url : `${http.defaults.baseURL}${url}`
        }/${id}/`
      ),
    options
  )
  return {
    mutate,
    isLoading
  }
}

export const usePut = (url, options) => {
  const { mutate, isLoading } = useMutation(async ({ id, data }) => {
    try {
      const response = await http.put(
        `${
          url.startsWith('http') ? url : `${http.defaults.baseURL}${url}`
        }/${id}/`,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  }, options)
  return {
    mutate,
    isLoading
  }
}

export const usePut2 = options => {
  const { mutate, isLoading } = useMutation(async ({ url, data }) => {
    try {
      const response = await http.put(
        url.startsWith('http') ? url : `${http.defaults.baseURL}${url}`,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  }, options)

  return {
    mutate,
    isLoading
  }
}

export const useProfileUpdate = (url, options) => {
  const { mutate, isLoading } = useMutation(
    data =>
      http.put(
        url.startsWith('http') ? url : `${http.defaults.baseURL}${url}`,
        data
      ),
    options
  )
  return {
    mutate,
    isLoading
  }
}
