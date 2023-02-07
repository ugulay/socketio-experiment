//import useSocket from 'src/hooks/useSocket';
import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socketContext';

const Index = () => {

    const socket = useContext(SocketContext);

    return (<div>

        Socket ID : {socket?.id}

    </div>)
}

export default Index;