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

    //Times for each step

    waiting_to_be_prepared_date:{
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

    being_prepared_date:{
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

    prepared_date:{
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

    being_priced_date:{
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

    priced_date:{
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

    being_verified_date:{
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

    verified_date:{
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

    waiting_to_ship_date:{
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

    stored_date:{
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

    shipped_date:{
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

    failed_date:{
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

    re_prepare_date:{
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
        enum: ['waiting_to_be_prepared', 'being_prepared', 'prepared','being_priced','priced',
                'being_verified','verified','re_prepare','waiting_to_ship','stored','shipped','failed'],
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

orderSchema.pre('find', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});

orderSchema.pre('findOne', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});
export const Order = mongoose.model('Order', orderSchema);