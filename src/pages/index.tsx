//import useSocket from 'src/hooks/useSocket';
import { useContext, useState, useEffect, ChangeEvent } from 'react';
import { SocketContext } from '../context/socketContext';
import { BOT_TYPE } from '../../bot/types/botEnums';
import { BOT_EVENTS } from '../../bot/types/botEvents';

type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
}

const Index = () => {

    const socket = useContext(SocketContext);
    const [botParams, setBotParams] = useState<any>({
        coin: "",
        market: "",
        level: 0,
        spread: 0,
        weight: 0,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        // No longer need to cast to any - hooray for react!
        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value, botParams);
        let data = botParams;
        data[name] = value;
        setBotParams(data);
    }

    const addBotAction = () => {
        socket?.emit(`${BOT_TYPE.MARKETMAKER}:${BOT_EVENTS.init}`, botParams);
    }

    return (<div className={"container mx-auto"}>

        <p>Socket ID : {socket?.id}</p>

        <br />

        <p>Coin</p>
        <input className={"border"} name="coin" onChange={(e) => handleChange(e)} />

        <p>Market</p>
        <input className={"border"} name="market" onChange={(e) => handleChange(e)} />

        <p>Level</p>
        <input className={"border"} name="level" onChange={(e) => handleChange(e)} />

        <p>Spread</p>
        <input className={"border"} name="spread" onChange={(e) => handleChange(e)} />

        <p>Weight</p>
        <input className={"border"} name="weight" onChange={(e) => handleChange(e)} />

        <br /><br />
        <button className={"border"} onClick={(e) => { addBotAction() }}>Add new bot</button>

    </div>)
}

export default Index;