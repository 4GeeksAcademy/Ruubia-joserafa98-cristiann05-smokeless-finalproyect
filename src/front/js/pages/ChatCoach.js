import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../component/DashboardCoach/SiderbarCoach";
import Header from "../component/DashboardCoach/HeaderCoach";

const ChatCoach = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState('');
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeNavItem, setActiveNavItem] = useState('Chat');
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            console.error('Faltan datos necesarios.');
            navigate('/login-coach');
            return;
        }

        const fetchSolicitudes = async () => {
            if (store.loggedInCoach && store.loggedInCoach.id) {
                try {
                    await actions.getAllSolicitudes();
                } catch (error) {
                    setError("Error al cargar las solicitudes");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSolicitudes();

        const intervalId = setInterval(() => {
            fetchSolicitudes();
        }, 2000);

        return () => clearInterval(intervalId);
    }, [store.loggedInCoach]);

    const solicitudesAprobadas = store.solicitudes.filter(solicitud =>
        solicitud.id_coach === store.loggedInCoach?.id && solicitud.estado === true
    );

    useEffect(() => {
        
        console.log(mensajes);

    }, [mensajes]);

    useEffect(() => {
        const fetchMensajes = async () => {
            if (!selectedSolicitud) return;

            const token = localStorage.getItem('jwtToken');
            const userId = localStorage.getItem('userId');

            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/${selectedSolicitud.id_usuario}/${userId}`, {
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
        const intervalId = setInterval(fetchMensajes, 2000);

        return () => clearInterval(intervalId);
    }, [selectedSolicitud]);

    const handleSendMensaje = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId || !selectedSolicitud) {
            console.error('Faltan datos necesarios para enviar el mensaje.');
            return;
        }

        if (!contenido.trim()) {
            console.error('El contenido del mensaje no puede estar vacío.');
            return;
        }

        const nuevoMensaje = {
            id_usuario: selectedSolicitud.id_usuario,
            id_coach: userId,
            contenido,
            is_coach: true,
            is_user: false
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
                setMensajes((prevMensajes) => [...prevMensajes, { ...nuevoMensaje, id: Date.now() }]);
            } else {
                const errorResponse = await response.json();
                console.error('Error al enviar el mensaje:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    const handleNavigation = (item) => {
        setActiveNavItem(item.name);
        navigate(item.path); // Navegación a la ruta correspondiente
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar
                active={activeNavItem}
                isDarkMode={isDarkMode}
                handleNavigation={handleNavigation}
            />
            <div className="flex-1 md:ml-64">
                <Header onLogout={() => actions.logout()} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
                <div className="chat-container d-flex p-6">
                    <div className="inbox-list" style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
                        <h3>Solicitudes Aprobadas</h3>
                        {loading ? (
                            <p>Cargando solicitudes aprobadas...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <ul className="list-group">
                                {solicitudesAprobadas.length > 0 ? (
                                    solicitudesAprobadas.map((solicitud) => (
                                        <li
                                            key={solicitud.id}
                                            onClick={() => setSelectedSolicitud(solicitud)}
                                            className={`list-group-item ${solicitud.id === selectedSolicitud?.id ? 'active' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <strong>{solicitud.nombre_usuario}</strong>
                                        </li>
                                    ))
                                ) : (
                                    <p>No hay solicitudes aprobadas.</p>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="chat-window" style={{ width: '70%', padding: '1rem', overflowY: 'auto' }}>
                        {selectedSolicitud ? (
                            <>
                                <h4>Chat con {selectedSolicitud.nombre_usuario}</h4>
                                <div className="messages" style={{ maxHeight: '400px', overflowY: 'scroll', marginBottom: '1rem' }}>
                                    {mensajes.length > 0 ? (
                                        mensajes.map((mensaje) => (
                                            <div
                                                key={mensaje.id}
                                                className={`${mensaje.is_coach ? 'bg-danger' : 'bg-light'} message ${mensaje.id_usuario === selectedSolicitud.id_usuario ? 'sent' : 'received'}`}
                                                style={{ marginBottom: '0.5rem' }}
                                            >
                                                <p style={{
                                                    padding: '0.5rem',
                                                    backgroundColor: mensaje.id_usuario === selectedSolicitud.id_usuario ? '#d1ecf1' : '#f8f9fa',
                                                    color: '#000',
                                                    borderRadius: '8px'
                                                }}>
                                                    {mensaje.contenido}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay mensajes para mostrar.</p>
                                    )}
                                </div>

                                <form onSubmit={handleSendMensaje} style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        value={contenido}
                                        onChange={(e) => setContenido(e.target.value)}
                                        placeholder="Escribe tu mensaje..."
                                        required
                                        className={`flex-1 p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                                    />
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </form>

                            </>
                        ) : (
                            <p>Selecciona un usuario para iniciar una conversación.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatCoach;
