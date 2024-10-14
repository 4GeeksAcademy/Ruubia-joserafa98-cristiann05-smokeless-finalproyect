import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/DashboardCoach/SiderbarCoach"; 
import Header from "../component/DashboardCoach/HeaderCoach"; 
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const ListaClientesAprobados = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [activeNavItem, setActiveNavItem] = useState('Lista de Clientes');
    const [selectedCliente, setSelectedCliente] = useState(null); // Estado para el cliente seleccionado
    const navigate = useNavigate(); // Inicializar useNavigate

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const userId = store.loggedInUser?.id || localStorage.getItem("userId");

            if (userId) {
                try {
                    await actions.getAllSolicitudes();
                } catch (error) {
                    setError("Error al cargar las solicitudes");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, [store.loggedInUser, actions]);

    const userId = store.loggedInUser?.id || localStorage.getItem("userId");
    const stringUserId = String(userId);

    const solicitudesAprobadas = store.solicitudes.filter(solicitud => {
        const isValidUser = String(solicitud.id_usuario) === stringUserId; 
        const isApproved = solicitud.estado === true; 
        return isValidUser && isApproved; 
    });

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? "Fecha inválida" : parsedDate.toLocaleString('es-ES');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleNavigation = (item) => {
        setActiveNavItem(item.name);
        navigate(item.path); // Navegar a la ruta seleccionada
    };

    const handleVerDetalles = (cliente) => {
        setSelectedCliente(cliente); // Guardamos el cliente seleccionado
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar 
                active={activeNavItem} 
                isDarkMode={isDarkMode} 
                handleNavigation={handleNavigation} 
            />

            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <div className="user-main-content p-6">
                    <h2 className="text-center text-gray-200 mb-4">Lista de Clientes Aprobados</h2>
                    {loading ? (
                        <div className="text-center">Cargando...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">Error al cargar los clientes: {error}</div>
                    ) : (
                        <>
                            {solicitudesAprobadas.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {solicitudesAprobadas.map(solicitud => (
                                        <div key={solicitud.id} className={`border rounded-lg p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-200 hover:shadow-lg`}>
                                            <div className="flex items-center mb-4">
                                                <img 
                                                    className="w-16 h-16 rounded-full border-2 border-blue-500" 
                                                    src={solicitud.imagen_coach || "https://via.placeholder.com/100"} 
                                                    alt={solicitud.nombre_coach} 
                                                />
                                                <div className="ml-4">
                                                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{solicitud.nombre_coach}</h3>
                                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{solicitud.comentarios.slice(0, 20)}...</p> 
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <button 
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                                                    onClick={() => handleVerDetalles(solicitud)} // Pasar el cliente seleccionado
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center">No hay solicitudes aprobadas.</p>
                            )}
                        </>
                    )}

                    {/* Renderizar detalles del cliente seleccionado */}
                    {selectedCliente && (
                        <div className="mt-6 p-4 border rounded shadow-md bg-black text-white">
                            <h2 className="text-2xl font-bold mb-4">{selectedCliente.nombre_coach}</h2>
                            <img 
                                className="w-32 h-32 rounded-full border-2 border-blue-500 mb-4" 
                                src={selectedCliente.imagen_coach || "https://via.placeholder.com/100"} 
                                alt={selectedCliente.nombre_coach} 
                            />
                            <p className="text-lg mb-2"><strong>Comentarios:</strong> {selectedCliente.comentarios}</p>
                            <p className="text-lg mb-2"><strong>Fecha de Solicitud:</strong> {formatDate(selectedCliente.fecha_solicitud)}</p>
                            <p className="text-lg mb-2"><strong>Progreso:</strong> {selectedCliente.progreso}%</p>
                            <button 
                                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-200"
                                onClick={() => setSelectedCliente(null)} // Limpiar la selección
                            >
                                Cerrar Detalles
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListaClientesAprobados;
