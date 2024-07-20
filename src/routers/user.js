import express from "express";
import {User} from "../models/user.js";
import auth from "../middleware/auth.js";
import components from "../shared/components.js";
import socketManager from '../index.js';
const router= express.Router();

/** USERS API **/

//Add a New User
router.post('/addUser', async (req,res)=>{
    
    try
    {
        const user= new User(req.body);

        await user.save();
        const token=await user.generateAuthToken();

        res.status(201).send({user, token, success:1});
    }
    
    catch (e) {
        console.log(`Error While Adding a user, ${e}`);
        res.status(400).send({error:"Couldn't Sign you", message:e.message , success:0});
    }
});

//Get All Users,  Parameters are: PATH - Middleware - Handlers
router.get('/users', auth.userAuth, async (req, res) => {
    try {
        const u= await User.find({});
        res.status(200).send(u)
    }
    catch (e) {
        res.status(500).send(e);
    }
})

//Get Your User Data,  Parameters are: PATH - Middleware - Handlers
router.get('/users/me', auth.userAuth, async (req, res) => {
    res.status(201).send(req.user); // The User came from request since we did it in the auth.auth function, we did set the req.user to the user that was found.
});

//Get a Specific User with ID
router.get('/users/:id',auth.userAuth, async (req, res) => {

    try {
        const id = req.params.id;
        const u = await User.findById(id);
        if(!u)
        {
            return res.status(404).send({'error':'No User has been found'});
        }
        res.status(200).send(u);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Update a User
router.patch('/users/me', auth.userAuth, async (req, res) => {
    const updates= Object.keys(req.body);
    const allowedUpdates=['name','last_name','password','email'];

    const isValid= updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid)
    {
        return res.status(404).send({'error':'A Not Allowed Field has been used'});
    }

    try {
        //This Method was used instead of findByIdAndUpdate, so it runs through the middleware. LOAD  USER by ID, then SET HIS DATA, then user.save()

        const user= req.user;

        //Check for the provided email, if it exists then deny the user request
        if(updates.includes('email'))
        {
            const e = await User.findOne({email:req.body['email']});

            if(e)
            {
                return res.status(400).send({'error':'This email has been used before'});
            }
        }

        updates.forEach((update)=>
        {
            user[update]=req.body[update];
        });

        await user.save();

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if (!user) {
            return res.status(404).send({'error': 'no such user has been found'});
        }

        res.send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }

});

//Login a User
router.post('/users/login', async (req,res)=>{

    try {
        const user= await User.findByCredentials(req.body.email,req.body.password);

        const token= await user.generateAuthToken();

        res.send({user,token, success:1});
    }catch (e) {
        res.status(400).send({'error':'Couldn\'t Login', 'message':e.toString(), success:0});
    }
});

//Logout a User
router.post('/users/logout',auth.userAuth, async(req, res)=>{

    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        }); //Removing the token that the user provided from the token lists.

        await req.user.save(); //Saving that user

        res.status(200).send({'message':'Logged out successfully'});
    }

    catch (e) {
        res.status(500).send(e);
    }
});

//Logout of all Tokens for a User
router.post('/users/logoutAll',auth.userAuth, async (req, res)=>{

    try{
        req.user.tokens=[];

        await req.user.save();
        res.status(200).send({'message':'Logged Out of all devices Successfully'});
    }

    catch (e) {
        res.status(500).send(e);
    }

});

