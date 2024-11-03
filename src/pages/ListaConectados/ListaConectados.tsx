import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// URL del servidor de Node.js con Socket.IO
const SOCKET_SERVER_URL = "http://localhost:3000";

const ListaConectados: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Conectar al servidor de Node.js con Socket.IO
    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "example",
      },
    });

    // Escuchar evento 'userList' para recibir la lista de usuarios
    socket.on("userList", (userList) => {
      setUsers(userList);
    });

    // Desconectar cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Usuarios Conectados</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListaConectados;
