import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/DasboardSmoker/Sidebar"; // Importa el componente Sidebar
import Header from "../component/DasboardSmoker/Header"; // Importa el componente Header

const CoachesList = () => {
    const { store, actions } = useContext(Context);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchCity, setSearchCity] = useState(""); // Estado para la ciudad
    const [isDarkMode, setIsDarkMode] = useState(true); // Modo oscuro
    const [displayCount, setDisplayCount] = useState(8); // Número inicial de coaches a mostrar
    const coachesPerLoad = 4; // Coaches a cargar al hacer clic en "Ver Más"
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await actions.getAllCoaches(); // Obtiene todos los coaches
            await actions.getAllSolicitudes(); // Obtiene todas las solicitudes
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const formatFecha = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const fechaSolicitud = formatFecha(new Date());

    const handleAddCoach = async (coachId) => {
        const userId = localStorage.getItem('userId'); // Obtener el ID desde localStorage
        if (!userId) {
            setAlertMessage("Error: Usuario no autenticado.");
            return;
        }
    
        await actions.getAllSolicitudes(); // Asegúrate de tener todas las solicitudes
    
        // Agregar logs para verificar userId y las solicitudes en el store
        console.log("User ID:", userId);
        console.log("Solicitudes en el store:", store.solicitudes); // Verifica aquí
    
        // Verifica si ya existe una solicitud para este coach
        const existingRequest = store.solicitudes.find(solicitud => {
            return (
                solicitud.id_coach === coachId &&
                solicitud.id_usuario === userId &&
                !solicitud.estado && // Verifica si la solicitud está activa (estado = false)
                solicitud.fecha_respuesta === null // Y que no haya respuesta aún
            );
        });
    
        console.log("Verificando solicitud existente:", {
            coachId,
            userId,
            hasRequest: !!existingRequest,
            existingRequest // Log para mostrar detalles de la solicitud encontrada, si existe
        });
    
        if (existingRequest) {
            setAlertMessage("Ya has solicitado este coach. No puedes volver a solicitarlo.");
            return; // Sale de la función si la solicitud ya existe
        }
    
        const fechaSolicitud = new Date().toLocaleDateString('es-ES'); // Ajusta esto si es necesario
        const solicitudData = {
            id_usuario: userId,
            id_coach: coachId,
            fecha_solicitud: fechaSolicitud,
            estado: false,
            fecha_respuesta: null,
            comentarios: 'Estoy interesado en el coaching',
        };
    
        console.log("Datos a enviar:", solicitudData); // Log para verificar los datos que se están enviando
    
        try {
            await actions.addSolicitud(solicitudData);
            setAlertMessage("Solicitud enviada exitosamente!");
            await actions.getAllSolicitudes(); // Refresca la lista de solicitudes
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            setAlertMessage("Hubo un fallo al enviar la solicitud.");
        }
    };

    const handleViewProfile = (coachId) => {
        navigate(`/coach-details/${coachId}`);
    };

    const filteredCoaches = store.coaches
        .filter(coach => {
            return coach.nombre_coach && coach.genero_coach && coach.direccion && coach.nacimiento_coach;
        })
        .filter(coach => {
            const hasRequest = store.solicitudes.some(solicitud => {
                return (
                    solicitud.id_coach === coach.id &&
                    solicitud.id_usuario === localStorage.getItem('userId') &&
                    (solicitud.fecha_respuesta === null || solicitud.estado === false) // Verifica que la solicitud no haya sido respondida o esté activa
                );
            });
            return !hasRequest; // Retorna los coaches que no tienen solicitudes pendientes
        })
        .filter(coach => {
            return coach.direccion.toLowerCase().includes(searchCity.toLowerCase()); // Filtra por ciudad
        });

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Alterna entre modo oscuro y claro
    };

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + coachesPerLoad); // Aumenta la cantidad de coaches mostrados
    };

    // Calcular la lista de coaches a mostrar
    const currentCoaches = filteredCoaches.slice(0, displayCount);

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar active="Lista de Coaches" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} /> {/* Sidebar con navegación */}

            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Header */}

                <div className="user-main-content p-6"> {/* Contenido principal */}
                    {alertMessage && (
                        <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                            {alertMessage}
                        </div>
                    )}
                    <h1 className="text-center text-3xl font-bold mb-4">Coaches Disponibles</h1>

                    {/* Input para filtrar por ciudad */}
                    <div className="flex justify-center mb-4">
                        <input
                            type="text"
                            id="searchCity"
                            className="form-control w-1/2 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Buscar por Ciudad"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)} // Actualiza el estado con la ciudad ingresada
                        />
                    </div>

                    {isLoading ? (
                        <p className="text-center text-light">Cargando datos...</p>
                    ) : currentCoaches.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentCoaches.map((coach) => (
                                <div className="card text-white bg-black rounded-lg overflow-hidden shadow-lg" key={coach.id}>
                                    <img
                                        src={coach.foto_coach || "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"}
                                        className="w-full h-48 object-cover"
                                        alt={coach.nombre_coach || "Imagen no disponible"}
                                    />
                                    <div className="p-4">
                                        <h5 className="text-xl font-semibold">{coach.nombre_coach}</h5>
                                        <p className="mt-2">
                                            <strong>Género:</strong> {coach.genero_coach}
                                        </p>
                                        <p className="mt-1">
                                            <strong>Dirección:</strong> {coach.direccion}
                                        </p>
                                        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-blue-700 transition duration-200" onClick={() => handleAddCoach(coach.id)}>
                                            Agregar Coach
                                        </button>
                                        <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded mt-2 hover:bg-green-700 transition duration-200" onClick={() => handleViewProfile(coach.id)}>
                                            Ver Perfil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light">No hay coaches disponibles en esta ciudad.</p>
                    )}

                    {currentCoaches.length > displayCount && (
                        <div className="text-center mt-4">
                            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200" onClick={loadMore}>
                                Ver Más
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Agregando estilos CSS directamente en el componente */}
            <style jsx>{`
                .card {
                    background-color: black !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
};

export default CoachesList;
