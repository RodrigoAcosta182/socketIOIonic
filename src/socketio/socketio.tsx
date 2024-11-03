import { io } from 'socket.io-client';

const socket = io("http://localhost:3000"); // URL del servidor

socket.on("connect", () => {
    console.log("Conectado a Socket.IO");
});

socket.on("message", (data) => {
    console.log("Mensaje recibido:", data);
});


export default socket;
