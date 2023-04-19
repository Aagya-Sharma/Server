const Category = require('../models/DoctorCategory')

const doctorCategoryCtrl = {
    getCategories: async(req,res) =>{
        try{
            const doctorCategories = await Category.find()
            res.json(doctorCategories)

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async(req,res)=>{
        try{
            const {name} = req.body;
            const category = await Category.findOne({name})
            if(category)  return res.status(400).json({msg:"This doctor category already exists"})

            const newCategory = new Category({name})

            await newCategory.save()

            res.json({msg: "Created a category"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async(req,res)=>{
        try{
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a category"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory: async(req,res)=>{
        try{
            const {name} = req.body;
            await Category.findOneAndUpdate({_id: req.params.id}, {name})
            res.json({msg: "Updated a Category"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = doctorCategoryCtrl