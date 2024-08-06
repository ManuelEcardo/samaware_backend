//Prepare the order style
import constants from "./constants.js";
import {User} from "../models/user.js";
import jwt from "jsonwebtoken";

/** ORDERS PREPARE **/

function prepareOrders({o, pagination})
{
    // const processedOrders = o.map(order => {
    //     const itemsWithDetails = order.items.map(item => {
    //         const details = order.itemsDetails.find(detail => detail.itemId === item.itemId);
    //         return {
    //             itemId: item.itemId,
    //             name: details ? details.name : '',
    //             quantity: item.quantity,
    //             type: item.type
    //         };
    //     });
    //
    //     // Create a shallow copy of the order object to avoid mutating the original one
    //     const orderCopy = { ...order._doc };
    //
    //     // Check if clientDetails exists and assign the first element if it's an array
    //     if (order.clientDetails && Array.isArray(order.clientDetails))
    //     {
    //         orderCopy.clientId = order.clientDetails[0]; // Use the first element
    //     }
    //
    //     else
    //     {
    //         orderCopy.clientId = order.clientDetails; // Assign directly if it's not an array
    //     }
    //
    //     // Remove items from the orderCopy
    //     delete orderCopy.items;
    //     delete orderCopy.clientDetails;
    //
    //     return {
    //         order: orderCopy,
    //         items: itemsWithDetails
    //     };
    // });

    const processedOrders = o.map(order => {
        // Use prepareSingleOrder to process each order
        return prepareSingleOrder({order});
    });

    return {
        orders: processedOrders,
        ...(pagination && { pagination })
    };

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


    // Convert clientDetails to an object if it's an array with one element
    let clientDetails = Array.isArray(order.clientDetails) ? order.clientDetails[0] : order.clientDetails;

    // Ensure clientDetails.salesmanClients is populated
    if (clientDetails && clientDetails.salesmanClients) {
        clientDetails.salesmanId = clientDetails.salesmanClients[0]; // Assign the first salesman client directly to salesmanId
        delete clientDetails.salesmanClients; // Remove the salesmanClients field
    }

    return {
        order: order,
        items: itemsWithDetails,
        clientId: clientDetails,
    };
}


//--------------------

//WORKER PREPARE

/** prepare the workers details **/
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



/** prepare a worker details **/
function prepareSingleWorker({worker})
{
    const preparedOrders = prepareOrders({o:worker.orders});
    const workerObject = worker.toJSON();
    return {
        ...workerObject,
        orders: preparedOrders
    };
}

//--------------------


//INSPECTOR PREPARE

/** prepare inspectors details **/
function prepareInspectors({inspectors})
{
    return inspectors.map(inspector => {
        const preparedOrders = prepareOrders({o:inspector.inspectorOrders});
        const inspectorObject = inspector.toJSON();
        return {
            ...inspectorObject,
            orders: preparedOrders
        };
    });
}

/** prepare an inspector details **/
function prepareSingleInspector({inspector})
{
    const preparedOrders = prepareOrders({o:inspector.inspectorOrders});
    const inspectorObject = inspector.toJSON();
    return {
        ...inspectorObject,
        orders: preparedOrders
    };

}

//PRICE-SETTER PREPARE

/** prepare priceSetters details **/
function preparePriceSetters({priceSetters})
{
    return priceSetters.map(priceSetter => {
        const preparedOrders = prepareOrders({o:priceSetter.priceSetterOrders});
        const priceSetterObject = priceSetter.toJSON();
        return {
            ...priceSetterObject,
            orders: preparedOrders
        };
    });
}


/** prepare a priceSetter details **/
function prepareSinglePriceSetter({priceSetter})
{
    const preparedOrders = prepareOrders({o:priceSetter.priceSetterOrders});
    const priceSetterObject = priceSetter.toJSON();
    return {
        ...priceSetterObject,
        orders: preparedOrders
    };
}


//COLLECTORS PREPARE

