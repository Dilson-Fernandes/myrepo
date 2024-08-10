const mongoose=require ('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required:true
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema);
module.exports= User ;