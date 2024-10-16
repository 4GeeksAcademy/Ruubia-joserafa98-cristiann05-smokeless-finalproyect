import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Context } from "../store/appContext"; 
import Sidebar from "../component/DasboardSmoker/Sidebar"; // Importa el componente Sidebar
import Header from "../component/DasboardSmoker/Header";

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const { store, actions } = useContext(Context);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/smoker/${userId}`, {
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
                setUserData(data);
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando perfil del usuario...</p>;
    }

    if (!userData) {
        return <p className="text-center text-gray-500">No se pudo cargar el perfil del usuario.</p>;
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Alterna entre modo oscuro y claro
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar active="Lista de Coaches" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} /> {/* Sidebar con navegación */}
    
            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Header */}
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6"> {/* Fondo más oscuro */}
                    <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-700"> {/* Fondo de tarjeta más oscuro */}
                        <h2 className="text-center text-3xl font-bold mb-6 text-gray-300">Perfil de Usuario</h2> {/* Texto claro */}
                        <div className="flex flex-col items-center mb-8">
                            {userData.public_id ? (
                                // Usar la URL completa de la imagen almacenada en userData.foto_usuario
                                <img src={userData.public_id} alt="Foto de usuario" className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-gray-500 flex items-center justify-center mb-4 shadow-lg"> {/* Bordes más oscuros */}
                                    <span className="text-gray-400 text-xl">Sin foto</span> {/* Texto claro */}
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 font-semibold">Nombre:</label> {/* Etiquetas en gris claro */}
                                <p className="text-gray-200 text-lg">{userData.nombre_usuario}</p> {/* Texto en gris claro */}
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Email:</label>
                                <p className="text-gray-200 text-lg">{userData.email_usuario}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Género:</label>
                                <p className="text-gray-200 text-lg">{userData.genero_usuario}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Fecha de Nacimiento:</label>
                                <p className="text-gray-200 text-lg">{userData.nacimiento_usuario}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Tiempo Fumando:</label>
                                <p className="text-gray-200 text-lg">{userData.tiempo_fumando}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Número de Cigarrillos:</label>
                                <p className="text-gray-200 text-lg">{userData.numero_cigarrillos}</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold">Periodicidad de Consumo:</label>
                                <p className="text-gray-200 text-lg">{userData.periodicidad_consumo}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(-1)} // Navigate back
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

export default UserProfile;
