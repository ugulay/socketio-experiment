import { useState, useEffect } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const connectionString = String(`ws://${process.env.NEXT_PUBLIC_SOCKET_HOST}:${process.env.NEXT_PUBLIC_SOCKET_PORT}`);
let socketInstance: Socket;

const useSocket = () => {

    const [socket, setSocket] = useState<Socket | null>();

    useEffect(() => {

        if (!socketInstance) socketInstance = io(connectionString, {});
        socketInstance.on("connect", () => setSocket(socketInstance));
        socketInstance.on("disconnect", () => setSocket(null));

    }, [socketInstance]);

    return socket;

}

export default useSocket;