'use client';
import React, { useEffect, useRef, useState } from 'react';
import DynamicQuery from '../../components/DynamicQuery';
import Card from './component/Card';
import Loader from "@/components/Loader";
import ErrorCard from "@/components/ErrorCard";
import { FaInfoCircle } from 'react-icons/fa';
import UpdateProjectForm from '@/components/DynamicUpdateForm';
import { DangerousContentCheck } from '@/utils/custom-validation/CustomValidation';
import DeleteProject from '../../components/DeleteProject';

export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = DynamicQuery('equipment');

  useEffect(() => {
    refetch();
  }, [refetch]);

  const loadMoreRef = useRef();

  const [updateData,setUpdateData]=useState(null);
  const fields = [
      { name: "equipment", placeholder: "Equipment or Capability Name", label: "Equipment or Capability Name", type: "text", rules: { required: "Equipment or Capability Name is required", ...DangerousContentCheck } },
    ];

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
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'pending')
    return (
      <Loader type={"equipments"}></Loader>
    );

  if (status === "error") return (
      <ErrorCard type={"equipments"} refetch={refetch}></ErrorCard>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Equipment Catalog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our comprehensive collection of equipment and tools
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page?.data?.map((item, index) => (
                <Card key={`${i}-${index}`} post={item} dlt={()=>DeleteProject(item?._id,"equipment",refetch)} update={()=>setUpdateData({item,path:"equipment",id:item._id,refetch,setUpdateData})}/>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Load more / end indicator */}
        <div ref={loadMoreRef} className="w-full text-center mt-8">
          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Loading more equipments...
              </span>
            </div>
          )}
          {!hasNextPage && data?.pages[0]?.data?.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <FaInfoCircle />
              <span className="font-medium">
                All equipments loaded successfully
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!data?.pages[0]?.data?.length && (
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Equipment Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            We could not find any equipment matching your criteria. Please check
            back later.
          </p>
        </div>
      )}

          {updateData && <UpdateProjectForm updateData={updateData} fields={fields}></UpdateProjectForm>}
    </div>
  );
}
