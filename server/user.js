const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength: 6
    },
    name:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

// Add a method to check if password is selected
userSchema.methods.isPasswordSelected = function() {
    return this.password !== undefined;
};

module.exports=mongoose.model('user',userSchema);