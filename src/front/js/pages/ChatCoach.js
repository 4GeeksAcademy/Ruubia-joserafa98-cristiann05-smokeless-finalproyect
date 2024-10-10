import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';

const ChatCoach = () => {
    const { store } = useStore();
    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtTokenCoach'); 
        const userId = localStorage.getItem('userId');
        const coachId = localStorage.getItem('coachId');

        if (!token || !userId || !coachId) {
            console.error('Faltan datos necesarios.');
            return;
        }

        console.log(`Token Coach: ${token}, User ID: ${userId}, Coach ID: ${coachId}`);

        // Función para obtener los mensajes del servidor
        const fetchMensajes = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/${userId}/${coachId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const mensajesData = await response.json();
                    console.log('Mensajes recibidos por el coach:', mensajesData);
                    setMensajes(mensajesData);
                } else {
                    console.error('Error al obtener mensajes del coach', response.status);
                }
            } catch (error) {
                console.error('Error en la conexión:', error);
            }
        };

        // Llamar a la función para obtener mensajes inicialmente
        fetchMensajes();

        // Configurar la actualización periódica
        const intervalId = setInterval(fetchMensajes, 5000); // Actualizar cada 5 segundos

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
    }, []);

    const handleSendMensaje = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtTokenCoach'); 
        const userId = localStorage.getItem('userId');
        const coachId = localStorage.getItem('coachId');

        if (!token || !userId || !coachId) {
            console.error('Faltan datos necesarios para enviar el mensaje.');
            return;
        }

        const nuevoMensaje = {
            id_usuario: userId,
            id_coach: coachId,
            contenido,
        };

        console.log('Nuevo Mensaje del Coach:', nuevoMensaje);

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoMensaje)
            });

            if (response.ok) {
                setContenido('');
            } else {
                const errorResponse = await response.json();
                console.error('Error al enviar el mensaje del coach:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    // Función para eliminar un mensaje
    const handleDeleteMensaje = async (mensajeId) => {
        const token = localStorage.getItem('jwtTokenCoach'); 

        if (!token) {
            console.error('Token no encontrado para eliminar el mensaje.');
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/${mensajeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Actualizar la lista de mensajes después de eliminar
                setMensajes((prevMensajes) => prevMensajes.filter((msg) => msg.id !== mensajeId));
            } else {
                const errorResponse = await response.json();
                console.error('Error al eliminar el mensaje del coach:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión al eliminar el mensaje del coach:', error);
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat con tu Smoker</h2>
            <div className="messages">
                {mensajes.map((mensaje) => (
                    <div key={mensaje.id} className={`message ${mensaje.id_usuario === store.loggedInUser.id ? 'sent' : 'received'}`}>
                        <p>{mensaje.contenido}</p>
                        <button onClick={() => handleDeleteMensaje(mensaje.id)} className="delete-button">Eliminar</button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMensaje}>
                <input
                    type="text"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    required
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default ChatCoach;
