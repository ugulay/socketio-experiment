import { createContext, useContext, useState, useEffect } from 'react';
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const connectionString = String(`ws://${process.env.NEXT_PUBLIC_SOCKET_HOST}:${process.env.NEXT_PUBLIC_SOCKET_PORT}`);
let socketInstance: Socket;

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: any) => {

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect((): any => {

        if (!socketInstance || !socket) {
            socketInstance = io(connectionString, {});
            socketInstance.on("connect", () => setSocket(socketInstance));
            socketInstance.on("disconnect", () => setSocket(null));
            //return () => socketInstance.disconnect();
        }

    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};