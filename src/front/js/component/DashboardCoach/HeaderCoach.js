import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/appContext'; 
import { useNavigate } from 'react-router-dom'; 

export default function Header({ active, isDarkMode, toggleTheme }) {
  const { store, actions } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(""); // Estado para almacenar la imagen del perfil
  const [loading, setLoading] = useState(true); // Estado para mostrar el indicador de carga
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Función para alternar el menú de perfil
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener el perfil del coach y manejar errores
  useEffect(() => {
    const fetchCoachProfile = async () => {
      const coachId = localStorage.getItem('coachId'); // Obtenemos el ID del coach
      if (coachId) {
        const apiUrl = `${process.env.BACKEND_URL}/api/coaches/${coachId}`; // URL del API del coach
        try {
          const response = await fetch(apiUrl, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("jwtTokenCoach")}` // Token de autenticación
            }
          });

          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }

          const coachData = await response.json(); // Obtenemos los datos del coach
          if (coachData && coachData.public_id) {
            // Verificamos si public_id contiene una URL válida
            const imageUrl = coachData.public_id.startsWith("https://") 
                ? coachData.public_id // Usa directamente la URL completa
                : `https://res.cloudinary.com/dhieuyort/image/upload/${coachData.public_id}.jpg`; // Alternativa si solo se proporciona el public_id
        
            console.log('Image URL:', imageUrl); 
            setUserProfileImage(imageUrl); // Establecemos la imagen del perfil
          } else {
            console.error("No public_id found in coach data.");
            navigate('/question-profile-coach'); // Redirige si no se encuentra public_id
          }

          setLoading(false);
        } catch (error) {
          console.error("Error al obtener los datos del perfil del coach:", error);
          setLoading(false);
        }
      } else {
        console.warn("No se encontró coachId en localStorage");
        setLoading(false);
      }
    };

    fetchCoachProfile(); // Llama a la función para obtener el perfil del coach
  }, [navigate]);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    actions.logoutCoach(); // Llama a la acción de cierre de sesión
    navigate('/'); // Redirige al inicio
  };

  // Manejar las opciones de menú de perfil
  const handleProfileOptionClick = (option) => {
    setIsProfileOpen(false);
    const coachId = localStorage.getItem('coachId');
    switch (option) {
      case 'profile':
        if (coachId) navigate(`/Dashboard-Coach/coach-profile/${coachId}`); 
        break;
      case 'settings':
        navigate(`/Dashboard-Coach/configuracion/${coachId}`);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  // Renderizado del componente
  return (
    <header className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-md sticky top-0 z-20`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{active}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="relative" ref={profileRef}>
            <button onClick={toggleProfile} className="flex items-center space-x-2 focus:outline-none">
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse" /> // Indicador de carga
              ) : (
                <img src={userProfileImage} alt="Perfil" className="h-8 w-8 rounded-full" /> // Imagen de perfil
              )}
              <ChevronDown className="h-4 w-4" />
            </button>
            {isProfileOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-50`}>
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    onClick={() => handleProfileOptionClick('profile')}
                    className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    <User className="inline-block w-4 h-4 mr-2" />
                    Perfil
                  </button>
                  <button
                    onClick={() => handleProfileOptionClick('settings')}
                    className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    Configuración
                  </button>
                  <button
                    onClick={() => handleProfileOptionClick('logout')}
                    className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
