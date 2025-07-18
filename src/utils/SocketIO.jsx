import { io } from 'socket.io-client';
import { URL } from './api';

const SOCKET_SERVER_URL = URL;

const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,
});

export default socket;