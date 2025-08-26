//This file initializes and exports the Socket.IO client

import {io} from 'socket.io-client';

const URL = 'http://localhost:3000';


//we initialize the socket connection but don't connect immediately.
//The connection will be established manually when the user is authenticated.

export const socket = io(URL,{
    autoConnect: false,
});