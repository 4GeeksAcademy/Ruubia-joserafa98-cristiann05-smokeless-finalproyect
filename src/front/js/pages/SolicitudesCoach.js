import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/DashboardCoach/SiderbarCoach";
import Header from "../component/DashboardCoach/HeaderCoach";
import { useNavigate } from "react-router-dom";

const SolicitudesCoach = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeNavItem, setActiveNavItem] = useState('Solicitudes');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [solicitudesAprobadas, setSolicitudesAprobadas] = useState([]);
    const [solicitudesRechazadas, setSolicitudesRechazadas] = useState([]);
    const navigate = useNavigate(); // Inicializar useNavigate

    const fetchSolicitudes = useCallback(async () => {
        if (store.loggedInCoach && store.loggedInCoach.id) {
            try {
                await actions.getAllSolicitudes();
                const solicitudesActualizadas = [...store.solicitudes]; // Clonamos las solicitudes
                const solicitudesRecibidas = solicitudesActualizadas.filter(
                    (solicitud) =>
                        solicitud.id_coach === store.loggedInCoach.id &&
                        solicitud.fecha_respuesta === null
                );
                const solicitudesAprobadas = solicitudesActualizadas.filter(
                    (solicitud) =>
                        solicitud.id_coach === store.loggedInCoach.id &&
                        solicitud.estado === true
                );
                const solicitudesRechazadas = solicitudesActualizadas.filter(
                    (solicitud) =>
                        solicitud.id_coach === store.loggedInCoach.id &&
                        solicitud.estado === false &&
                        solicitud.fecha_respuesta !== null
                );
    
                setSolicitudesPendientes(solicitudesRecibidas);
                setSolicitudesAprobadas(solicitudesAprobadas);
                setSolicitudesRechazadas(solicitudesRechazadas);
            } catch (error) {
                setError("Error al cargar las solicitudes");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    }, [store.loggedInCoach, store.solicitudes, actions]);
    

    useEffect(() => {
        fetchSolicitudes();
    
        const intervalId = setInterval(() => {
            if (!error) {
                fetchSolicitudes();
            }
        }, 2000);
    
        return () => {
            clearInterval(intervalId); // Asegúrate de limpiar el intervalo
        };
    }, [fetchSolicitudes, error]);
    

    const handleUpdate = async (solicitudId, updatedData) => {
        try {
            await actions.updateSolicitud(solicitudId, updatedData);
            fetchSolicitudes();
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
        }
    };

    const handleNavigation = (item) => {
        setActiveNavItem(item.name);
        navigate(item.path); // Navegar a la ruta seleccionada
    };

    const handleApprove = (solicitudId) => {
        handleUpdate(solicitudId, {
            estado: true,
            fecha_respuesta: new Date().toLocaleDateString("en-GB"),
        });
    };

    const handleReject = (solicitudId) => {
        handleUpdate(solicitudId, {
            estado: false,
            fecha_respuesta: new Date().toLocaleDateString("en-GB"),
        });
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <Sidebar 
                active={activeNavItem} 
                isDarkMode={isDarkMode} 
                handleNavigation={handleNavigation} 
            />
            <div className="flex-1 md:ml-64">
                {/* Header */}
                <Header onLogout={() => actions.logout()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <div className="p-6">
                    <h2 className="text-center text-3xl font-semibold mb-8">
                        Solicitudes Recibidas
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <>
                            {/* Solicitudes Pendientes */}
                            <section className="mb-12">
                                <h3 className="text-2xl mb-4">Solicitudes Pendientes</h3>
                                {solicitudesPendientes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {solicitudesPendientes.map((solicitud) => (
                                            <div
                                                key={solicitud.id}
                                                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                                            >
                                                <h4 className="text-xl font-bold">
                                                    {solicitud.nombre_usuario}
                                                </h4>
                                                <p className="mt-2 text-gray-400">
                                                    {solicitud.comentarios}
                                                </p>
                                                <p className="mt-2 text-gray-500">
                                                    Fecha de Solicitud:{" "}
                                                    {new Date(solicitud.fecha_solicitud).toLocaleString()}
                                                </p>
                                                <div className="mt-4 flex justify-between">
                                                    <button
                                                        className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-700"
                                                        onClick={() => handleApprove(solicitud.id)}
                                                    >
                                                        Aprobar
                                                    </button>
                                                    <button
                                                        className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-700"
                                                        onClick={() => handleReject(solicitud.id)}
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay solicitudes recibidas.</p>
                                )}
                            </section>

                            {/* Solicitudes Aprobadas */}
                            <section className="mb-12">
                                <h3 className="text-2xl mb-4">Solicitudes Aprobadas</h3>
                                {solicitudesAprobadas.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {solicitudesAprobadas.map((solicitud) => (
                                            <div
                                                key={solicitud.id}
                                                className="bg-green-800 p-6 rounded-lg shadow-lg"
                                            >
                                                <h4 className="text-xl font-bold">
                                                    {solicitud.nombre_usuario}
                                                </h4>
                                                <p className="mt-2 text-gray-300">
                                                    {solicitud.comentarios}
                                                </p>
                                                <p className="mt-2 text-gray-500">
                                                    Fecha de Solicitud:{" "}
                                                    {new Date(solicitud.fecha_solicitud).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay solicitudes aprobadas.</p>
                                )}
                            </section>

                            {/* Solicitudes Rechazadas */}
                            <section className="mb-12">
                                <h3 className="text-2xl mb-4">Solicitudes Rechazadas</h3>
                                {solicitudesRechazadas.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {solicitudesRechazadas.map((solicitud) => (
                                            <div
                                                key={solicitud.id}
                                                className="bg-red-800 p-6 rounded-lg shadow-lg"
                                            >
                                                <h4 className="text-xl font-bold">
                                                    {solicitud.nombre_usuario}
                                                </h4>
                                                <p className="mt-2 text-gray-300">
                                                    {solicitud.comentarios}
                                                </p>
                                                <p className="mt-2 text-gray-500">
                                                    Fecha de Solicitud:{" "}
                                                    {new Date(solicitud.fecha_solicitud).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay solicitudes rechazadas.</p>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SolicitudesCoach;
