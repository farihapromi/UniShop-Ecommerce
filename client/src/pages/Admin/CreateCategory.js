import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from "react-hot-toast";
import axios from 'axios'
import CategoryForm from '../../components/Layout/Forms/CategoryForm';
import { Modal } from "antd";

const CreateCategory = () => {
  const[categories,setCategories]=useState([])
  const[name,setName]=useState("")
  const[visible,setVisiable]=useState(false)
  const[selected,setSelected]=useState(null);
  const[updatedName,setUpdatedName]=useState("")


const handleSubmit=async(e)=>{
  e.preventDefault()
  try {
    //method req
    const {data}=await axios.post('/api/v1/category/create-category',{name})
    if(data?.success){
      toast.success(`${name} is created`)
      getAllCategory()
    }
    else{
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error)
    toast.error("Sonething went wrong")

    
  }
}

  const getAllCategory=async()=>{
    try {
      const {data}=await axios.get('/api/v1/category/get-category')
      if(data.success){
       setCategories(data.category)
     
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
      
    }
  }

 useEffect(()=>{
  getAllCategory()

 },[])
 //updated category
 const handleUpdate=async(e)=>{
  e.preventDefault();
  try {
    const {data}=await axios.put(`/api/v1/category/update-category/${selected._id}`,{name:updatedName})
    if(data){
      toast.success(`${updatedName} has been updated`)
      setSelected(null)
      setUpdatedName("")
      setVisiable(false)
      getAllCategory()
      setSelected(null);
     
    }else{
      toast.error(data.error)
    }
    
  } catch (error) {
    toast.error("Something went wrong")
    
  }

 }


 //delete category 
 const handleDelete=async(pId)=>{
 
  try {
    const {data}=await axios.delete(`/api/v1/category/delete-category/${pId}`)
    if(data){
      toast.success(`${name} has been deleted`)
    
      getAllCategory()
    
     
    }else{
      toast.error(data.error)
    }
    
  } catch (error) {
    toast.error("Something went wrong")
    
  }

 }


  return (
    <Layout title={'dashboard create category'}>
    <div className="row">
        <div className="col-md-3">
            <AdminMenu/>
        </div>
        <div className="col-md-9">
            <h3>Manage Category</h3>
            <div className='m-3 p-3 w-50'>
              <CategoryForm
              value={name}
              handleSubmit={handleSubmit}
              setValue={setName}
              
              />

            </div>
            <div className='w-75'>
<table className="table">
  <thead>
    <tr>
    
      <th scope="col">Name</th>
      <th scope="col">Actions</th>
     
    </tr>
  </thead>
  <tbody>
  {
      categories?.map((category)=>(
        <>
        <tr>
        <td key={category._id}>{category.name}</td>
        <td>
          <button className='btn btn-primary ms-2' 
          onClick={()=>
          {setVisiable(true);
          setUpdatedName(category.name);
          setSelected(category);}}
          >Edit</button>
          <button className='btn btn-danger ms-2'
          onClick={()=>handleDelete(category._id)}
          >Delete</button>
        </td>
      
   
   
    </tr>
    </>
    
      
      ))
     }
  
  </tbody>
</table>
  </div>
  <Modal onCancel={()=>setVisiable(false)} footer={null}
  open={visible}
  >
    <CategoryForm value={updatedName} 
    setValue={setUpdatedName}
    handleSubmit={handleUpdate}
    />

  </Modal>
        </div>
    </div>
 </Layout>

  )
}

export default CreateCategory