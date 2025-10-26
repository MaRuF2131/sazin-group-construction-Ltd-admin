'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaInfoCircle, FaTrash, FaUserTie } from 'react-icons/fa';
import DynamicQuery from '../../components/DynamicQuery';
import Loader from "@/components/Loader";
import ErrorCard from "@/components/ErrorCard";
import DeleteProject from '../../components/DeleteProject';
import { DangerousContentCheck } from '@/utils/custom-validation/CustomValidation';
import UpdateProjectForm from '@/components/DynamicUpdateForm';

export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = DynamicQuery('client');


  const loadMoreRef = useRef();
  const [updateData,setUpdateData]=useState(null);
  const fields = [
    { name:"partner", placeholder: "Enter partner and client", label: "Partner And Client ", type: "text", rules: { required: "Partner And Client is required", ...DangerousContentCheck } },
    { name:"description",placeholder: "Description", label: "description ", type: "textarea", rules: { required: "description is required", ...DangerousContentCheck } }
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
      <Loader type={"clients & partners"}></Loader>
    );

  if (status === "error") return (
      <ErrorCard type={"clients & partners"} refetch={refetch}></ErrorCard>
  );

  // 👇 Read More component
  const ReadMore = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const limit = 120; // কতগুলো অক্ষর পর্যন্ত দেখাবে
    if (!text) return null;
    if (text.length <= limit) return <p>{text}</p>;
    return (
      <p>
        {isExpanded ? text : text.slice(0, limit) + '...'}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 ml-1 font-medium hover:underline"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Client Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our valued partners and clients who trust us with their
            business needs and collaborations.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUserTie />
                      Partner & Client
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Description & Details
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page?.data?.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <FaUserTie className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {item?.partner || 'Unnamed Partner'}
                              </h3>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                Active Partner
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md text-gray-700 dark:text-gray-300 leading-relaxed">
                            <ReadMore
                              text={
                                item?.description ||
                                'No description provided for this client partnership. This section would typically contain detailed information about the collaboration, services provided, and key achievements in the partnership.'
                              }
                            />
                            <div className="flex gap-2 mt-2">
                              <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                Verified
                              </span>
                              <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                Partner
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={()=>setUpdateData({item,path:"client",id:item._id,refetch,setUpdateData})}
                              className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-105 transition-all duration-200 shadow-sm"
                              title="Edit Client"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                             onClick={()=>DeleteProject(item?._id,"client",refetch)}
                              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105 transition-all duration-200 shadow-sm"
                              title="Delete Client"
                            >
                              <FaTrash size={18} />
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

        {/* Mobile Responsive Cards */}
        <div className="lg:hidden space-y-4">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page?.data?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                          {item?.partner || 'Unnamed Partner'}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Trusted Partner
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={()=>setUpdateData({item,path:"client",id:item._id,refetch,setUpdateData})}
                        className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={()=>DeleteProject(item?._id,"client",refetch)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <ReadMore
                      text={
                        item?.description ||
                        'No description provided for this client partnership. This section would typically contain detailed information about the collaboration, services provided, and key achievements in the partnership.'
                      }
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full font-medium">
                      Verified Partner
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium">
                      Collaboration
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full font-medium">
                      Active
                    </span>
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
                Loading more clients...
              </span>
            </div>
          )}
          {!hasNextPage && data?.pages[0]?.data?.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <FaInfoCircle />
              <span className="font-medium">
                All clients loaded successfully
              </span>
            </div>
          )}
        </div>
      </div>

          {updateData && <UpdateProjectForm updateData={updateData} fields={fields}></UpdateProjectForm>}
    </div>
  );
}
