'use client'
import Card from '../components/card'
import React, { useRef, useEffect, use } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "./FetchFunction";
import ErrorCard from '@/components/ErrorCard';
import Loader from '@/components/Loader';
import { FaInfoCircle } from 'react-icons/fa';

export default function QueryFunction({value ,ky, isFeature=''}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ["products",value,ky],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam,value,ky ,isFeature ),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 1000, // 10 seconds
    refetchOnWindowFocus: false,
  });


  const loadMoreRef = useRef();

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

 if (status === 'pending')
    return (
      <Loader type={"products"}></Loader>
    );

  if (status === "error") return (
      <ErrorCard type={"products"} refetch={refetch}></ErrorCard>
  );

  return (
      <>

        <Card data={data} refetch={refetch} />
  

        {/* Load more / end indicator */}
        <div ref={loadMoreRef} className="w-full text-center mt-8">
          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Loading more products...
              </span>
            </div>
          )}
          {!hasNextPage && data?.pages[0]?.data?.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <FaInfoCircle />
              <span className="font-medium">
                All products loaded successfully
              </span>
            </div>
          )}
        </div>
    </>
  );
}
