import mongoose, {Schema} from "mongoose";
import {Order} from "./order.js";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    clientId:{
        type:String,
        required:true,
        trim:true,
        unique:true,
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

clientSchema.virtual('salesmanClients',{
    ref:'Salesman',
    localField:'salesmanId',
    foreignField:'salesmanId',
});

clientSchema.statics.paginationCalculator= async function ({page,limit, filter={}})
{
    // Count the total number of orders
    const totalCount = await Client.countDocuments(filter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Build pagination links
    const pagination = {
        currentPage: page,
        totalPages,
    };

    if (page < totalPages) {
        pagination.nextPage = `?page=${page + 1}&limit=${limit}`;
    }

    if (page > 1) {
        pagination.prevPage = `?page=${page - 1}&limit=${limit}`;
    }

    return pagination;
}

clientSchema.pre('find', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});

clientSchema.pre('findOne', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});

export const Client = mongoose.model('Client', clientSchema);