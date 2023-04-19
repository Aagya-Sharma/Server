const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.set('debug', true)


mongoose.connect('mongodb://127.0.0.1/Therapy', {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if(!err){
        console.log("connected to the database")
    }else{ 
        console.log("cannot connect to the database ", err)
    }

})
