import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que este sea el path correcto
import { useNavigate } from 'react-router-dom';
import '../../styles/chatsmoker.css';

const ChatCoach = () => {
    const { store, actions } = useContext(Context); // Usar el contexto
    const navigate = useNavigate(); 
    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState('');
    const [selectedSmokerId, setSelectedSmokerId] = useState(null); // Estado para el smoker seleccionado

    useEffect(() => {
        const token = localStorage.getItem('jwtTokenCoach'); 
        const coachId = localStorage.getItem('coachId');

        if (!token || !coachId) {
            console.error('Faltan datos necesarios.');
            navigate('/login'); // Redirigir al login si faltan datos
            return;
        }

        // Fetch para obtener todos los smokers y solicitudes
        const fetchData = async () => {
            try {
                await actions.getAllSmokers(); // Asegúrate de que este nombre coincida
                await actions.getAllSolicitudes(); // Obtener todas las solicitudes
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, [actions, navigate]);

    // Filtrar solicitudes aprobadas
    const approvedSolicitudes = (store.solicitudes || []).filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null && 
        solicitud.id_coach === store.loggedInUser.id // Asegúrate de que `id_coach` está en la estructura correcta
    );

    // Log para depuración
    console.log("Solicitudes aprobadas:", approvedSolicitudes);

    // Extraer IDs de smokers aprobados
    const approvedSmokerIds = approvedSolicitudes.map(solicitud => solicitud.id_usuario);
    
    // Filtrar smokers aprobados
    const approvedSmokers = (store.smoker || []).filter(smoker => approvedSmokerIds.includes(smoker.id));

    // Log para depuración
    console.log("Smokers aprobados:", approvedSmokers);

    useEffect(() => {
        const fetchMensajes = async () => {
            if (!selectedSmokerId) return; // Evita la carga si no hay smoker seleccionado
            
            const token = localStorage.getItem('jwtTokenCoach'); 
            const coachId = localStorage.getItem('coachId');

            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/${selectedSmokerId}/${coachId}`, {
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
    }, [selectedSmokerId]); // Dependiendo del smoker seleccionado

    const handleSendMensaje = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtTokenCoach'); 
        const coachId = localStorage.getItem('coachId');

        if (!token || !coachId || !selectedSmokerId) {
            console.error('Faltan datos necesarios para enviar el mensaje.');
            return;
        }

        if (!contenido.trim()) {
            console.error('El contenido del mensaje no puede estar vacío.');
            return;
        }

        const nuevoMensaje = {
            id_usuario: selectedSmokerId,
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
            <main>
                <h2>Chat con tu Smoker</h2>
                
                {/* Lista de Smokers Aprobados */}
                <div className="smokers-list">
                    <h3>Smokers Aprobados</h3>
                    {approvedSmokers.length > 0 ? (
                        <ul>
                            {approvedSmokers.map((smoker) => (
                                <li key={smoker.id} onClick={() => setSelectedSmokerId(smoker.id)} className="smoker-item">
                                    {smoker.nombre} {/* Cambia a la propiedad correcta para mostrar el nombre */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tienes smokers aprobados.</p>
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

export default ChatCoach;
