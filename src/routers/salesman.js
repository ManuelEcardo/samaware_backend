import express from "express";
import auth from "../middleware/auth.js";

import {Salesman} from "../models/salesman.js";

const router=express.Router();


/** Salesman Router **/

//Add a new Salesman
router.post('/salesman/add',auth.managerAuth, async (req,res)=>{

    try
    {
        const s= new Salesman(req.body);

        await s.save();

        return res.status(201).send(s);
    }

    catch (e)
    {
        res.status(500).send({error:'Error while adding a salesman...', message:e.message});
    }
});

//Add Multiple Salesman
router.post('/salesman/addMultiple', auth.managerAuth, async (req,res)=>{

    try
    {
        const salesmen= req.body.data;

        if (!salesmen || !Array.isArray(salesmen) || salesmen.length === 0) {
            console.log('NO DATA...');
            return res.status(400).send({ error: 'Invalid data format or empty data array' });
        }

        const result = await Salesman.insertMany(salesmen, {ordered:false});

        if(!result)
        {
            console.log('No Result from inserting multiple salesmen');
            return res.status(400).send({message:'No Result from inserting multiple salesmen'});
        }

        console.log('Inserted Salesmen Successfully');

        res.status(201).send({ message: 'Salesmen inserted successfully' });
    }

    catch (e)
    {
        console.log(`ERROR WHILE ADDING MULTIPLE SALESMEN, ${e.message} ${e.stackTrace}`);
        res.status(500).send({'error':e, message:e.message});
    }
});

//Find Salesman by his salesmanId
router.get('/salesman/salesmanId', auth.managerAuth, async(req,res)=>{

    try
    {
        const id = req.body.id;

        const salesman = await Salesman.findOne({salesmanId: id});

        if(!salesman)
        {
            return res.status(404).send({error:'no salesman with such ID was found'});
        }

        return res.status(200).send(salesman);
    }
    catch (e)
    {
        res.status(500).send({error:'Error while getting a salesman by id...', message:e.message});
    }
});

//Get All Salesmen
router.get('/salesman/all', auth.managerAuth, async (req,res)=>{

    try
    {
        const s = await Salesman.find();

        return res.status(200).send(s);
    }

    catch (e)
    {
        res.status(500).send({error:'Error while getting all salesman...', message:e.message });
    }
});

//Delete a Salesman by his salesmanId
router.delete('/salesman/delete', auth.managerAuth, async (req,res)=>{

    try
    {
        const id= req.body.id;

        const salesman= await Salesman.findOneAndDelete({salesmanId: id});

        if(!salesman)
        {
            return res.status(404).send({error:'No such salesman was found'});
        }

        return res.status(204).send(salesman);
    }

    catch (e)
    {
        res.status(500).send({error:'Error while deleting a salesman...', message:e.message});
    }
});

export default router;