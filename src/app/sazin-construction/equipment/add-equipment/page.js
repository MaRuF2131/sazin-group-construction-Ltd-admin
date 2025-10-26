'use client'
import React from 'react'
import DynamicForm from '@/components/DynamicForm'
import { DangerousContentCheck } from '@/utils/custom-validation/CustomValidation';
import axiosInstance from '@/utils/axios';
const fields = [
  { name: "equipment", placeholder: "Equipment or Capability Name", label: "Equipment or Capability Name", type: "text", rules: { required: "Equipment or Capability Name is required", ...DangerousContentCheck } },
  { name: "description", placeholder: "Equipment or Capability description", label: "Equipment or Capability description", type: "text", rules: { required: "Equipment or Capability description is required", ...DangerousContentCheck } },
];
const onSubmit=async(data) => {
  try{
    const response=await  axiosInstance.post('/sazin-construction/addAction/add-equipment', data)
       return response;
  }catch(error){
      throw error;
    };
}
function page() {
  return (
    <div>
      <DynamicForm fields={fields} onSubmit={onSubmit} />
    </div>
  )
}

export default page