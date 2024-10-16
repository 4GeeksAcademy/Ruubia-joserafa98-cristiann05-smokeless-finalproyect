import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Sidebar from "../component/DashboardCoach/SiderbarCoach"; // Importa el componente Sidebar específico del coach
import Header from "../component/DashboardCoach/HeaderCoach"; // Importa el Header del coach

const CoachProfile = () => {
    const { coachId } = useParams(); // Obtenemos el coachId de la URL
    const navigate = useNavigate(); // Inicializa useNavigate para la navegación
    const { store, actions } = useContext(Context);
    const [coachData, setCoachData] = useState(null); // Estado para los datos del coach
    const [loading, setLoading] = useState(true); // Estado para controlar el loading
    const [isDarkMode, setIsDarkMode] = useState(true); // Estado para el tema oscuro/claro

    useEffect(() => {
        const fetchCoachProfile = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setCoachData(data); // Guardamos los datos del coach en el estado
            } catch (error) {
                console.error("Error al obtener el perfil del coach:", error);
            } finally {
                setLoading(false); // Desactivamos el estado de loading
            }
        };

        fetchCoachProfile();
    }, [coachId]); // El efecto depende de coachId para ejecutarse cada vez que cambia

    if (loading) {
        return <p className="text-center text-gray-500">Cargando perfil del coach...</p>;
    }

    if (!coachData) {
        return <p className="text-center text-gray-500">No se pudo cargar el perfil del coach.</p>;
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Alterna entre tema oscuro y claro
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar 
                active="Perfil del Coach" 
                isDarkMode={isDarkMode} 
                handleNavigation={(item) => navigate(item.path)} 
            /> {/* Sidebar con navegación específica para el coach */}
    
            <div className="md:ml-64 flex-1">
                <Header 
                    onLogout={() => actions.logoutCoach()} 
                    isDarkMode={isDarkMode} 
                    toggleTheme={toggleTheme} 
                /> {/* Header del coach */}
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6"> {/* Fondo más oscuro */}
                    <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-700"> {/* Fondo de tarjeta más oscuro */}
                        <h2 className="text-center text-3xl font-bold mb-6 text-gray-300">Perfil del Coach</h2> {/* Texto claro */}
                        <div className="flex flex-col items-center mb-8">
                            {coachData.public_id ? (
                                // Usar la URL completa de la imagen almacenada en Cloudinary (public_id)
                                <img src={coachData.public_id} alt="Foto del coach" className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-gray-500 flex items-center justify-center mb-4 shadow-lg"> {/* Bordes más oscuros */}
                                    <span className="text-gray-400 text-xl">Sin foto</span> {/* Texto claro */}
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 font-semibold">Nombre:</label> {/* Etiquetas en gris claro */}
                                <p className="text-gray-200 text-lg">{coachData.nombre_coach || 'No disponible'}</p> {/* Texto en gris claro */}
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Email:</label>
                                <p className="text-gray-200 text-lg">{coachData.email_coach || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Género:</label>
                                <p className="text-gray-200 text-lg">{coachData.genero_coach || 'No especificado'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Fecha de Nacimiento:</label>
                                <p className="text-gray-200 text-lg">{coachData.nacimiento_coach || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Descripción:</label>
                                <p className="text-gray-200 text-lg">{coachData.descripcion_coach || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Precio del Servicio:</label>
                                <p className="text-gray-200 text-lg">{coachData.precio_servicio ? `$${coachData.precio_servicio}` : 'No disponible'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(-1)} // Navegar hacia atrás
                            className="mt-8 w-full bg-light text-dark font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Volver Atrás
                        </button>
                    </div>
                </div>
            </div>
        </div>  
    );
};

export default CoachProfile;
