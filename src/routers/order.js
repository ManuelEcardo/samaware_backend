import express from "express";
import {Order} from "../models/order.js";
import auth from "../middleware/auth.js";
import components from "../shared/components.js";
import socketManager from '../index.js';
import constants from "../shared/constants.js";

const router= express.Router();

//Get All Orders in the system
router.get('/orders', auth.managerAuth,  async (req,res)=>{
    /** Paginated **/

    try
    {
        const page = parseInt(req.query.page) || constants.pageDefault; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || constants.limitDefault; // Number of posts per page, default to 3

        // Calculate the skip value
        const skip = (page - 1) * limit;

        const o = await Order.find({},null,{limit:limit, skip:skip, sort:{updatedAt:-1, createdAt:-1}}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'});


        //Calculate the pagination and return it in a Map.
        const pagination= await Order.paginationCalculator({page:page, limit:limit});

        return res.status(200).send(components.prepareOrder({o:o, pagination:pagination}));
    }

    catch (e)
    {
        console.log(`COULDN'T GET ORDERS, ${e.message}`);

        res.status(400).send({error:"Couldn't get all orders", message:e.message});
    }
});

//Get a specific order by its samahID
router.get('/orders/id', auth.managerAuth, async (req,res)=>{

    try
    {
        const id= req.body.id;

        const order = await Order.findOne({orderId: id}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'});


        if(!order)
        {
            return res.status(404).send({error: 'no order with such id was found'});
        }


        return res.status(200).send(components.prepareSingleOrder({order:order}));


        //return res.status(200).send(o);
    }

    catch (e)
    {
        res.status(500).send({error:"Couldn't get this specific order by id.", message: e.message});
    }
});

//Get a worker's orders waiting to be prepared
router.get('/orders/workerRole/waiting_me', auth.userAuth,async (req,res)=>{

    try
    {
        const orderTypes= components.findTypesByRole({role:req.user.role, isAll:false});

        const filterId = components.filterByRole({role:req.user.role});

        const o = await Order.find({[filterId]: req.user._id, status: {$in:orderTypes, }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        if(!o)
        {
            return res.status(200).send({});
        }

        return res.status(200).send(components.prepareOrder({o:o}));
    }

    catch (e)
    {
        res.status(500).send({error:"Couldn't get your waiting orders.", message:e.message});
    }
});


//Get a priceSetters orders waiting to be prepared; no Id because they assign it to themselves by patchOrder...
router.get('/orders/priceSetter/waiting_me', auth.userAuth,async (req,res)=>{

    try
    {

        const filterId = components.filterByRole({role:req.user.role});

        const o = await Order.find({ status: {$in:['prepared'], }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        const o2 = await Order.find({[filterId]: req.user._id, status: {$in:['being_priced'], }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});


        // Merge the two arrays of orders, one wi
        const combinedOrders = [...o, ...o2];

        if(!combinedOrders)
        {
            return res.status(200).send({});
        }

        return res.status(200).send(components.prepareOrder({o:combinedOrders}));
    }

    catch (e)
    {
        res.status(500).send({error:"Couldn't get your waiting orders.", message:e.message});
    }
});


//Get a priceSetters orders waiting to be prepared; no Id because they assign it to themselves by patchOrder...
router.get('/orders/inspector/waiting_me', auth.userAuth,async (req,res)=>{

    try
    {

        const filterId = components.filterByRole({role:req.user.role});

        const o = await Order.find({ status: {$in:['priced'], }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        const o2 = await Order.find({[filterId]: req.user._id, status: {$in:['being_verified'], }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});


        // Merge the two arrays of orders, one wi
        const combinedOrders = [...o, ...o2];

        if(!combinedOrders)
        {
            return res.status(200).send({});
        }

        return res.status(200).send(components.prepareOrder({o:combinedOrders}));
    }

    catch (e)
    {
        res.status(500).send({error:"Couldn't get your waiting orders.", message:e.message});
    }
});


//Gets for: WORKER: [being-prepared, prepared] / PRICE-SETTER: [priced, being_priced] / INSPECTOR: [verified, being_verified]
router.get('/orders/doneMe', auth.userAuth, async (req,res)=>{
    //Todo paginate???
    try
    {
        const orderTypes= components.findTypesByRole({role:req.user.role, isAll:true});

        const filterId = components.filterByRole({role:req.user.role});

        const o = await Order.find({[filterId]: req.user._id, status: {$in:orderTypes, }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        if(!o)
        {
            return res.status(200).send({});
        }

        return res.status(200).send(components.prepareOrder({o:o}));
    }

    catch (e)
    {
        res.status(500).send({error:"Couldn't get your waiting orders.", message:e.message});
    }
});


//Gets all order of a Worker / Price-Setter / Inspector
router.get('/orders/me',auth.userAuth, async(req,res)=>{
    /** Paginated **/

    try
    {
        const page = parseInt(req.query.page) || constants.pageDefault; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || constants.limitDefault; // Number of posts per page, default to 3

        // Calculate the skip value
        const skip = (page - 1) * limit;

        const filterId = components.filterByRole({role:req.user.role});

        const o= await Order.find({[filterId]: req.user._id}, null, {limit:limit, skip:skip, sort:{createdAt:-1}}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'} );

        if(!o)
        {
            return res.status(200).send({});
        }

        //Calculate the pagination and return it in a Map.
        const pagination= await Order.paginationCalculator({page:page, limit:limit, filter:{[filterId]:req.user._id} });

        return res.status(200).send(components.prepareOrder({o:o, pagination:pagination}));
    }
    catch (e)
    {
        res.status(500).send({error:"Couldn't get your orders.", message:e.message});
    }
});

//Get non-ready orders
router.get('/orders/nonReady', auth.managerAuth, async(req,res)=>{
    try
    {
        const o = await Order.find({'status':{$nin:['stored','failed','shipped'], }},null,{ sort:{createdAt:-1}}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'});

        return res.status(200).send(components.prepareOrder({o:o}));

    }
    catch (e)
    {
        console.log(`COULDN'T GET PENDING ORDERS, ${e.message}`);

        res.status(400).send({error:"Couldn't get pending orders", message:e.message});
    }
});

//Create an Order
router.post('/orders/create',auth.managerAuth,async (req,res)=>{

    try
    {
        const order = new Order(req.body);

        await order.save();

        await (await (await (await order.populate('workerId')).populate('priceSetterId')).populate('inspectorId')).populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'}); //Population

        const populatedOrder= components.prepareSingleOrder({order:order});


        components.wsFindClient({clientId:req.body.workerId, json:{type:'order', order:populatedOrder}});

        res.status(201).send(populatedOrder);

    }

    catch (e)
    {
        console.log(`Couldn't create an order, ${e}`);
        res.status(500).send({error:"Couldn't create an order", message:e.message});
    }
});

//Delete an Order by id
router.delete('/orders/delete', auth.managerAuth, async(req,res)=>{

    try
    {
        const o = await Order.findOneAndDelete({_id:req.body.id});

        if(!o)
        {
            return res.status(404).send({error:'No such order exists'});
        }

        return res.status(200).send(o);
    }
    catch (e)
    {
        res.status(500).send(e);
    }
});

//Update an Order
router.patch('/orders/patch', auth.userAuth, async (req,res)=>{

    try
    {
        const id= req.body.id;

        //Setting allowed keys to be updated
        const updates= Object.keys(req.body);

        const nonAllowedUpdates = ['items'];
        const isInvalid = updates.some((update) => nonAllowedUpdates.includes(update));

        // If a non-allowed key was updated
        if (isInvalid) {
            return res.status(400).send({ 'error': 'A Not Allowed Field has been used' });
        }

        // Update the order
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true } // Return the updated document
        ).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({ path: 'itemsDetails', model: 'Item', select: 'itemId name color' });

        if (!updatedOrder) {
            return res.status(404).send({ error: 'No order with such id was found' });
        }

        // Prepare the response
        const populatedOrder = components.prepareSingleOrder({ order: updatedOrder });

        res.status(200).send(populatedOrder);

        components.wsNotifyManager({order:populatedOrder});

        components.wsNotifyInclinedClients({order:populatedOrder});

    }
    catch (e)
    {
        res.status(500).send({error:"Couldn't patch your order.", message:e.message});
    }
});


/** Worker Orders **/

//Get Orders of a specific worker
router.get('/orders/worker/:id',auth.managerAuth,async (req,res)=>{

    /** Paginated **/

    try
    {
        const id = req.params.id;

        const page = parseInt(req.query.page) || constants.pageDefault; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || constants.limitDefault; // Number of posts per page, default to 3

        // Calculate the skip value
        const skip = (page - 1) * limit;

        const o = await Order.find({workerId:id}, null, {limit:limit, skip:skip, sort:{createdAt:-1}}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        if(!o)
        {
            return res.status(404).send({error:'No Orders have been found'});
        }

        //Calculate the pagination and return it in a Map.
        const pagination= await Order.paginationCalculator({page:page, limit:limit, filter:{workerId:id} });

        return res.status(200).send(components.prepareOrder({o:o, pagination: pagination}));
    }

    catch (e)
    {
        console.log(`Couldn't get orders of this worker, ${e.message}`);
        res.status(400).send({error:"Couldn't get the orders of this worker", message:e.message});
    }
});



/** PriceSetters Orders **/

//Get Orders of a specific priceSetter
router.get('/orders/priceSetter/:id',auth.managerAuth,async (req,res)=>{

    /** Paginated **/

    try
    {
        const id = req.params.id;

        const page = parseInt(req.query.page) || constants.pageDefault; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || constants.limitDefault; // Number of posts per page, default to 3

        // Calculate the skip value
        const skip = (page - 1) * limit;

        const o = await Order.find({priceSetterId:id}, null, {limit:limit, skip:skip, sort:{createdAt:-1}}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        if(!o)
        {
            return res.status(404).send({error:'No Orders have been found'});
        }

        //Calculate the pagination and return it in a Map.
        const pagination= await Order.paginationCalculator({page:page, limit:limit, filter:{priceSetterId:id} });

        return res.status(200).send(components.prepareOrder({o:o, pagination: pagination}));
    }

    catch (e)
    {
        console.log(`Couldn't get orders of this price Setter, ${e.message}`);
        res.status(400).send({error:"Couldn't get the orders of this price Setter", message:e.message});
    }
});



/** Inspectors Orders **/

//Get Orders of a specific inspector
router.get('/orders/inspector/:id',auth.managerAuth,async (req,res)=>{

    /** Paginated **/

    try
    {
        const id = req.params.id;

        const page = parseInt(req.query.page) || constants.pageDefault; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || constants.limitDefault; // Number of posts per page, default to 3

        // Calculate the skip value
        const skip = (page - 1) * limit;

        const o = await Order.find({inspectorId:id}, null, {limit:limit, skip:skip, sort:{createdAt:-1}}).populate('workerId').populate('priceSetterId').populate('inspectorId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        if(!o)
        {
            return res.status(404).send({error:'No Orders have been found'});
        }

        //Calculate the pagination and return it in a Map.
        const pagination= await Order.paginationCalculator({page:page, limit:limit, filter:{inspectorId:id} });

        return res.status(200).send(components.prepareOrder({o:o, pagination: pagination}));
    }

    catch (e)
    {
        console.log(`Couldn't get orders of this inspector, ${e.message}`);
        res.status(400).send({error:"Couldn't get the orders of this inspector", message:e.message});
    }
});

export default router;