import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Products = () => {
    const[products,setProducts]=useState([])
    //get all products
    const getAllProducts=async(req,res)=>{
        try {
            const {data}=await axios.get('/api/v1/products/get-product')
            setProducts(data.products)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                message:"Error  in Products"
            })
            
        }

    }
    //lifecycle,multiple funciton pass kora jabe
    useEffect(()=>{
        getAllProducts()
    },[])
  return (
 <Layout>
        <div className="row">
            <div className="col-md-3">
                <AdminMenu/>
            </div>
          <div className="col-md-9">
            <h1 className="text-center">
                All Prodcuts List
            </h1>
            
                 <div className="d-flex flex-wrap">
                {products?.map((product)=>(
                    <Link key={product._id} 
                    to={`/dashboard/admin/products/${product.slug}`}
                    className='product-link'
                     >
                
                   

                 
                    <div class="card m-2" style={{width: "18rem;"}} >
  <img src={`/api/v1/products/product-photo/${product._id}`} height={'200px'}
  className="card-img-top" alt={product.name}/>
  <div class="card-body">
    <h5 class="card-title">{product.name}</h5>
    <p class="card-text">{product.description}</p>
    <p>{product.price}</p>
   
  </div>
  </div>
  </Link>
                ))
               
            }

          </div>

        </div>
        </div>
   
    </Layout>
  )
}

export default Products