"use client";
import {FaEdit, FaTrash } from "react-icons/fa";

export default function BlogCard({ post,dlt ,update }) {
  return (
<article className=" flex flex-col items-start justify-between gap-3 border w-full max-w-[400px] h-auto   border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
          <div className="p-3 w-full text-xl">
               {post?.equipment}
          </div>
          <div className="p-3 w-full">
                 {post?.description}
          </div>
         <div className=" px-2 flex items-center justify-center gap-3 w-full">
                      <button
                        onClick={update}
                        className="p-2 rounded-full hover:bg-green-100 text-green-600"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={dlt}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
           </div>
    </article>
  );
}
