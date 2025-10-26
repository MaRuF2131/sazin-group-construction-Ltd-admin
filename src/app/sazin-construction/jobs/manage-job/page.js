'use client';
import React, { useRef, useEffect} from "react";
import DynamicQuery from "../../components/DynamicQuery";
import JobsTable from "./component/JobsTable";
import Loader from "@/components/Loader";
import ErrorCard from "@/components/ErrorCard";
import { FaInfoCircle } from "react-icons/fa";

export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = DynamicQuery("jobs");


  const loadMoreRef = useRef();


  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    if (status === 'pending')
    return (
      <Loader type={"jobs"}></Loader>
    );

  if (status === "error") return (
      <ErrorCard type={"jobs"} refetch={refetch}></ErrorCard>
  );

  const jobs = data?.pages?.flatMap((page) => page?.data) || [];

  return (
    <>
      <JobsTable jobs={jobs} refetch={refetch} />
        {/* Load more / end indicator */}
        <div ref={loadMoreRef} className="w-full text-center mt-8">
          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Loading more jobs...
              </span>
            </div>
          )}
          {!hasNextPage && data?.pages[0]?.data?.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <FaInfoCircle />
              <span className="font-medium">
                All jobs loaded successfully
              </span>
            </div>
          )}
        </div>
    </>
  );
}