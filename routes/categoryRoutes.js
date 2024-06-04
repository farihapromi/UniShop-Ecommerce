import express from 'express'
import {requireSignIn,isAdmin} from '../middlewares/authMiddleware.js'
import { createCategoryController,updateCategoryController,categoryController,singleCategoryController ,deleteCategoryController} from '../controllers/categoryController.js'
const router=express.Router()
//isAdmin pass hobe post a
//create category
router.post('/create-category',requireSignIn,createCategoryController)
//update

router.put('/update-category/:id',requireSignIn,updateCategoryController)

//get all catfegory
router.get('/get-category',categoryController)
//single category
router.get('/single-category/:slug',singleCategoryController)
//delete category,isAdmin o hobe pass
router.delete('/delete-category/:id',requireSignIn,deleteCategoryController)

export default router;
