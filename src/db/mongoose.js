import mongoose, {Schema} from "mongoose";


mongoose.connect('mongodb://127.0.0.1:27017/samahware', {autoIndex:true}).then((result)=>
{
    console.log("Connected to Database Successfully");

}).catch((error)=>
{
    console.log("Couldn't Connect using Mongoose"+error.toString() );
});


export default {mongoose}