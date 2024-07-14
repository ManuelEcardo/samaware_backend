import mongoose, {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import constants from "../shared/constants.js";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },

    last_name:{
        type:String,
        cast:false,
        required:true,
        trim:true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw Error('The Email Provided is not a correct syntax.');
            }
        },
    },

    password: {
        type:String,
        //cast:false,
        required:true,
        trim:true,
        minLength:7,
        validate(value){
            if(value.toLowerCase().includes('password')) //The Password contains the word password
            {
                throw Error('Password format is not correct');
            }
        },
    },

    tokens:
        [
            {
                token:{
                    type:String,
                    required:true
                },
            }
        ],

    role: {
        type: String,
        enum: ['manager', 'worker', 'priceSetter', 'inspector'],
        required: true
    }

    }, {timestamps:true});

userSchema.plugin(uniqueValidator);


//Telling Mongoose that the user is foreign key for order.
userSchema.virtual('orders',{
    ref:'Order',
    localField:'_id',
    foreignField:'workerId',
});

//Hashing Password before Saving
userSchema.pre('save',async function (next){
    const user=this;

    if(user.isModified('password')) //Check if the password is being changed => Hash it
    {
        console.log('in Pre User, Hashing Password...');
        user.password= await bcrypt.hash(user.password,8);
    }

    next(); //Call it so Mongoose knows we are done doing the Middleware work
});

userSchema.pre('find', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});

userSchema.pre('findOne', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});


//Create a function to findCredentials
userSchema.statics.findByCredentials= async (email,password)=>{

    const user= await User.findOne({email});
    if(!user)
    {
        throw Error('Unable to Login, No Such user exists');
    }

    //Hash the password and compare it to the stored hash.
    const isMatch=await bcrypt.compare(password,user.password);

    //Password is Wrong
    if(!isMatch)
    {
        throw Error('Wrong Credentials');
    }

    return user;
}

//Generate Authorization Tokens.
userSchema.methods.generateAuthToken= async function() {
    const user=this;
    const token= jwt.sign({_id: user._id.toString()}, constants.SignKey);

    user.tokens=user.tokens.concat({token}); //Adding Token to the user database, so we can get it later on
    await user.save();

    return token;
};


userSchema.methods.toJSON= function()
{
    const user=this; //Get the value of what is referencing it
    const userObject= user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};


export const User= mongoose.model('User',userSchema);