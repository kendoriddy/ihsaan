import http from "../axios/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
// // for handling GET requests
// export const useFetch = (
//   key,
//   url,
//   success,
//   errorfn,
//   refetchInterval,
//   enabled = true,
//   retry
// ) => {
//   const {
//     isLoading,
//     isFetching,
//     data,
//     error,
//     isError,
//     refetch,
//     isInitialLoading,
//   } = useQuery([key], async () => http.get(url), {
//     onSuccess: success,
//     onError: errorfn,
//     enabled,
//     refetchInterval,
//     staleTime: Infinity,
//     retry,
//   });

//   return {
//     isLoading,
//     data,
//     error,
//     isError,
//     refetch,
//     isInitialLoading,
//     isFetching,
//   };
// };

// export const usePost = (url, options) => {
//   const { mutate, isLoading } = useMutation(
//     (postData) => http.post(url, postData),
//     options
//   );

//   return {
//     mutate: mutate,
//     isLoading,
//   };
// };

// export const useDelete = (url, options) => {
//   const { mutate, isLoading } = useMutation(
//     (id) => http.delete(`${url}/${id}`),
//     options
//   );
//   return {
//     mutate,
//     isLoading,
//   };
// };

// export const usePut = (url, options) => {
//   const { mutate, isLoading } = useMutation(async ({ id, data }) => {
//     try {
//       const response = await http.put(`${url}/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw error; // Ensure error is thrown
//     }
//   }, options);
//   return {
//     mutate,
//     isLoading,
//   };
// };

// export const usePut2 = (options) => {
//   const { mutate, isLoading } = useMutation(async ({ url, data }) => {
//     try {
//       const response = await http.put(url, data);
//       return response.data;
//     } catch (error) {
//       throw error; // Ensure error is thrown
//     }
//   }, options);

//   return {
//     mutate,
//     isLoading,
//   };
// };

// export const useProfileUpdate = (url, options) => {
//   const { mutate, isLoading } = useMutation(
//     (data) => http.put(url, data),
//     options
//   );
//   return {
//     mutate,
//     isLoading,
//   };
// };

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
  } = useQuery(
    [key],
    async () =>
      http.get(url.startsWith("http") ? url : `${http.defaults.baseURL}${url}`),
    {
      onSuccess: success,
      onError: errorfn,
      enabled,
      refetchInterval,
      staleTime: Infinity,
      retry,
    }
  );

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
    (postData) =>
      http.post(
        url.startsWith("http") ? url : `${http.defaults.baseURL}${url}`,
        postData
      ),
    options
  );

  return {
    mutate,
    isLoading,
  };
};

export const useDelete = (url, options) => {
  const { mutate, isLoading } = useMutation(
    (id) =>
      http.delete(
        `${
          url.startsWith("http") ? url : `${http.defaults.baseURL}${url}`
        }/${id}`
      ),
    options
  );
  return {
    mutate,
    isLoading,
  };
};

export const usePut = (url, options) => {
  const { mutate, isLoading } = useMutation(async ({ id, data }) => {
    try {
      const response = await http.put(
        `${
          url.startsWith("http") ? url : `${http.defaults.baseURL}${url}`
        }/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, options);
  return {
    mutate,
    isLoading,
  };
};

export const usePut2 = (options) => {
  const { mutate, isLoading } = useMutation(async ({ url, data }) => {
    try {
      const response = await http.put(
        url.startsWith("http") ? url : `${http.defaults.baseURL}${url}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, options);

  return {
    mutate,
    isLoading,
  };
};

export const useProfileUpdate = (url, options) => {
  const { mutate, isLoading } = useMutation(
    (data) =>
      http.put(
        url.startsWith("http") ? url : `${http.defaults.baseURL}${url}`,
        data
      ),
    options
  );
  return {
    mutate,
    isLoading,
  };
};
