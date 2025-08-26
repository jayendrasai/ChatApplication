//This context manages the socket connection and makes it available
import React, {createContext , useContext , useEffect , ReactNode } from 'react';
import { socket } from '../lib/socket';
import {useAuth} from './AuthProvider';

const SocketContext = createContext(socket);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({children}:{children : ReactNode}) => {
    const {accessToken , isAuthenticated } = useAuth();

    useEffect(() =>{
        if(isAuthenticated && accessToken){
            //Attach the auth token to the socket connection
            socket.auth = {token : accessToken};
            //manually connect the socket
            socket.connect();
        }
        //Disconnect the socket when the component unmounts or user logs out
        return () => {
            socket.disconnect();
        };
    },[isAuthenticated, accessToken]);
    return(
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};