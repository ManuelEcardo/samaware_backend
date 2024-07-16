import express from 'express';
import mongoose from './db/mongoose.js';
import cors from 'cors';

import userRouter from './routers/user.js';
import orderRouter from './routers/order.js';
import itemRouter from './routers/item.js';
import expressWs from 'express-ws';
import constants from "./shared/constants.js";
import components from "./shared/components.js";

const app= express();
const port=3000;

const expressWebSocket = expressWs(app);
const wsApp= expressWebSocket.app;

app.use(cors());

app.use(express.json());

app.use(userRouter);
app.use(orderRouter);
app.use(itemRouter);



//Get the WebSocket info
let socketManager=expressWebSocket.getWss('/webSocket');

wsApp.ws('/webSocket',function (ws,req){ //was (ws,req).

    console.log(`Client has Connected to Web Socket`);

    //On Message Received
    ws.on('message', async (message) =>
    {
        try
        {
            const msg = JSON.parse(message); //Parse the message to JSON

            let user =await components.wsAuth(msg);

            if(user)
            {
                ws.user=user; //Setting the user to be used later on

                //Check if registration
                if(msg.type=== 'register' && msg.clientId)
                {
                    if(ws.user.role ==='manager')
                    {
                        constants.wsManager.set(msg.clientId.toString(), {ws, ip:req.socket.remoteAddress });
                        console.log(`Registered manager with id: ${msg.clientId} and IP: ${req.socket.remoteAddress}`);
                    }

                    else
                    {
                        constants.clients.set(msg.clientId.toString(), { ws, ip: req.socket.remoteAddress, role:ws.user.role });

                        console.log(`Registered client with id: ${msg.clientId} and IP: ${req.socket.remoteAddress}`);
                    }

                }

                else if (msg.type === 'message' && msg.clientId)
                {

                    // // Send message to specific client
                    // const targetClient = constants.clients.get(msg.clientId);
                    //
                    // if (targetClient)
                    // {
                    //     targetClient.ws.send(JSON.stringify({ from: msg.id, message: msg.content }));
                    // }
                }
            }

            else
            {
                socketManager.clients.forEach(function (client) {
                    if (client===ws && client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({error: 'Error While Authenticating', message: 'Not Authorized'}));
                    }
                });
            }

        }

        catch (e) {
            console.error('WebSocket Error:', e);

            // Handle the error or send an error response to the client if needed.
            // For example:
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ error: 'Error in WebSocket communication', message: e.message }));
            }
        }

    });

    ws.on('close', () => {
        console.log(`Client disconnected`);
        // Remove client from the map
        for (let [id, client,role] of constants.clients.entries())
        {
            if (client.ws === ws) {
                constants.clients.delete(id);
                console.log(`Removed client with id: ${id}`);
                break;
            }
        }

        for (let [id, client,role] of constants.wsManager.entries())
        {
            if (client.ws === ws) {
                constants.wsManager.delete(id);
                console.log(`Removed manager with id: ${id}`);
                break;
            }
        }
    });
});

app.listen(port,()=>
{
    console.log(`Express is Up on port ${port}`);
});


export default socketManager