const mongoose = require('mongoose')
const signUpShema = new mongoose.Schema({
    name:{
     type:String,
     required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

    
});
module.exports =   mongoose.model('signup',signUpShema);