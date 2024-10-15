import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"; 
import { Context } from "../../store/appContext";
import Sidebar from "./Sidebar";  
import Header from "./Header";

const UserSettings = () => {
    const { userId } = useParams();
    const { store, actions } = useContext(Context);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingConsumption, setIsEditingConsumption] = useState(false);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('profile');
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
                setFormData(data); // Initialize formData with fetched user data
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const { email_usuario, ...dataToUpdate } = formData; // Exclude email from the data to update
            const response = await fetch(`${process.env.BACKEND_URL}/api/smoker/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(dataToUpdate) // Send only the data that needs to be updated
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const updatedUser = await response.json();
            setUserData(updatedUser); // Update user data with the new changes
            setFormData(updatedUser); // Update formData with the new changes
            setIsEditingProfile(false); // Close editing mode
            setIsEditingConsumption(false); // Close editing mode
        } catch (error) {
            console.error("Error al actualizar el perfil del usuario:", error);
        }
    };

    const toggleTab = (tab) => {
        setActiveTab(tab);
        setIsEditingProfile(false);
        setIsEditingConsumption(false);
    };

    if (loading) {
        return <p className="text-center text-gray-400">Cargando perfil del usuario...</p>;
    }

    if (!userData) {
        return <p className="text-center text-gray-400">No se pudo cargar el perfil del usuario.</p>;
    }
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Alterna entre modo oscuro y claro
    };
    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar active="Lista de Coaches" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} /> 
            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen flex items-center justify-center p-6`}>
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} container mx-auto p-6 rounded-lg shadow-lg`}>
                        {/* Botón Volver Atrás */}
                        <button
                            onClick={() => window.history.back()} // Navegar hacia atrás
                            className="mb-4 px-4 py-2 bg-light text-dark font-semibold rounded-lg shadow hover:bg-blue-400 transition duration-200"
                        >
                            Volver Atrás
                        </button>
    
                        <h2 className="text-center text-3xl font-semibold mb-6">
                            Configuración de Usuario
                        </h2>
                        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md overflow-hidden`}>
                            {/* Pestañas */}
                            <div className="flex border-b border-gray-300">
                                <button
                                    className={`flex-1 py-3 text-lg font-medium ${activeTab === "profile" ? "bg-light text-dark" : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`} transition-colors duration-200`}
                                    onClick={() => toggleTab("profile")}
                                >
                                    Configuración de Perfil
                                </button>
                                <button
                                    className={`flex-1 py-3 text-lg font-medium ${activeTab === "consumption" ? "bg-light text-dark" : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`} transition-colors duration-200`}
                                    onClick={() => toggleTab("consumption")}
                                >
                                    Configuración de Consumo
                                </button>
                            </div>
    
                            {/* Contenido de la pestaña de configuración de perfil */}
                            {activeTab === "profile" && (
                                <div className="p-6">
                                    <div className="flex justify-center mb-4">
                                        {userData.foto_usuario ? (
                                            <img src={userData.foto_usuario} alt="Foto de usuario" className="w-28 h-28 rounded-full border-2 border-blue-500" />
                                        ) : (
                                            <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                <span className="text-gray-400">Sin foto</span>
                                            </div>
                                        )}
                                    </div>
    
                                    <h3 className="text-xl font-semibold mt-4">
                                        Perfil de Usuario
                                    </h3>
                                    <form>
                                        <div className="mb-4">
                                            <label className="block">
                                                Nombre de Usuario:
                                            </label>
                                            {isEditingProfile ? (
                                                <input
                                                    type="text"
                                                    name="nombre_usuario"
                                                    value={formData.nombre_usuario || ''}
                                                    onChange={handleChange}
                                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-200`}
                                                />
                                            ) : (
                                                <p>{userData.nombre_usuario}</p>
                                            )}
                                        </div>
    
                                        <div className="mb-4">
                                            <label className="block">Género:</label>
                                            {isEditingProfile ? (
                                                <select
                                                    name="genero_usuario"
                                                    value={formData.genero_usuario || ''}
                                                    onChange={handleChange}
                                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-200`}
                                                >
                                                    <option value="" disabled>Selecciona un género</option>
                                                    <option value="Masculino">Masculino</option>
                                                    <option value="Femenino">Femenino</option>
                                                </select>
                                            ) : (
                                                <p>{userData.genero_usuario}</p>
                                            )}
                                        </div>
    
                                        <div className="mb-4">
                                            <label className="block">Fecha de Nacimiento:</label>
                                            {isEditingProfile ? (
                                                <input
                                                    type="date"
                                                    name="nacimiento_usuario"
                                                    value={formData.nacimiento_usuario || ''}
                                                    onChange={handleChange}
                                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-200`}
                                                />
                                            ) : (
                                                <p>{userData.nacimiento_usuario}</p>
                                            )}
                                        </div>
    
                                        {isEditingProfile ? (
                                            <button
                                                type="button"
                                                onClick={handleSaveChanges}
                                                className="w-full bg-light text-dark font-semibold py-2 rounded hover:bg-blue-400 transition duration-200"
                                            >
                                                Guardar Cambios
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(true)}
                                                className="w-full bg-light text-dark font-semibold py-2 rounded hover:bg-blue-400 transition duration-200"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}
    
                            {/* Contenido de la pestaña de configuración de consumo */}
                            {activeTab === "consumption" && (
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mt-4">
                                        Configuración de Consumo
                                    </h3>
                                    <form>
                                        <div className="mb-4">
                                            <label className="block">Número de Cigarrillos:</label>
                                            {isEditingConsumption ? (
                                                <input
                                                    type="number"
                                                    name="numero_cigarrillos"
                                                    value={formData.numero_cigarrillos || ''}
                                                    onChange={handleChange}
                                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-200`}
                                                />
                                            ) : (
                                                <p>{userData.numero_cigarrillos}</p>
                                            )}
                                        </div>
    
                                        <div className="mb-4">
                                            <label className="block">Periodicidad:</label>
                                            {isEditingConsumption ? (
                                                <select
                                                    name="periodicidad_consumo"
                                                    value={formData.periodicidad_consumo || ''}
                                                    onChange={handleChange}
                                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-200`}
                                                >
                                                    <option value="" disabled>Selecciona una periodicidad</option>
                                                    <option value="Diaria">Diaria</option>
                                                    <option value="Semanal">Semanal</option>
                                                    <option value="Mensual">Mensual</option>
                                                    <option value="Anual">Anual</option>
                                                </select>
                                            ) : (
                                                <p>{userData.periodicidad_consumo}</p>
                                            )}
                                        </div>
    
                                        {isEditingConsumption ? (
                                            <button
                                                type="button"
                                                onClick={handleSaveChanges}
                                                className="w-full bg-light text-dark font-semibold py-2 rounded hover:bg-blue-400 transition duration-200"
                                            >
                                                Guardar Cambios
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingConsumption(true)}
                                                className="w-full bg-white text-dark font-semibold py-2 rounded hover:bg-blue-400 transition duration-200"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }

export default UserSettings;
