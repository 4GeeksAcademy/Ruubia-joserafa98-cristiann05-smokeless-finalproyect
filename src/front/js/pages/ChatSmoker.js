import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Importa el contexto
import { useNavigate } from 'react-router-dom';
import '../../styles/chatsmoker.css';
import Sidebar from "../component/DasboardSmoker/Sidebar"; 
import Header from "../component/DasboardSmoker/Header"; 

const ChatSmoker = () => {
    const { store, actions } = useContext(Context); // Usar el contexto
    const navigate = useNavigate(); 
    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState('');
    const [selectedCoachId, setSelectedCoachId] = useState(null); // Estado para el coach seleccionado

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            console.error('Faltan datos necesarios.');
            navigate('/login'); // Redirigir al login si faltan datos
            return;
        }

        // Fetch para obtener todos los coaches y solicitudes
        const fetchData = async () => {
            try {
                await actions.getAllCoaches(); // Obtener todos los coaches
                await actions.getAllSolicitudes(); // Obtener todas las solicitudes
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, [actions, navigate]);

    // Filtrar las solicitudes aprobadas del usuario
    const approvedSolicitudes = store.solicitudes.filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null && 
        solicitud.id_usuario === store.loggedInUser.id
    );

    // Extraer los IDs de los coaches aprobados
    const approvedCoachIds = approvedSolicitudes.map(solicitud => solicitud.id_coach);
    
    // Filtrar los coaches aprobados
    const approvedCoaches = store.coaches.filter(coach => approvedCoachIds.includes(coach.id));

    useEffect(() => {
        const fetchMensajes = async () => {
            if (!selectedCoachId) return; // Evita la carga si no hay coach seleccionado
            
            const token = localStorage.getItem('jwtToken');
            const userId = localStorage.getItem('userId');

            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/${userId}/${selectedCoachId}`, {
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
        const intervalId = setInterval(fetchMensajes, 5000); // Actualiza cada 5 segundos

        return () => clearInterval(intervalId);
    }, [selectedCoachId]); // Dependiendo del coach seleccionado

    const handleSendMensaje = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId || !selectedCoachId) {
            console.error('Faltan datos necesarios para enviar el mensaje.');
            return;
        }

        if (!contenido.trim()) {
            console.error('El contenido del mensaje no puede estar vacío.');
            return;
        }

        const nuevoMensaje = {
            id_usuario: userId,
            id_coach: selectedCoachId,
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
                setContenido(''); // Limpiar el campo de contenido
                setMensajes((prevMensajes) => [...prevMensajes, { ...nuevoMensaje, id: Date.now() }]); // Agregar el nuevo mensaje
            } else {
                const errorResponse = await response.json();
                console.error('Error al enviar el mensaje:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    return (
        <div className="chat-container">
            <Sidebar navigate={navigate} />
            <Header />
            <main>
                <h2>Chat con tu Coach</h2>
                
                {/* Lista de Coaches Aprobados */}
                <div className="coaches-list">
                    <h3>Coaches Aprobados</h3>
                    {approvedCoaches.length > 0 ? (
                        <ul>
                            {approvedCoaches.map((coach) => (
                                <li key={coach.id} onClick={() => setSelectedCoachId(coach.id)} className="coach-item">
                                    {coach.nombre_coach} {/* Cambia a la propiedad correcta para mostrar el nombre */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tienes coaches aprobados.</p>
                    )}
                </div>

                <div className="messages">
                    {mensajes.length > 0 ? (
                        mensajes.map((mensaje) => (
                            <div key={mensaje.id} className={`message ${mensaje.id_usuario === store.loggedInUser.id ? 'sent' : 'received'}`}>
                                <p>{mensaje.contenido}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay mensajes para mostrar.</p>
                    )}
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
            </main>
        </div>
    );
};

export default ChatSmoker;