/** prepare a collector details **/
function prepareSingleCollector({collector})
{
    const preparedOrders = prepareOrders({o:collector.collectorOrders});
    const collectorObject = collector.toJSON();
    return {
        ...collectorObject,
        orders: preparedOrders
    };

}

//SCANNER PREPARE

/** prepare a scanner details **/
function prepareSingleScanner({scanner})
{
    const preparedOrders = prepareOrders({o:scanner.scannerOrders});
    const scannerObject = scanner.toJSON();
    return {
        ...scannerObject,
        orders: preparedOrders
    };

}

// CLIENTS PREPARE
/** prepare clients details **/
function prepareClients({ c, pagination }) {
    const processedClients = c.map(client => prepareSingleClient(client));

    return {
        clients: processedClients,
        ...(pagination && { pagination })
    };
}

/** prepare a single client details; with Salesman & orders if populated **/
function prepareSingleClient(client){
    const preparedClient = { ...client.toObject() };

    const preparedOrders =  client.clientOrders? prepareOrders({o:client.clientOrders}) : null ;

    // Check if salesmanClients exists and assign the first element if it's an array
    if (client.salesmanClients && Array.isArray(client.salesmanClients)) {
        preparedClient.salesmanId = client.salesmanClients[0]; // Use the first element
    } else {
        preparedClient.salesmanId = client.salesmanClients; // Assign directly if it's not an array
    }

    if (client.clientOrders) {
        preparedClient.orders = preparedOrders;
    }

    return preparedClient;
}

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

/** Notify depends on role, if role is prepared => notify priceSetters**/
function wsNotifyInclinedClients({order})
{
    try
    {
        const status = order.order.status; //Getting the order status

        constants.clients.forEach((client)=>
        {
            switch (status)
            {
                case 'prepared':
                case 'being_priced':

                    if(client.ws.user.role === 'priceSetter')
                    {
                        client.ws.send(JSON.stringify({type:'order'}));
                    }
                    break;

                case 'priced':
                case 'being_verified':
                case 'verified':

                    if(client.ws.user.role === 'inspector')
                    {
                        client.ws.send(JSON.stringify({type:'order'}));
                    }
                    break;

                default:
                    break;
            }
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
            return client.ws.send(JSON.stringify({type: 'order'})); //was stringify(json)
        }
    });
}

/**Returns the order status to be returned depending on the user's role **/
function findTypesByRole({role, isAll: isChecked = false})
{
    switch (role)
    {
        case 'worker':
            return isChecked? ['being_prepared', 'prepared'] : ['waiting_to_be_prepared','being_prepared'];

        case 'priceSetter':
            return isChecked? ['being_priced', 'priced'] : ['prepared', 'being_priced'];


        case 'collector':
            return isChecked? ['being_collected', 'collected'] : ['prepared', 'being_collected'];


        case 'scanner':
            return isChecked? ['being_scanned', 'scanned'] : ['collected', 'being_scanned'];

        case 'inspector':
            return isChecked? ['being_verified', 'verified'] :['scanned', 'being_verified'];

        default:
            return [];

    }
}

/** Returns the type to be filtered depending on role; worker => workerId**/
function filterByRole({role})
{
    switch (role)
    {
        case 'worker':
            return 'workerId';

        case 'priceSetter':
            return 'priceSetterId';

        case 'collector':
            return 'collectorId';

        case 'scanner':
            return 'scannerId';

        case 'inspector':
            return 'inspectorId';

        default:
            return [];
    }
}

export default { prepareOrder: prepareOrders, prepareSingleOrder, prepareWorkers, wsAuth, preparePriceSetters,
                 wsNotifyManager, wsFindClient, wsNotifyInclinedClients, findTypesByRole, prepareInspectors,
                 filterByRole, prepareSingleWorker, prepareSinglePriceSetter, prepareSingleInspector,
                 prepareSingleCollector, prepareSingleScanner, prepareClients, prepareSingleClient
                }