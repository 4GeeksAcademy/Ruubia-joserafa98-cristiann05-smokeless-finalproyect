import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Context } from "../store/appContext"; 
import Sidebar from "../component/DashboardCoach/SiderbarCoach"; 
import Header from "../component/DashboardCoach/HeaderCoach"; 

const ViewProfileCoach = () => {
    const { coachId } = useParams(); // Extrae el coachId de la URL
    const navigate = useNavigate(); // Inicializa useNavigate
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return <p className="text-center text-gray-500">Cargando perfil del coach...</p>;
    }

    if (error) {
        return <p className="text-center text-gray-500">{error}</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-200">
                <h2 className="text-center text-3xl font-bold mb-6 text-gray-700">Perfil del Coach</h2>
                <div className="flex flex-col items-center mb-8">
                    <img 
                        src={store.coach.foto_coach || "https://via.placeholder.com/300"} 
                        alt="Foto del Coach" 
                        className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" 
                    />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-semibold">Nombre:</label>
                        <p className="text-gray-800 text-lg">{store.coach.nombre_coach || 'Nombre no disponible'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Email:</label>
                        <p className="text-gray-800 text-lg">{store.coach.email_coach || 'No disponible'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Género:</label>
                        <p className="text-gray-800 text-lg">{store.coach.genero_coach || 'No especificado'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Fecha de Nacimiento:</label>
                        <p className="text-gray-800 text-lg">{store.coach.nacimiento_coach || 'No disponible'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Dirección:</label>
                        <p className="text-gray-800 text-lg">{store.coach.direccion || 'No disponible'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Descripción:</label>
                        <p className="text-gray-800 text-lg">{store.coach.descripcion_coach || 'No disponible'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-semibold">Precio del Servicio:</label>
                        <p className="text-gray-800 text-lg">{store.coach.precio_servicio ? `$${store.coach.precio_servicio}` : 'No disponible'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate(-1)} // Navegar hacia atrás
                    className="mt-8 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-300 transform hover:scale-105 shadow-lg"
                >
                    Volver Atrás
                </button>
            </div>
        </div>
    );
};

export default ViewProfileCoach;
