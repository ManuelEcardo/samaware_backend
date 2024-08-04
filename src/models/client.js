import mongoose, {Schema} from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    clientId:{
        type:String,
        required:true,
        trim:true
    },

    details:{
        type:String,
        trim:true,
        required:false,
    },

    location:{
        type:String,
        trim:true,
        required:true,
    },

    storeName:{
        type:String,
        trim:true,
        required:false,
    },

    //Using his salesmanId not _id
    salesmanId:{
        type: String,
        required:false,
        ref:'Salesman',
    },

}, { timestamps: true });


//Telling Mongoose that the Client is foreign key for Order.
clientSchema.virtual('clientOrders',{
    ref:'Order',
    localField:'_id',
    foreignField:'clientId',
});

export const Client = mongoose.model('Client', clientSchema);