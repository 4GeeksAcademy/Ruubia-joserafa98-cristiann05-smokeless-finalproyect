import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/DasboardSmoker/Sidebar"; // Asegúrate de que la ruta sea correcta
import Header from "../component/DasboardSmoker/Header"; // Asegúrate de que la ruta sea correcta

const SolicitudesSmoker = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayCount, setDisplayCount] = useState(8); // Cantidad inicial de solicitudes a mostrar
    const [isDarkMode, setIsDarkMode] = useState(true); // Modo oscuro como predeterminado

    useEffect(() => {
        const fetchSolicitudes = async () => {
            if (store.loggedInUser && store.loggedInUser.id) {
                try {
                    await actions.getAllSolicitudes(); // Trae todas las solicitudes
                } catch (error) {
                    setError("Error al cargar las solicitudes");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSolicitudes();
    }, []);

    // Filtrar solicitudes en función del usuario logueado (smoker)
    const solicitudesEnEspera = store.solicitudes.filter(solicitud =>
        solicitud.id_usuario === store.loggedInUser.id && solicitud.estado === false && solicitud.fecha_respuesta === null
    );

    const solicitudesAprobadas = store.solicitudes.filter(solicitud =>
        solicitud.id_usuario === store.loggedInUser.id && solicitud.estado === true
    );

    const solicitudesRechazadas = store.solicitudes.filter(solicitud =>
        solicitud.id_usuario === store.loggedInUser.id && solicitud.estado === false && solicitud.fecha_respuesta !== null
    );

    // Controla la carga de más solicitudes
    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + 4);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Alterna entre modo oscuro y claro
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Sidebar con el modo oscuro */}

            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Header */}

                <div className="user-main-content p-6"> {/* Contenido principal */}
                    <h2 className="text-center text-gray-200 mb-4">Mis Solicitudes</h2>
                    {loading ? (
                        <p className="text-center text-gray-400">Cargando solicitudes...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <>
                            {/* Solicitudes en Espera */}
                            <h3 className="text-gray-200 mb-3">Solicitudes en Espera</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {solicitudesEnEspera.slice(0, displayCount).map((solicitud) => (
                                    <div key={solicitud.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                        <h4 className="font-bold text-lg">{solicitud.nombre_coach}</h4>
                                        <p className="text-gray-300">{solicitud.comentarios}</p>
                                        <p className="text-sm text-gray-400">Fecha de Solicitud: {solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleString('es-ES') : 'No disponible'}</p>
                                        <p className="text-red-500">Estado: En espera de respuesta</p>
                                    </div>
                                ))}
                            </div>
                            {solicitudesEnEspera.length > displayCount && (
                                <div className="text-center mb-6">
                                    <button onClick={loadMore} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                        Leer Más
                                    </button>
                                </div>
                            )}

                            {/* Solicitudes Aprobadas */}
                            <h3 className="text-gray-200 mb-3">Solicitudes Aprobadas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {solicitudesAprobadas.map((solicitud) => (
                                    <div key={solicitud.id} className="bg-green-800 p-4 rounded-lg shadow-md">
                                        <h4 className="font-bold text-lg">{solicitud.nombre_coach}</h4>
                                        <p className="text-gray-300">{solicitud.comentarios}</p>
                                        <p className="text-sm text-gray-400">Fecha de Solicitud: {new Date(solicitud.fecha_solicitud).toLocaleString('es-ES')}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Solicitudes Rechazadas */}
                            <h3 className="text-gray-200 mb-3">Solicitudes Rechazadas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {solicitudesRechazadas.map((solicitud) => (
                                    <div key={solicitud.id} className="bg-red-800 p-4 rounded-lg shadow-md">
                                        <h4 className="font-bold text-lg">{solicitud.nombre_coach}</h4>
                                        <p className="text-gray-300">{solicitud.comentarios}</p>
                                        <p className="text-sm text-gray-400">Fecha de Solicitud: {new Date(solicitud.fecha_solicitud).toLocaleString('es-ES')}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SolicitudesSmoker;
