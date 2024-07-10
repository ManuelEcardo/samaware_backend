import express from "express";
import auth from "../middleware/auth.js";
import {Item} from "../models/item.js";


const router= express.Router();


//Add a new item
router.post("/items/add", auth.managerAuth, async (req,res)=>{
    try
    {
        const i = new Item(req.body);

        await i.save();

        res.status(201).send(i);
    }
    catch (e)
    {
        res.status(500).send({error:'Error while creating an item', message:e.message});
    }
});


//Get all items
router.get('/items/',auth.managerAuth,async(req,res)=>{
    try
    {
        const i= await Item.find({});

        return res.status(200).send(i);
    }
    catch (e)
    {
        return res.status(500).send({error:'Error while getting items', message: e.message});
    }
});


//Get a specific item by its samahID
router.get('/items/id', auth.managerAuth, async (req,res)=>{
    try
    {
        const id= req.body.id;

        const i = await Item.findOne({itemId: id});

        if(!i)
        {
            return res.status(404).send({error: 'no item with such id was found'});
        }

        return res.status(200).send(i);
    }
    catch (e)
    {
        res.status(500).send({error:"Couldn't get this specific item by id.", message: e.message});
    }
});

//Delete an item by id
router.delete('/items/delete', auth.managerAuth, async (req,res)=>{

    try
    {
        const id = req.body.id;

        const i = await Item.findOneAndDelete({itemId:id});

        if(!i)
        {
            return res.status(404).send({error:'No such item was found'});
        }

        return res.status(204).send(i);
    }
    catch (e)
    {
        return res.status(500).send({error:"Couldn't delete item", message: e.message});
    }
});


export default router;