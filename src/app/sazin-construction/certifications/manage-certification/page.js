'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaInfoCircle, FaTrash } from 'react-icons/fa';
import DynamicQuery from '../../components/DynamicQuery';
import Loader from "@/components/Loader";
import ErrorCard from "@/components/ErrorCard";
import { DangerousContentCheck } from '@/utils/custom-validation/CustomValidation';
import UpdateProjectForm from '@/components/DynamicUpdateForm';
import DeleteProject from '../../components/DeleteProject';

export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = DynamicQuery('certificate');


  const loadMoreRef = useRef();
  const [updateData,setUpdateData]=useState(null);
  const fields = [
    {
      name: 'certificateName',
      placeholder: 'Certificate Name',
      label: 'Certificate Name',
      type: 'text',
      rules: { required: 'Image is required', ...DangerousContentCheck },
    },
    {
      name: 'image',
      label: 'Certificate Image',
      type: 'image',
      rules: { required: 'Image is required' },
    },
  ];

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'pending')
    return (
      <Loader type={"certifications"}></Loader>
    );

  if (status === "error") return (
      <ErrorCard type={"certifications"} refetch={refetch}></ErrorCard>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your certificates and credentials
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Certificate Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page?.data?.map((cert, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                          {cert?.certificateName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cert?.imageUrl ? (
                            <div className="flex items-center">
                              <img
                                src={cert.imageUrl}
                                alt={cert.imageUrl}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                              />
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={()=>setUpdateData({item:cert,path:"certificate",id:cert._id,refetch,setUpdateData})}
                              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 ease-in-out transform hover:scale-105"
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={()=>DeleteProject(cert?._id,"certificate",refetch)}
                              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 ease-in-out transform hover:scale-105"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page?.data?.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200 ease-in-out"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full mb-2">
                        #{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cert?.title}
                      </h3>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={()=>setUpdateData({item:cert,path:"certificate",id:cert._id,refetch,setUpdateData})}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                       onClick={()=>DeleteProject(cert?._id,"certificate",refetch)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {cert?.image ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>
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
                Loading more certifications...
              </span>
            </div>
          )}
          {!hasNextPage && data?.pages[0]?.data?.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <FaInfoCircle />
              <span className="font-medium">
                All certifications loaded successfully
              </span>
            </div>
          )}
        </div>
      </div>

      {updateData && <UpdateProjectForm updateData={updateData} fields={fields}></UpdateProjectForm>}
    </div>
  );
}
