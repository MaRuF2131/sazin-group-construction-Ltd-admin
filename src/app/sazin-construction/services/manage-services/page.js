'use client'
import React, { useRef, useEffect, useState } from "react";
import Card from './component/Card'
import DynamicQuery from "../../components/DynamicQuery";
import Loader from "@/components/Loader";
import ErrorCard from "@/components/ErrorCard";
import { FaInfoCircle } from "react-icons/fa";
import UpdateProjectForm from "@/components/DynamicUpdateForm";
import { DangerousContentCheck } from "@/utils/custom-validation/CustomValidation";
import DeleteProject from "../../components/DeleteProject";

export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = DynamicQuery('service');

  const loadMoreRef = useRef();

    const [updateData,setUpdateData]=useState(null);
    const fields = [
      { name: "service", placeholder: "Enter service name", label: "Service Name", type: "text", rules: { required: "Service Name is required", ...DangerousContentCheck } },
      {name: "description", placeholder: "Enter service description", label: "Service Description", type: "textarea", rules: { required: "Service Description is required", ...DangerousContentCheck } },
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
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'pending')
    return (
      <Loader type={"services"}></Loader>
    );

  if (status === "error") return (
      <ErrorCard type={"services"} refetch={refetch}></ErrorCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of professional services designed to meet your needs
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page?.data?.map((item, index) => (
                <div key={`${i}-${index}`} className="transform hover:scale-105 transition-all duration-300">
                  <Card post={item} update={()=>setUpdateData({item,path:"service",id:item._id,refetch,setUpdateData})} dlt={()=>DeleteProject(item?._id,"service",refetch)}/>
                </div>
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
                Loading more services...
              </span>
            </div>
          )}
          {!hasNextPage && data?.pages[0]?.data?.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <FaInfoCircle />
              <span className="font-medium">
                All services loaded successfully
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!data?.pages[0]?.data?.length && (
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <div className="w-32 h-32 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border border-gray-200 dark:border-neutral-700">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Services Available</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
            We are currently updating our service offerings. Please check back later for our latest services.
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Refresh Services
          </button>
        </div>
      )}

      {updateData && <UpdateProjectForm updateData={updateData} fields={fields}></UpdateProjectForm>}
    </div>
  );
}
