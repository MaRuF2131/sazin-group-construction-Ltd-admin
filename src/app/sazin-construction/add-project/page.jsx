"use client"
import React from 'react'
import DynamicForm from '@/components/DynamicForm'
import { DangerousContentCheck, DateValidationCheck } from '@/utils/custom-validation/CustomValidation';
import axiosInstance from '@/utils/axios';
const fields = [
  {name:"title", placeholder:"Project title", label:"Project title",type:"text",rules: { required: "title is required",...DangerousContentCheck }},
  {name:"category", label:"Project Type", type: "select",options:["Civil","Electro","Engineering-Procurement","Safe&Security","NHA","PGCB","PWD","Agro"] , rules: { required: "category is required" } },
  {name:"date", label:"Complete On",type:"date",rules: { required: "Date is required",...DateValidationCheck }},
  {name:"feature", label:"Is Featured",type:"checkbox",rules: { required: "Date is required" }},
  {name:"description", placeholder:"Description", label:"Description", type: "textarea",  rules: { required: "Image is required" ,...DangerousContentCheck} },
  {name:"image", label:"Certificate Image", type: "image",  rules: { required: "Image is required" } },
];
const onSubmit = async(data) => {
  try{
     const response= await  axiosInstance.post('/sazin-construction/addAction/add-project', data)
      return response
  }catch(error){
      throw error
    }; 
}
function page() {
  return (
    <div>
      <DynamicForm fields={fields} onSubmit={onSubmit}/>
    </div>
  )
}

export default page