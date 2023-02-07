import { Server } from "socket.io";
import { TMarketMaker } from "./types/marketMaker";
import { BOT_TYPE } from "./types/botEnums";
import { BOT_EVENTS } from "./types/botEvents";
import { spawn, SpawnOptionsWithoutStdio } from "child_process";
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

const executor = async (params: any, args?: string[], options?: SpawnOptionsWithoutStdio): Promise<any> => new Promise((resolve, reject) => {
    try {
        const exe = spawn(params, args, {
            env: process.env,
            ...options
        });
        return resolve(exe);
    } catch (err) {
        return reject(err);
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

    });

    socket.on(`${BOT_TYPE.MARKETMAKER}:${BOT_EVENTS.init}`, async (data: Required<TMarketMaker>) => {
        try {
            console.log(`${BOT_TYPE.MARKETMAKER} initiated : `, data, socket.id);
            const args = Object.entries(data).map(i => i.join('='));
            const child = await executor(`start npm run dev:client-marketMaker`, args, { shell: true });
            console.log({ child });

        } catch (err) {
            console.log(err);
        }
    });

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