//Delete a User, uses middleware for auth.authentication
router.delete('/users/delete', auth.userAuth, async (req, res) => {
    try {
        const u = await User.findOneAndDelete(req.user._id);
        if (!u) {
            res.status(404).send({'error': 'no such user'}); //Was 4040
        }

        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});



/** WORKERS **/


//Get Workers with their orders
router.get('/workers/details',auth.managerAuth,async (req,res)=>{
    try
    {
        const u = await User.find({role:'worker'}).populate({
            path: 'orders',
            options: { sort: { updatedAt: -1 } },
            populate: [
                {
                    path: 'itemsDetails',
                    model: 'Item',
                    select: 'itemId name color',
                },

                {
                    path:'inspectorId',
                    model:'User'
                },

                {
                    path:'priceSetterId',
                    model:'User'
                },
            ],

        });

        if(!u)
        {
            return res.status(404).send({'error':'No workers have been found'});
        }

        res.status(200).send(components.prepareWorkers({workers:u}));

    }
    catch (e)
    {
        console.log(`Error While getting workers, ${e}`);
        res.status(400).send({error:"Couldn't get workers", message:e.message});
    }
});

//Get Workers, only for manager
router.get('/workers/all',auth.managerAuth,async (req,res)=>{

    try
    {

        const u = await User.find({role:'worker'});

        if(!u)
        {
            return res.status(404).send({'error':'No workers have been found'});
        }

        res.status(200).send({workers:u});

    }
    catch (e)
    {
        console.log(`Error While getting workers, ${e}`);
        res.status(400).send({error:"Couldn't get workers", message:e.message});
    }
});

//Get a Specific Worker with data By ID
router.get('/worker/:id',auth.managerAuth, async (req, res) => {

    try {
        const id = req.params.id;
        const u = await User.findOne({_id:id, role:'worker'}).populate({
            path: 'orders',
            options: { sort: { updatedAt: -1 } },
            populate: [
                {
                    path: 'itemsDetails',
                    model: 'Item',
                    select: 'itemId name color',
                },

                {
                    path:'inspectorId',
                    model:'User'
                },

                {
                    path:'priceSetterId',
                    model:'User'
                },
            ],

        });

        if(!u)
        {
            return res.status(404).send({'error':'No Worker has been found'});
        }

        res.status(200).send(components.prepareSingleWorker({worker:u}));

        //res.status(200).send(u);
    }
    catch (e)
    {
        res.status(500).send({error:'Error while getting worker details by ID', message:e.message});
    }
});



/** PriceSetters **/


//Get all priceSetters, no details
router.get('/priceSetters/all', auth.managerAuth, async(req,res)=>{

    try
    {
        const u= await User.find({role:'priceSetter'});

        if(!u)
        {
            return res.status(404).send({'error':'No priceSetters have been found'});
        }

        res.status(200).send({priceSetters:u});
    }
    catch (e)
    {
        console.log(`ERROR WHILE GETTING ALL PRICE SETTERS, ${e.message}`);

        res.status(500).send({error:'ERROR WHILE GETTING ALL PRICE SETTERS', message:e.message});
    }
});


//Get PriceSetters with their details
router.get('/priceSetters/details',auth.managerAuth,async (req,res)=>{
    try
    {
        const u = await User.find({role:'priceSetter'}).populate({
            path: 'priceSetterOrders',
            options: { sort: { updatedAt: -1 } },
            populate:[
                {
                    path: 'itemsDetails',
                    model: 'Item',
                    select: 'itemId name color',
                },

                {
                    path:'workerId',
                    model:'User'
                },

                {
                    path:'inspectorId',
                    model:'User'
                },
            ],
        },);

        if(!u)
        {
            return res.status(404).send({'error':'No priceSetters have been found'});
        }

        res.status(200).send(components.preparePriceSetters({priceSetters:u}));

    }
    catch (e)
    {
        console.log(`Error While getting workers, ${e}`);
        res.status(400).send({error:"Couldn't get workers", message:e.message});
    }
});

//Get a Specific priceSetter with data By ID
router.get('/priceSetter/:id',auth.managerAuth, async (req, res) => {

    try {
        const id = req.params.id;
        const u = await User.findOne({_id:id, role:'priceSetter'}).populate({
            path: 'priceSetterOrders',
            options: { sort: { updatedAt: -1 } },
            populate: [
                {
                    path: 'itemsDetails',
                    model: 'Item',
                    select: 'itemId name color',
                },

                {
                    path:'workerId',
                    model:'User'
                },

                {
                    path:'inspectorId',
                    model:'User'
                },
            ],

        });

        if(!u)
        {
            return res.status(404).send({'error':'No priceSetter has been found'});
        }

        res.status(200).send(components.prepareSinglePriceSetter({priceSetter:u}));

    }
    catch (e)
    {
        res.status(500).send({error:'Error while getting priceSetter details by ID', message:e.message});
    }
});



/** Inspector **/


//Get all inspectors, no details
router.get('/inspectors/all', auth.managerAuth, async(req,res)=>{

    try
    {
        const u= await User.find({role:'inspector'});

        if(!u)
        {
            return res.status(404).send({'error':'No priceSetters have been found'});
        }

        res.status(200).send({inspectors:u});
    }
    catch (e)
    {
        console.log(`ERROR WHILE GETTING ALL INSPECTORS, ${e.message}`);

        res.status(500).send({error:'ERROR WHILE GETTING ALL PRICE SETTERS', message:e.message});
    }
});

//Get Inspectors with their details
router.get('/inspectors/details',auth.managerAuth,async (req,res)=>{
    try
    {
        const u = await User.find({role:'inspector'}).populate({
            path: 'inspectorOrders',
            options: { sort: { updatedAt: -1 } },
            populate: [
                {
                    path: 'itemsDetails',
                    model: 'Item',
                    select: 'itemId name color',
                },

                {
                    path:'workerId',
                    model:'User'
                },

                {
                    path:'priceSetterId',
                    model:'User'
                },
            ],
        });

        if(!u)
        {
            return res.status(404).send({'error':'No inspectors have been found'});
        }

        res.status(200).send(components.prepareInspectors({inspectors:u}));

    }
    catch (e)
    {
        console.log(`Error While getting workers, ${e}, ${e.stack}`);
        res.status(400).send({error:"Couldn't get workers", message:e.message});
    }
});

//Get a Specific inspector with data By ID
router.get('/inspector/:id',auth.managerAuth, async (req, res) => {

    try {
        const id = req.params.id;
        const u = await User.findOne({_id:id, role:'inspector'}).populate({
            path: 'inspectorOrders',
            options: { sort: { updatedAt: -1 } },
            populate: [
                {
                    path: 'itemsDetails',
                    model: 'Item',
                    select: 'itemId name color',
                },

                {
                    path:'workerId',
                    model:'User'
                },

                {
                    path:'priceSetterId',
                    model:'User'
                },
            ],

        });

        if(!u)
        {
            return res.status(404).send({'error':'No inspector has been found'});
        }

        res.status(200).send(components.prepareSingleInspector({inspector:u}));

    }
    catch (e)
    {
        res.status(500).send({error:'Error while getting inspector details by ID', message:e.message});
    }
});


export default router