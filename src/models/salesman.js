import mongoose, {Schema} from "mongoose";

const salesmanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    salesmanId:{
        type:String,
        required:true,
        trim:true
    },

}, { timestamps: true });


//Telling Mongoose that the Client is foreign key for Order.
salesmanSchema.virtual('salesmanClients',{
    ref:'Client',
    localField:'salesmanId',
    foreignField:'salesmanId',
});
export const Salesman = mongoose.model('Salesman', salesmanSchema);