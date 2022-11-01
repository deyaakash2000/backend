const mongoose = require('mongoose')
const { Schema } = mongoose;
const adminSchema = new Schema({
    name:{
        type :String,
        required : true
    },
    email:{
        type : String,
        required :true,
        unique :true
    },
    password:{
        type : String,
        required :true,
    },
    roll:{
        type : String,
        required :true,
    },date: {
        type: Date,
        default: Date.now,
      },
});
const Admin = mongoose.model('studentlogin',adminSchema)
module.exports = Admin