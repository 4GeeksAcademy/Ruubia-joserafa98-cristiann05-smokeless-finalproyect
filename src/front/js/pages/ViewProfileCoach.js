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
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [active, setActive] = useState("home"); // Valor predeterminado 'home', o cualquier otro que necesites

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
    }, []);
    const handleNavigation = (item) => {
        if (!item || !item.name || !item.path) {
          console.error("Error: item is undefined or missing name/path", item);
          return; // Evita ejecutar la navegación si item no está definido correctamente
        }
        setActive(item.name);
        navigate(item.path);
      };
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
      };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando perfil del coach...</p>;
    }

    if (error) {
        return <p className="text-center text-gray-500">{error}</p>;
    }

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-indigo-900 text-white' : 'bg-yellow-100 text-gray-900'}`}>
          <Sidebar 
            active={active} 
            isDarkMode={isDarkMode} 
            handleNavigation={handleNavigation} 
          />
          <div className="md:ml-64 flex-1">
            <Header
              active={active}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
            />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6"> {/* Fondo oscuro */}
              <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-700"> {/* Caja más oscura */}
                <h2 className="text-center text-3xl font-bold mb-6 text-white">Perfil del Coach</h2> {/* Texto blanco */}
                <div className="flex flex-col items-center mb-8">
                  <img 
                    src={store.coach.foto_coach || "https://via.placeholder.com/300"} 
                    alt="Foto del Coach" 
                    className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" 
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 font-semibold">Nombre:</label> {/* Texto gris claro */}
                    <p className="text-white text-lg">{store.coach.nombre_coach || 'Nombre no disponible'}</p> {/* Texto blanco */}
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
    }      

export default ViewProfileCoach;
