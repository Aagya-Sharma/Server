const Doctors = require('../models/DoctorModel')


class APIfeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString =  queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
      
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))
        
     
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
 
     //    gte = greater than or equal
     //    lte = lesser than or equal
     //    lt = lesser than
     //    gt = greater than
    
        this.query.find(JSON.parse(queryStr))
        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    } 

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const doctorCtrl = {
    getDoctors:  async(req, res)=>{
        try{
            console.log(req.query);
            const features = new APIfeatures(Doctors.find(), req.query)
            .filtering().sorting().paginating()
            const doctors = await features.query
            res.json({
                status: 'success',
                result: doctors.length,
                doctors: doctors
            })

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    createDoctor: async(req, res)=>{
        try{
            const {doctor_id, title, name, price, description, content, images, category} = req.body;
            if(!images)
            return res.status(400).json({msg: "No image upload"})

            const doctor = await Doctors.findOne({doctor_id})
            if(doctor)
            return res.status(400).json({msg: "This doctor already exists."})

            const newDoctor = new Doctors({
                doctor_id, title, name, price, description, content, images, category
            })

            await newDoctor.save()
            res.json({msg: "Created a new doctor"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteDoctor: async(req,res) =>{
        try{
            await Doctors.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Doctor"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateDoctor: async(req,res)=>{
        try{
            const {title, name, price, description, content, images, category} = req.body;
            if(!images)
            return res.status(400).json({msg: "No image upload"})

            await Doctors.findByIdAndUpdate({_id: req.params.id},{
                title, name, price, description,content, images, category
            })

            res.json({msg: "Updated a doctor"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
    

}

module.exports = doctorCtrl