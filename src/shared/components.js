//Prepare the order style
import constants from "./constants.js";
import {User} from "../models/user.js";
import jwt from "jsonwebtoken";

/** ORDERS PREPARE **/

function prepareOrders({o})
{
    return o.map(order =>
    {
        const itemsWithDetails = order.items.map(item =>
        {
            const details = order.itemsDetails.find(detail => detail.itemId === item.itemId);
            return {
                itemId: item.itemId,
                name: details ? details.name : '',
                quantity: item.quantity,
                type: item.type
            };
        });

        order.items=null; //Don't want the items to be returned

        return {
            // _id:order._id,
            // orderId: order.orderId,
            // registration_date: order.registration_date,
            // shipping_date: order.shipping_date,
            // status: order.status,
            // workerId: order.workerId,
            // items: itemsWithDetails
            order:order,
            items:itemsWithDetails,
        };
    });

}

/** Prepare a single order **/
function prepareSingleOrder({order})
{
    const itemsWithDetails = order.items.map(item =>
    {
        const details = order.itemsDetails.find(detail => detail.itemId === item.itemId);
        return {
            itemId: item.itemId,
            name: details ? details.name : '',
            quantity: item.quantity,
            type: item.type,
        };
    });

    order.items=null; //Don't want the items to be returned

    return {
        // _id:order._id,
        // orderId: order.orderId,
        // registration_date: order.registration_date,
        // shipping_date: order.shipping_date,
        // preparation_starting_date: order.preparation_starting_date,
        // preparation_end_date: order.preparation_end_date,
        // status: order.status,
        // workerId: order.workerId,
        // clientId: order.clientId,
        order:order,
        items: itemsWithDetails,
    };
}


//--------------------

//WORKER PREPARE

/** prepare the worker details **/
function prepareWorkers({workers})
{
    return workers.map(worker => {
        const preparedOrders = prepareOrders({o:worker.orders});
        const workerObject = worker.toJSON();
        return {
            ...workerObject,
            orders: preparedOrders
        };
    });
}

//--------------------


//WEB SOCKETS

/** Authentication WS **/
async function wsAuth (message)
{
    try{
        const token= message.token;

        const data= jwt.verify(token,constants.SignKey);

        const user= await User.findOne({_id:data._id, 'tokens.token':token }) //Find a user with his ID and with this Token, if found => Authenticated

        if(!user)
        {
            return false;
        }

        console.log(`${user._id} is Authenticated WS`);

        return user;

    }catch (e) {
        return null;
    }
}


/**Check what does this WS message mean**/
function analyzeWsMessage(msg)
{
    switch (msg.todo)
    {
        //Assign => an order will be sent to a worker
        case 'assign':
            console.log('');
            break;

        //Update order data or status
        case 'update':
            console.log('');
            break;

        default:
            break;

    }
}


/** Notify manager via ws **/
function wsNotifyManager({order})
{
    try
    {
        constants.wsManager.forEach((manager)=>
        {
            manager.ws.send(JSON.stringify({type:'order'}));
            //manager.ws.send(JSON.stringify({type:'order', order:order}));
        });
    }
    catch (e)
    {
        console.log(`Error in wsNotifyManager, ${e.toString()}`);
    }
}

/**Find Client and send data **/
function wsFindClient({clientId, json})
{
    constants.clients.forEach(function (client)
    {
        if(client.ws.user._id.toString() === clientId.toString())
        {
            return client.ws.send(JSON.stringify(json));
        }
    });
}

export default {prepareOrder: prepareOrders, prepareSingleOrder, prepareWorkers, wsAuth, analyzeWsMessage, wsNotifyManager, wsFindClient}