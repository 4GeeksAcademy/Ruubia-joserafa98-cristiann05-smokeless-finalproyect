import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../component/DasboardSmoker/Sidebar"; // Importa el componente Sidebar
import Header from "../component/DasboardSmoker/Header"; // Importa el componente Header

const ViewProfileCoach = () => {
    const { coachId } = useParams(); // Extrae el coachId de la URL
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(true); // Modo oscuro
    const navigate = useNavigate();

    // Fetch coach data on mount
    useEffect(() => {
        const fetchCoachData = async () => {
            if (!coachId) {
                setError("No se ha proporcionado coachId");
                setLoading(false);
                return;
            }
            try {
                await actions.getCoach(coachId); // Obtiene los datos del coach
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del coach:", error);
                setError("No se pudieron obtener los datos del coach.");
                setLoading(false);
            }
        };
        fetchCoachData();
    }, [coachId, actions]);

    const handleSendRequest = async () => {
        const userId = store.loggedInUser?.id;

        if (!userId) {
            setAlertMessage("Error: Usuario no autenticado.");
            return;
        }

        const solicitudData = {
            id_usuario: userId,
            id_coach: coachId,
            fecha_solicitud: new Date().toLocaleDateString('es-ES'),
            estado: false,
            fecha_respuesta: null,
            comentarios: 'Estoy interesado en el coaching',
        };

        try {
            await actions.addSolicitud(solicitudData);
            setAlertMessage("Solicitud enviada exitosamente!");
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            setAlertMessage("Hubo un fallo al enviar la solicitud.");
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Alterna entre modo oscuro y claro
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar active="Ver Perfil del Coach" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} /> {/* Sidebar con navegación */}

            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Header */}

                <div className="user-main-content p-6"> {/* Contenido principal */}
                    {alertMessage && (
                        <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                            {alertMessage}
                        </div>
                    )}
                    <h1 className="text-center text-3xl font-bold mb-4">Detalles del Coach</h1>

                    <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
                        Volver
                    </button>

                    {loading ? (
                        <p className="text-center">Cargando datos del coach...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        store.coach && (
                            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                                <img 
                                    src={store.coach.foto_coach || "https://via.placeholder.com/300"} 
                                    alt="Foto del Coach" 
                                    className="w-full h-64 object-cover" 
                                />
                                <div className="p-6">
                                    <h5 className="text-2xl font-semibold text-center mb-2">{store.coach.nombre_coach || 'Nombre no disponible'}</h5>
                                    <div className="text-gray-600 text-center mb-4">
                                        <p><strong>Email:</strong> {store.coach.email_coach || 'No disponible'}</p>
                                        <p><strong>Género:</strong> {store.coach.genero_coach || 'No especificado'}</p>
                                        <p><strong>Fecha de Nacimiento:</strong> {store.coach.nacimiento_coach || 'No disponible'}</p>
                                        <p><strong>Dirección:</strong> {store.coach.direccion || 'No disponible'}</p>
                                        <p><strong>Descripción:</strong> {store.coach.descripcion_coach || 'No disponible'}</p>
                                        <p><strong>Precio del Servicio:</strong> {store.coach.precio_servicio ? `$${store.coach.precio_servicio}` : 'No disponible'}</p>
                                    </div>
                                    <div className="text-center">
                                        <button 
                                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-200 hover:bg-blue-700"
                                            onClick={handleSendRequest}
                                        >
                                            Enviar Solicitud
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProfileCoach;
