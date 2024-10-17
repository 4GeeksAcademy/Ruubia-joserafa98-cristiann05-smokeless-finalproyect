import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/DasboardSmoker/Sidebar';
import Header from '../component/DasboardSmoker/Header';

const ChatSmoker = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); 
    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState('');
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            console.error('Faltan datos necesarios.');
            navigate('/login-smoker');
            return;
        }

        const fetchData = async () => {
            try {
                await actions.getAllCoaches();
                await actions.getAllSolicitudes();
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);

    const approvedSolicitudes = store.solicitudes.filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null && 
        solicitud.id_usuario === store.loggedInUser.id
    );

    const approvedCoachIds = approvedSolicitudes.map(solicitud => solicitud.id_coach);
    
    const approvedCoaches = store.coaches.filter(coach => approvedCoachIds.includes(coach.id));

    useEffect(() => {
        
        console.log(mensajes);

    }, [mensajes]);

    const fetchMensajes = async () => {
        if (!selectedCoachId) return;

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
    
    useEffect(() => {

        fetchMensajes();
        const intervalId = setInterval(fetchMensajes, 2000);

        return () => clearInterval(intervalId);
    }, [selectedCoachId]);

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
            is_coach: false,
            is_user: true
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
                fetchMensajes();
                //setMensajes((prevMensajes) => [...prevMensajes, { ...nuevoMensaje, id: Date.now() }]);
            } else {
                const errorResponse = await response.json();
                console.error('Error al enviar el mensaje:', errorResponse);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="flex-1 md:ml-64">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <main className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Chat con tu Coach</h2>
                    <div className="flex">
                        <div className="w-1/4 pr-4">
                            <h3 className="text-lg font-semibold mb-2">Coaches Aprobados</h3>
                            {approvedCoaches.length > 0 ? (
                                <ul className="space-y-2">
                                    {approvedCoaches.map((coach) => (
                                        <li
                                            key={coach.id}
                                            onClick={() => setSelectedCoachId(coach.id)}
                                            className={`p-3 rounded cursor-pointer ${coach.id === selectedCoachId ? 'bg-light text-dark' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >
                                            {coach.nombre_coach}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tienes coaches aprobados.</p>
                            )}
                        </div>

                        <div className="w-3/4">
                            {selectedCoachId ? (
                                <div className="bg-gray-900 shadow-md rounded-lg">
                                    <div className="border-b p-4">
                                        <h4 className="font-semibold">Chat con {approvedCoaches.find(coach => coach.id === selectedCoachId)?.nombre_coach}</h4>
                                    </div>
                                    <div className="p-4 max-h-96 overflow-y-scroll">
                                        {mensajes.length > 0 ? (
                                            mensajes.map((mensaje) => (
                                                <div
                                                    key={mensaje.id}
                                                    className={`my-2 p-2 ${mensaje.is_user ? 'bg-danger' : 'bg-light'} rounded ${mensaje.id_usuario === store.loggedInUser.id ? 'text-dark self-end' : 'bg-gray-200 text-gray-900 self-start'}`}
                                                >
                                                    {mensaje.contenido}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay mensajes para mostrar.</p>
                                        )}
                                    </div>
                                    <div className="border-t p-4">
                                        <form onSubmit={handleSendMensaje} className="flex">
                                            <input
                                                type="text"
                                                value={contenido}
                                                onChange={(e) => setContenido(e.target.value)}
                                                placeholder="Escribe tu mensaje..."
                                                required
                                                className="flex-grow p-2 border rounded mr-2"
                                            />
                                            <button type="submit" className="bg-light text-dark p-2 rounded">Enviar</button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <p>Selecciona un coach para iniciar una conversación.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );    
};

export default ChatSmoker;
