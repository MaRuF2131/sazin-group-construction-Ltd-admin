'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSidebar } from '@/context/SidebarContext';
import Image from 'next/image';
import toast from "react-hot-toast";
import axiosInstance from '@/utils/axios';
import { DangerousContentCheck, DateValidationCheck } from '@/utils/custom-validation/CustomValidation';
const Defaultfields = [
  {name:"title", placeholder:"Project title", label:"Project title",type:"text",rules: { required: "title is required",...DangerousContentCheck }},
  {name:"category", label:"Project Type", type: "select",options:["Civil","Electro","Engineering-Procurement","Safe&Security","NHA","PGCB","PWD","BPC", "EED", "LGED","Agro"] , rules: { required: "category is required" } },
  {name:"date", label:"Complete On",type:"date",rules: { required: "Date is required",...DateValidationCheck }},
  {name:"feature", label:"Is Featured",type:"checkbox",rules: { required: "Date is required" }},
  {name:"description", placeholder:"Description", label:"Description", type: "textarea",  rules: { required: "Image is required" ,...DangerousContentCheck} },
  {name:"image", label:"Certificate Image", type: "image",  rules: { required: "Image is required" } },
];
export default function UpdateProjectForm({ updateData, fields=Defaultfields}) {
  const { dynamicTheme } = useSidebar();
  const {item,refetch,path,id,setUpdateData}=updateData;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    criteriaMode: 'all',
    shouldUnregister: true,
    mode: 'onChange',
  });

  const [imagePreviews, setImagePreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const watchImage = watch('image');
  console.log("vid",isValid);
  
  //  Submit Handler
  const SubmitHandler = async (formValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) => {
        if (key === "image" && value && value.length > 0) {
          formData.append("image", value[0]);
        } else {
          formData.append(key, value);
        }
      });

      const result = await axiosInstance.put(`/sazin-construction/manageAction/editAction/update-${path}/${id}`,formData);
      toast.success(result?.data?.message || "Project updated successfully!");
      refetch()
    } catch (error) {
      console.error("Submit error:", error);
      const message = error?.response?.data?.message || "Request failed";
      if (!message) return;
      if (typeof message === "string") toast.error(message);
      else if (Array.isArray(message)) message.forEach((msg) => toast.error(msg));
      else if (typeof message === "object")
        Object.values(message).forEach((val) =>
          Array.isArray(val)
            ? val.forEach((msg) => toast.error(msg))
            : toast.error(val)
        );
    } finally {
      setIsSubmitting(false);
    }
  };

  //  Image preview on change
  useEffect(() => {
    if (!watchImage) return;
    if (watchImage?.length === 1) {
      setImagePreviews({ image: URL.createObjectURL(watchImage[0]) });
    }
  }, [watchImage]);

  //  Load existing data into form
useEffect(() => {
  if (fields && item) {
    const initialValues = {};
    fields.forEach((field) => {
      if (field.type !== "image") {
        let value = item[field.name] || "";

        // ✅ যদি date field হয়, ফরম্যাট করো YYYY-MM-DD তে
        if (field.type === "date" && value) {
          const date = new Date(value);
          value = date.toISOString().split("T")[0]; // "2025-07-21"
        }

        initialValues[field.name] = value;
      }
    });

    reset(initialValues);

    // যদি আগের image থাকে preview এ সেট করো
    if (item.imageUrl) {
      setImagePreviews({ image: item.imageUrl });
    }
  }
}, [item, fields, reset]);


  return (
    <div className="z-[800]   fixed top-16 bottom-2 lg:left-[max(21%,284px)]   left-1 right-1  flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(SubmitHandler)}
        className={`w-full h-full max-w-3xl flex flex-col gap-8 pb-4 ${dynamicTheme.formBg} rounded-xl shadow-lg overflow-auto`}
      >
      <div className='flex item-center justify-between  w-full cursor-pointer sticky z-[999] top-0 bg-gray-400 p-4'>
        <p>{`Update ${path}`}</p> 
        <button
          onClick={()=>setUpdateData(null)}
          className='cursor-pointer text-red-600 text-2xl font-bold'>
          X
        </button>
      </div> 
        {fields.map((field) => {
          return (
            <div key={field.name} className="space-y-2 p-6">
              {/* Checkbox */}
              {field.type === "checkbox" && (
                <label className={`flex items-center gap-2 mb-2 ${dynamicTheme.formLabel}`}>
                  <input
                    type="checkbox"
                    {...register(field.name)}
                    className="w-4 h-4"
                  />
                  {field.label}
                </label>
              )}

              {/* Text, Number, Date */}
              {["text", "number", "date"].includes(field.type) && (
                <>
                  <label className={`block mb-2 font-medium ${dynamicTheme.formLabel}`}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className={`w-full p-4 rounded-lg border outline-none ${dynamicTheme.formInput}`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </>
              )}

              {/* Textarea */}
              {field.type === "textarea" && (
                <>
                  <label className={`block mb-2 font-medium ${dynamicTheme.formLabel}`}>
                    {field.label}
                  </label>
                  <textarea
                    placeholder={field.placeholder}
                    {...register(field.name, field.rules)}
                    className={`w-full p-4 rounded-lg border outline-none ${dynamicTheme.formInput}`}
                    rows={field.rows || 4}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </>
              )}

              {/* Select */}
              {field.type === "select" && (
                <>
                  <label className={`block mb-2 font-medium ${dynamicTheme.formLabel}`}>
                    {field.label}
                  </label>
                  <select
                    {...register(field.name, field.rules)}
                    className={`w-full p-4 rounded-lg border outline-none ${dynamicTheme.formInput}`}
                  >
                    <option value="">Select {field.label}</option>
                    {field?.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </>
              )}

              {/* Image */}
              {field.type === "image" && (
                <div>
                  <label className={`block mb-2 font-medium ${dynamicTheme.formLabel}`}>
                    {field.label}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(field.name)}
                    className="hidden"
                    id={field.name}
                  />
                  <label
                    htmlFor={field.name}
                    className={`cursor-pointer flex justify-center items-center h-auto w-full rounded-xl ${dynamicTheme.imageCard} border border-gray-300`}
                  >
                    {imagePreviews[field.name] ? (
                      <Image
                        src={imagePreviews[field.name]}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="object-cover h-full max-h-[512px] w-full rounded-xl"
                      />
                    ) : (
                      <p className="text-gray-400 flex items-center justify-center min-h-[200px]">
                        📷 Click to Upload Image
                      </p>
                    )}
                  </label>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting }
            className={`${
              (isSubmitting ) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } w-full py-4 rounded-lg text-white font-semibold transition ${dynamicTheme.formButton}`}
          >
            {isSubmitting ? 'Updating...' : `Update ${path}`}
          </button>
        </div>
      </form>
    </div>
  );
}
