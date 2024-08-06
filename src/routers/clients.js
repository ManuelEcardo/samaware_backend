import express from "express";
import {Client} from "../models/client.js";
import auth from "../middleware/auth.js";
import constants from "../shared/constants.js";
import {Order} from "../models/order.js";
import components from "../shared/components.js";


const router= express.Router();

/** Client API **/

//Add Single Client
router.post('/clients/add', auth.managerAuth, async (req,res)=>{

    try
    {
     const client = new Client(req.body);

     await client.save();

     res.status(201).send(client);
    }

    catch (e)
    {
        res.status(500).send({error: 'Error while adding a client...', message:e.message});
    }
});

//Add Multiple Clients
router.post('/clients/addMultiple', auth.managerAuth, async (req,res)=>{

    try
    {
        const clients= req.body.data;

        if (!clients || !Array.isArray(clients) || clients.length === 0) {
            console.log('NO DATA...');
            return res.status(400).send({ error: 'Invalid data format or empty data array' });
        }

        const result = await Client.insertMany(clients, {ordered:false});

        if(!result)
        {
            console.log('No Result from inserting multiple clients');
            return res.status(400).send({message:'No Result from inserting multiple clients'});
        }

        console.log('Inserted Clients Successfully');

        res.status(201).send({ message: 'Clients inserted successfully' });
    }

    catch (e)
    {
        console.log(`ERROR WHILE ADDING MULTIPLE CLIENTS, ${e.message} ${e.stackTrace}`);
        res.status(500).send({'error':e, message:e.message});
    }
});

//Find Client by his clientId
router.get('/clients/clientId', auth.managerAuth, async(req,res)=>{

    try
    {
        const id = req.body.id;

        const client = await Client.findOne({clientId: id}).populate('salesmanClients').populate('clientOrders');

        if(!client)
        {
            return res.status(404).send({error:'no client with such ID was found'});
        }

        return res.status(200).send(components.prepareSingleClient(client));
    }

    catch (e)
    {
        res.status(500).send({error:'Error while getting a client by id...', message:e.message});
    }
});

//Get All Clients
router.get('/clients/all', auth.managerAuth, async(req,res)=>{

    /** Paginated **/

    try
    {
        const page = parseInt(req.query.page) || constants.pageDefault; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || constants.clientLimitDefault; // Number of posts per page, default to 15

        // Calculate the skip value
        const skip = (page - 1) * limit;

        const c = await Client.find({},null,{limit:limit, skip:skip, sort:{updatedAt:-1, createdAt:-1}}).populate('salesmanClients');


        //Calculate the pagination and return it in a Map.
        const pagination= await Client.paginationCalculator({page:page, limit:limit});

        return res.status(200).send(components.prepareClients({c:c, pagination:pagination}));
    }

    catch (e)
    {
        res.status(500).send({error:'Error while getting all clients...', message:e.message});
    }
});

//Delete a Client by his clientId
router.delete('/clients/delete', auth.managerAuth, async (req,res)=>{

    try
    {
        const id= req.body.id;

        const client= await Client.findOneAndDelete({clientId: id});

        if(!client)
        {
            return res.status(404).send({error:'No such client was found'});
        }

        return res.status(204).send(client);
    }

    catch (e)
    {
        res.status(500).send({error:'Error while deleting a client...', message:e.message});
    }
});

export default router;