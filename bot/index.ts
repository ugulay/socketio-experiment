import { Server } from "socket.io";
import { TMarketMaker } from "./types/marketMaker";
import { BOT_TYPE } from "./types/botEnums";
import { BOT_EVENTS } from "./types/botEvents";
import "./env";

const {
    SOCKET_PORT
} = process.env;

console.log(`Socket server starting`);

const server = new Server(Number(SOCKET_PORT), {
    cors: {
        origin: '*',
    }
});

let ids = Array();

server.on("connection", (socket) => {

    const CLIENT_ID = socket.id;
    ids.push(CLIENT_ID);

    // ... BOT:connect
    socket.on(`${BOT_TYPE.MARKETMAKER}:${BOT_EVENTS.connect}`, (data: Required<TMarketMaker>) => {

        // Prevent connection with hash (parameters of bot) same bot parameters for duplication.
        const hash = data.hash;
        let found = false;
        server.sockets.sockets.forEach(dat => {
            if (dat.data.hash === hash && dat.data.botType === BOT_TYPE.MARKETMAKER) {
                found = true;
                socket.disconnect(true);
                return;
            }
        });

        if (!found) {
            socket.data = { ...data, botType: BOT_TYPE.MARKETMAKER }
            console.log(`${BOT_TYPE.MARKETMAKER} Connected : `, socket.id);
        }

    })

    // ... When a socket drops/disconnect
    socket.on("disconnect", (reason) => {
        console.log(`Client dropped : `, CLIENT_ID);
        ids.splice(ids.indexOf(CLIENT_ID), 1);
    });

});

setInterval(() => {
    console.log(ids);
    server.sockets.sockets.forEach(dat => {
        //console.log(dat.client.request.headers);
    })
}, 2000);