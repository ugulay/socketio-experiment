import { connect } from "socket.io-client";
import resolveArgs from "../utils/resolveArgs";
import crypto from "crypto";
import { TMarketMaker } from "../types/marketMaker";
import { BOT_TYPE } from "../types/botEnums";
import { BOT_EVENTS } from "../types/botEvents";
import "../env";

const {
    SOCKET_HOST,
    SOCKET_PORT
} = process.env;

const BOT_PREFIX = BOT_TYPE.MARKETMAKER;
const BOT_NAME = BOT_PREFIX;

try {

    const resolvedArgs: Required<TMarketMaker> = resolveArgs(["coin", "market", "level", "spread", "weight"]);

    console.log(resolvedArgs);

    const client = connect(`ws://${SOCKET_HOST}:${SOCKET_PORT}`);

    console.log(`${BOT_NAME} connecting`);

    client.on('connect', () => {

        let CLIENT_ID = client.id;
        let parameters: Required<TMarketMaker> = {
            ...resolvedArgs,
            level: Number(resolvedArgs.level),
            spread: Number(resolvedArgs.spread),
            weight: Number(resolvedArgs.weight)
        }
        let HASH = crypto.createHash('sha256').update(JSON.stringify(parameters)).digest('base64');
        parameters.id = CLIENT_ID;
        parameters.hash = HASH;

        client.emit(`${BOT_PREFIX}:${BOT_EVENTS.connect}`, parameters);

        console.log(`${BOT_NAME}`, CLIENT_ID);

    });

} catch (err) {
    console.error(err);
}