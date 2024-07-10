import mongoose, {Schema} from "mongoose";
import moment from "moment";


const orderSchema = new mongoose.Schema({

    orderId:{
        type:String,
        trim:false,
        required:true
    },

    registration_date: {
        type:String,
        cast:false,
        required:true,
        trim:true,
        validate(value)
        {
            return moment(value,'DD/MM/YYYY').isValid();
        },

        set: function (value)
        {
            const date = moment(value, 'DD/MM/YYYY', true);
            if (date.isValid()) {
                return date.format('DD/MM/YYYY');
            }
            return value;
        }
    },

    shipping_date:{
        type:String,
        cast:false,
        required:true,
        trim:true,
        validate(value)
        {
            return moment(value,'DD/MM/YYYY').isValid();
        },

        set: function (value)
        {
            const date = moment(value, 'DD/MM/YYYY', true);
            if (date.isValid()) {
                return date.format('DD/MM/YYYY');
            }
            return value;
        }
    },

    preparation_starting_date:{
        type:String,
        cast:false,
        required:false,
        trim:true,
        validate(value)
        {
            return moment(value,'DD/MM/YYYY HH:mm:ss', true).isValid();
        },

        set: function (value)
        {
            const dateTime = moment(value, 'DD/MM/YYYY HH:mm:ss', true);
            if (dateTime.isValid()) {
                return dateTime.format('DD/MM/YYYY HH:mm:ss');
            }
            return value;
        }
    },

    preparation_end_date:{
        type:String,
        cast:false,
        required:false,
        trim:true,

        validate(value)
        {
            return moment(value,'DD/MM/YYYY HH:mm:ss', true).isValid();
        },

        set: function (value)
        {
            const dateTime = moment(value, 'DD/MM/YYYY HH:mm:ss', true);
            if (dateTime.isValid()) {
                return dateTime.format('DD/MM/YYYY HH:mm:ss');
            }
            return value;
        }
    },

    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: false,
        cast: true,
    },

    status: {
        type: String,
        enum: ['waiting_to_be_prepared', 'being_prepared', 'prepared','being_verified','re_prepare','waiting_to_ship','stored','shipped','failed'],
        required: true,
        default:'waiting_to_be_prepared'
    },

    items:
    [
        {
            //_id:false,

                itemId:{
                    type:String,
                    required:true,
                    ref:"Item",
                },

                quantity: {
                    type: Number,
                    required: true
                },

                type: {
                    type: String,
                    required: true,
                    enum:['dozen','piece'],
                }
        }
    ]

}, { timestamps: true});


// Add virtual for populating items based on itemId
orderSchema.virtual('itemsDetails', {
    ref: 'Item',
    localField: 'items.itemId',
    foreignField: 'itemId',
    justOne: false
});
export const Order = mongoose.model('Order', orderSchema);