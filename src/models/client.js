import mongoose, {Schema} from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: false,
        trim: false,
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true });


//Telling Mongoose that the Client is foreign key for Order.
clientSchema.virtual('orders',{
    ref:'Order',
    localField:'_id',
    foreignField:'clientId',
});
export const Client = mongoose.model('Client', clientSchema);