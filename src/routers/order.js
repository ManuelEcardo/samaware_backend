import express from "express";
import {User} from "../models/user.js";
import {Order} from "../models/order.js";
import auth from "../middleware/auth.js";
import components from "../shared/components.js";
import socketManager from '../index.js';
import constants from "../shared/constants.js";
const router= express.Router();

//Get All Orders in the system
router.get('/orders', auth.managerAuth,  async (req,res)=>{

    try
    {
        const o = await Order.find({},null,{ sort:{createdAt:-1}}).populate('workerId').populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'});


        // const populatedOrders = o.map(order => {
        //     const itemsWithDetails = order.items.map(item => {
        //         const details = order.itemsDetails.find(detail => detail.itemId === item.itemId);
        //         return {
        //             itemId: item.itemId,
        //             name: details ? details.name : '',
        //             quantity: item.quantity,
        //             type: item.type
        //         };
        //     });
        //     return {
        //         orderId: order.orderId,
        //         registration_date: order.registration_date,
        //         shipping_date: order.shipping_date,
        //         status: order.status,
        //         workerId: order.workerId,
        //         items: itemsWithDetails
        //     };
        // });

        return res.status(200).send(components.prepareOrder({o:o}));
    }

    catch (e)
    {
        console.log(`COULDN'T GET ORDERS, ${e.message}`);

        res.status(400).send({error:"Couldn't get all orders", message:e.message});
    }
});

//Get Orders of a specific worker
router.get('/orders/worker/:id',auth.managerAuth,async (req,res)=>{

    try
    {
        const id = req.params.id;

        const o = await Order.find({workerId:id}, null, { sort:{createdAt:-1}}).populate('workerId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

        if(!o)
        {
            return res.status(404).send({error:'No Orders have been found'});
        }

        // const populatedOrders = o.map(order => {
        //     const itemsWithDetails = order.items.map(item => {
        //         const details = order.itemsDetails.find(detail => detail.itemId === item.itemId);
        //         return {
        //             itemId: item.itemId,
        //             name: details ? details.name : '',
        //             quantity: item.quantity,
        //             type: item.type
        //         };
        //     });
        //     return {
        //         orderId: order.orderId,
        //         registration_date: order.registration_date,
        //         shipping_date: order.shipping_date,
        //         status: order.status,
        //         workerId: order.workerId,
        //         items: itemsWithDetails
        //     };
        // });

        return res.status(200).send(components.prepareOrder({o:o}));
    }

    catch (e)
    {
        console.log(`Couldn't get orders of this worker, ${e.message}`);
        res.status(400).send({error:"Couldn't get the orders of this worker", message:e.message});
    }
});

//Get a specific order by its samahID
router.get('/orders/id', auth.managerAuth, async (req,res)=>{

    try
    {
        const id= req.body.id;

        const order = await Order.findOne({orderId: id}).populate('workerId').populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'});


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
router.get('/orders/waiting_me', auth.userAuth,async (req,res)=>{

    try
    {
        const o = await Order.find({workerId: req.user._id, status: {$in:['waiting_to_be_prepared','being_prepared'], }}, null, { sort:{createdAt:-1}} ).populate('workerId').populate({path: 'itemsDetails',model: 'Item', select: 'itemId name color'});

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

//Get non-ready orders
router.get('/orders/nonReady', auth.managerAuth, async(req,res)=>{
    try
    {
        const o = await Order.find({'status':{$nin:['stored','failed','shipped'], }},null,{ sort:{createdAt:-1}}).populate('workerId').populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'});

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

        await (await order.populate('workerId')).populate({path: 'itemsDetails', model: 'Item', select: 'itemId name color'}); //Population

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

        // const allowedUpdates=['id','registration_date','shipping_date','preparation_starting_date','preparation_end_date', 'workerId', 'clientId', 'status'];
        //
        // const isValid= updates.every((update)=>allowedUpdates.includes(update));
        //
        // //If a non allowed key was updated
        // if(!isValid)
        // {
        //     return res.status(400).send({'error':'A Not Allowed Field has been used'});
        // }

        // Update the order
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: id },
            { $set: req.body },
            { new: true } // Return the updated document
        ).populate('workerId').populate({ path: 'itemsDetails', model: 'Item', select: 'itemId name color' });

        if (!updatedOrder) {
            return res.status(404).send({ error: 'No order with such id was found' });
        }

        // Prepare the response
        const populatedOrder = components.prepareSingleOrder({ order: updatedOrder });

        res.status(200).send(populatedOrder);

        components.wsNotifyManager({order:populatedOrder});

    }
    catch (e)
    {
        res.status(500).send({error:"Couldn't patch your order.", message:e.message});
    }
});


//Testing Web Sockets inside the APIS, TBD
router.get('/orders/ooo', async(req,res)=>{

    // Send WebSocket message to a specific client
    const targetClient = constants.clients.get('123'); // Assuming clientId is stored in the order and is unique

    if (targetClient) {
        targetClient.ws.send(JSON.stringify({
            type: 'order_created',
            order: 'ord'
        }));
    }
    res.send({ok:'ok'});
});
export default router;