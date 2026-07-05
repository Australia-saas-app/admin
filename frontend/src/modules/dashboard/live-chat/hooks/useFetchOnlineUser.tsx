import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "./useChatContext";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Fetcher function for SWR
const fetcher = async (url: string) => fetch(url).then((res) => res.json());

// Custom hook using SWR
export const useFetchOnlineUsers = (search = "") => {
  const { updateOnlineUsers, updateSearch } = useChatContext();
  const apiUrl = `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/users/user-conversation-request`;

  // Create cache key that includes search parameter
  const cacheKey = search
    ? `${apiUrl}?search=${encodeURIComponent(search)}`
    : apiUrl;

  const {
    data: onlineUsers,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(cacheKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 5000, // Refresh every 5 seconds
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    onError: (error) => {
      console.error("Failed to fetch users:", error);
    },
    onSuccess: (data) => {
      console.log("Users fetched successfully:", data);
    },
  });

  // Manual refresh function
  const refreshUsers = useCallback(() => {
    mutate();
  }, [mutate]);

  // Search function that updates the cache key
  const searchUsers = useCallback(
    (searchTerm: string) => {
      const searchUrl = searchTerm
        ? `${apiUrl}?search=${encodeURIComponent(searchTerm)}`
        : apiUrl;
      mutate(fetcher(searchUrl));
      updateSearch(searchTerm);
    },
    [apiUrl, mutate, updateSearch]
  );

  //

  // Update state when search term changes
  useEffect(() => {
    updateOnlineUsers(onlineUsers || []);
  }, [updateOnlineUsers, onlineUsers]);

  return {
    isLoading,
    isValidating,
    error,
    refreshUsers,
    mutate,
  };
};
