const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const users = new Set();
const userSocketMap = new Map(); // Mapea socket.id a username


// Configuración de CORS para Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8100", // Origen de tu aplicación frontend
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('ID Socket:', socket.id);

    socket.on('newUser', (username) => {
        console.log('Nuevo usuario:', username);
        users.add(username);
        userSocketMap.set(socket.id, username); // Asociar socket.id con el nombre de usuario
        io.emit('userList', Array.from(users)); // Emitir la lista actualizada de usuarios
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
         // Obtener el username asociado al socket.id
         const username = userSocketMap.get(socket.id);
         if (username) {
             users.delete(username); // Eliminar el usuario de la lista de usuarios
             userSocketMap.delete(socket.id); // Eliminar del mapa la asociación socket.id - usuario
 
             io.emit('userList', Array.from(users)); // Emitir la lista de usuarios actualizada
         }
    });
});
// Configuración de rutas en Express
app.get('/', (req, res) => {
    res.send('Servidor en Node.js funcionando');
});
// Inicia el servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
