import React from 'react'
import DynamicTable from '../../components/DynamicTable'

function page() {
  return (
     <div className='  h-full  w-full   mt-4'>
      <DynamicTable th={['Image','Name','Category','Is Feature',]} value="PWD" ky="category" isFeature=''></DynamicTable>
    </div>
  )
}

export default page