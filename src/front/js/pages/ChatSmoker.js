import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate aquí
import '../../styles/chatsmoker.css';
import Sidebar from "../component/DasboardSmoker/Sidebar"; // Asegúrate de que la ruta sea correcta
import Header from "../component/DasboardSmoker/Header"; // Asegúrate de que la ruta sea correcta

const ChatSmoker = () => {
    const { store } = useStore();
    const navigate = useNavigate(); // Obtén navigate aquí
    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');
        const coachId = localStorage.getItem('coachId');

        if (!token || !userId || !coachId) {
            console.error('Faltan datos necesarios.');
            return;
        }

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
                    setMensajes(mensajesData);
                } else {
                    console.error('Error al obtener mensajes', response.status);
                }
            } catch (error) {
                console.error('Error en la conexión:', error);
            }
        };

        fetchMensajes();
        const intervalId = setInterval(fetchMensajes, 1000);

        return () => clearInterval(intervalId);
    }, [store]);

    const handleSendMensaje = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
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
                console.error('Error al enviar el mensaje:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    const handleVaciarMensajes = async () => {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');
        const coachId = localStorage.getItem('coachId');

        if (!token || !userId || !coachId) {
            console.error('Faltan datos necesarios para vaciar los mensajes.');
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/vaciar/${userId}/${coachId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setMensajes((prevMensajes) => prevMensajes.filter((msg) => msg.id_usuario !== userId));
                console.log('Todos los mensajes del usuario han sido eliminados correctamente.');
            } else {
                const errorResponse = await response.json();
                console.error('Error al vaciar los mensajes:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión al vaciar los mensajes:', error);
        }
    };

    return (
        <div className="chat-container">
            <Sidebar navigate={navigate} /> {/* Pasa navigate al componente Sidebar */}
            <Header />
            <main>
                <h2>Chat con tu Coach</h2>
                <div className="messages">
                    {mensajes.map((mensaje) => (
                        <div key={mensaje.id} className={`message ${mensaje.id_usuario === store.loggedInUser.id ? 'sent' : 'received'}`}>
                            <p>{mensaje.contenido}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMensaje} className="message-input">
                    <input
                        type="text"
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        required
                    />
                    <button type="submit">Enviar</button>
                </form>
                <button onClick={handleVaciarMensajes} className="vaciar-button">Vaciar Chat</button>
            </main>
        </div>
    );
};

export default ChatSmoker;
