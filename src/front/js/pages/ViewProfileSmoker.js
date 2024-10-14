import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Context } from "../store/appContext"; 

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const { store, actions } = useContext(Context);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-200">
                <h2 className="text-center text-3xl font-bold mb-6 text-gray-700">Perfil de Usuario</h2>
                <div className="flex flex-col items-center mb-8">
                    {userData.foto_usuario ? (
                        <img src={userData.foto_usuario} alt="Foto de usuario" className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center mb-4 shadow-lg">
                            <span className="text-gray-400 text-xl">Sin foto</span>
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-semibold">Nombre:</label>
                        <p className="text-gray-800 text-lg">{userData.nombre_usuario}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Email:</label>
                        <p className="text-gray-800 text-lg">{userData.email_usuario}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Género:</label>
                        <p className="text-gray-800 text-lg">{userData.genero_usuario}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Fecha de Nacimiento:</label>
                        <p className="text-gray-800 text-lg">{userData.nacimiento_usuario}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Tiempo Fumando:</label>
                        <p className="text-gray-800 text-lg">{userData.tiempo_fumando}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Número de Cigarrillos:</label>
                        <p className="text-gray-800 text-lg">{userData.numero_cigarrillos}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Periodicidad de Consumo:</label>
                        <p className="text-gray-800 text-lg">{userData.periodicidad_consumo}</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate(-1)} // Navigate back
                    className="mt-8 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-300 transform hover:scale-105 shadow-lg"
                >
                    Volver Atrás
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
