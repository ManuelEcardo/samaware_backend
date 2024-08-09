import mongoose, {Schema} from "mongoose";
import moment from "moment";
import constants from "../shared/constants.js";


const orderSchema = new mongoose.Schema({

    // Data from Excel File
    orderId:{
        type:String,
        trim:false,
        required:true
    },

    //Fatoura ID gets added from inspector as it gets created in edari then
    fatouraId:{
        type:String,
        required:false,
        trim:true
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

    destination:{
        type:String,
        required:false,
        enum:['مفرق - مدينة وريف','مراكز الشركة - محلات','جملة - حريقة','محافظات'],
    },

    // Dates for each step

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

    being_collected_date:{
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

    collected_date:{
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

    being_scanned_date:{
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

    scanned_date:{
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

    // ids for contributors

    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    priceSetterId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    collectorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    scannerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    inspectorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    clientId: {
        type: String,
        ref: 'Client',
        required: false,
        cast: true,
    },

    //Guys that help to pack the order
    preparationTeam:[
        {
            _id:false,
            name:{
                type:String,
                required:true,
                enum:constants.preparationTeam,
            },
        },
    ],

    status: {
        type: String,
        enum: ['waiting_to_be_prepared', 'being_prepared', 'prepared','being_priced','priced', 'being_collected',
                'collected', 'being_scanned', 'scanned', 'being_verified','verified','re_prepare','waiting_to_ship','stored','shipped','failed'],
        required: true,
        default:'waiting_to_be_prepared'
    },

    failure_reason:{
        type:String,
        required:false,
        enum:['no_available_items_failure','other_reason_failure', //Worker Failures
                'wrong_items_failure' //Inspector Reasons
        ],
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

orderSchema.virtual('clientDetails',{
    ref:'Client',
    localField:'clientId',
    foreignField:'clientId'
});

//Calculate the Pagination and return the data
orderSchema.statics.paginationCalculator= async function ({page,limit, filter={}})
{
    // Count the total number of orders
    const totalCount = await Order.countDocuments(filter);

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

orderSchema.pre('find', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});

orderSchema.pre('findOne', function (next) {
    this.sort({ updatedAt: -1 });
    next();
});
export const Order = mongoose.model('Order', orderSchema);