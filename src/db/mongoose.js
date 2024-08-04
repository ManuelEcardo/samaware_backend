import mongoose, {Schema} from "mongoose";
import constants from "../shared/constants.js";

mongoose.connect(constants.localUrl, {autoIndex:true}).then((result)=>
{
    console.log("Connected to Database Successfully");

}).catch((error)=>
{

    console.log("Couldn't Connect using Mongoose"+error.toString() );
});


export default {mongoose}