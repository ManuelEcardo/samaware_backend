import mongoose, {Schema} from "mongoose";

const itemSchema = new mongoose.Schema({

    itemId:{
        type:String,
        required:true,
        unique:true,
        trim:false,
    },

    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true, _id:true });


// //Telling Mongoose that the item is foreign key for Order.
// itemSchema.virtual('orderItems',{
//     ref:'Order',
//     localField:'_id', //NOT DEFAULT _ID
//     foreignField:'items.itemId',
// });


export const Item = mongoose.model('Item', itemSchema);