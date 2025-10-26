import React, { useEffect } from 'react'
import { useInfiniteQuery } from "@tanstack/react-query";
// api.js
import axiosInstance from "@/utils/axios";

export const fetchProducts = async (pageParam = 1,path) => {
  const limit = 10;

  // query params build
  const params = new URLSearchParams({
    page: pageParam,
    limit,
  });

   // API call (axios auto json parse kore)
    const res = await axiosInstance.get(
      `/sazin-construction/manageAction/getAction/${path}?${params.toString()}`
     );

   const json = res.data; // ✅ ekhane data ashbe

   console.log("fjhfj", json);

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch products");
  }

  return {
    data: json.data,
    nextPage:
      json.pagination.page < json.pagination.totalPages
        ? pageParam + 1
        : undefined,
  };
};

function DynamicQuery(ky) {
 const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: [ky],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam,ky),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 1000, // 10 seconds
    refetchOnWindowFocus: false,
  });

  return (
    {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
    }
  )
}

export default DynamicQuery