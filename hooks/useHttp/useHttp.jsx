import http from "../axios/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
// for handling GET requests
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
    isInitialLoading,
  } = useQuery([key], async () => http.get(url), {
    onSuccess: success,
    onError: errorfn,
    enabled,
    refetchInterval,
    staleTime: Infinity,
    retry,
  });

  return {
    isLoading,
    data,
    error,
    isError,
    refetch,
    isInitialLoading,
    isFetching,
  };
};

export const usePost = (url, options) => {
  const { mutate, isLoading } = useMutation(
    (postData) => http.post(url, postData),
    options
  );

  return {
    mutate: mutate,
    isLoading,
  };
};

export const useDelete = (url, options) => {
  const { mutate, isLoading } = useMutation(
    (id) => http.delete(`${url}/${id}`),
    options
  );
  return {
    mutate,
    isLoading,
  };
};

export const usePut = (url, options) => {
<<<<<<< HEAD
  const { mutate, isLoading } = useMutation(async ({ id, data }) => {
    try {
      const response = await http.put(`${url}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error; // Ensure error is thrown
    }
  }, options);
=======
  const { mutate, isLoading } = useMutation(
    ({ id, data }) => http.put(`${url}/${id}`, data),
    options
  );
>>>>>>> 18fd2aa (initial)
  return {
    mutate,
    isLoading,
  };
};

export const useProfileUpdate = (url, options) => {
  const { mutate, isLoading } = useMutation(
    (data) => http.put(url, data),
    options
  );
  return {
    mutate,
    isLoading,
  };
};
