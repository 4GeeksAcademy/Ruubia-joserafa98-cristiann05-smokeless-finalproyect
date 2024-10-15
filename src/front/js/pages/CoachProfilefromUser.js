import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Context } from "../store/appContext"; 
import Sidebar from "../component/DasboardSmoker/Sidebar"; 
import Header from "../component/DasboardSmoker/Header"; 

const CoachProfileFromUser = () => {
    const { coachId } = useParams();
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const fetchCoachData = async () => {
            if (!coachId) {
                setError("No se ha proporcionado coachId");
                setLoading(false);
                return;
            }
            try {
                await actions.getCoach(coachId);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del coach:", error);
                setError("No se pudieron obtener los datos del coach.");
                setLoading(false);
            }
        };
        fetchCoachData();
    }, [coachId]); // Agregar coachId como dependencia

    // Verificar si está cargando
    if (loading) {
        return <div>Cargando...</div>; // Aquí puedes añadir un spinner o mensaje de carga
    }

    // Mostrar error si existe
    if (error) {
        return <div>Error: {error}</div>; // Mostrar el error si ocurrió
    }

    // Verifica que store.coach esté definido
    if (!store.coach) {
        return <div>No se encontraron datos del coach.</div>;
    }

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar active="Lista de Coaches" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} />

            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                    <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-700">
                        <h2 className="text-center text-3xl font-bold mb-6 text-white">Perfil del Coach</h2>
                        <div className="flex flex-col items-center mb-8">
                            <img 
                                src={store.coach.foto_coach || "https://via.placeholder.com/300"} 
                                alt="Foto del Coach" 
                                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" 
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 font-semibold">Nombre:</label>
                                <p className="text-white text-lg">{store.coach.nombre_coach || 'Nombre no disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Email:</label>
                                <p className="text-white text-lg">{store.coach.email_coach || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Género:</label>
                                <p className="text-white text-lg">{store.coach.genero_coach || 'No especificado'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Fecha de Nacimiento:</label>
                                <p className="text-white text-lg">{store.coach.nacimiento_coach || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Dirección:</label>
                                <p className="text-white text-lg">{store.coach.direccion || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Descripción:</label>
                                <p className="text-white text-lg">{store.coach.descripcion_coach || 'No disponible'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Precio del Servicio:</label>
                                <p className="text-white text-lg">{store.coach.precio_servicio ? `$${store.coach.precio_servicio}` : 'No disponible'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(-1)}
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

export default CoachProfileFromUser;
