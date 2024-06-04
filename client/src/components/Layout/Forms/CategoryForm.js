import React from 'react'

const CategoryForm = ({value,setValue,handleSubmit}) => {
  return (
  <>
  <form onSubmit={handleSubmit}>
  <div className="mb-3">
   
    <input type="text" className="form-control"
     placeholder='Enter New Category' 
     
     value={value}
     onChange={(e)=>setValue(e.target.value)}
     />
   
  
  <button type="submit" className="btn btn-primary mt-3">Submit</button>
  </div>
</form>

</>
  )
}

export default CategoryForm