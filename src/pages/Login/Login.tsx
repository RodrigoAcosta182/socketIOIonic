import React, { useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`https://localhost:44330/login/${username}`);
      if (response.data !== "") {
        const newSocket = io("http://localhost:3000");
        newSocket.emit("newUser", username);
        setSocket(newSocket); // Guarda el socket para usarlo luego en logout
        setLogueado(true);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect(); // Desconectar el socket del servidor
      setSocket(null); // Limpiar el socket
    }
    setLogueado(false);
    setUsername("");
  };

  useEffect(() => {
    // Limpiar el socket si el usuario cierra la pestaña o recarga
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div>
      <h1>Login</h1>
      {logueado ? (
        <>
          <h1>Bienvenido {username}</h1>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Ingrese su nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Iniciar Sesión</button>
        </>
      )}
    </div>
  );
};

export default Login;
