import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/appContext'; // Importa el store
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación

export default function Header({ active, isDarkMode, toggleTheme }) {
  const { actions } = useStore(); // Accede a las acciones del store
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null); // Crea una referencia para el menú de perfil
  const navigate = useNavigate(); // Inicializa useNavigate

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false); // Cierra el menú si se hace clic fuera
      }
    };

    // Añade el listener de clic
    document.addEventListener('mousedown', handleClickOutside);
    
    // Limpia el listener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lógica para cerrar sesión
  const handleLogout = () => {
    actions.logoutsmoker(); // Llama a la acción para cerrar sesión
    navigate('/'); // Redirige a la página de inicio después de cerrar sesión
  };

  // Maneja la selección de opciones del menú
  const handleProfileOptionClick = (option) => {
    setIsProfileOpen(false); // Cierra el menú
    const userId = localStorage.getItem('userId'); // Obtiene el ID del usuario desde localStorage
    switch (option) {
      case 'profile':
        if (userId) {
          navigate(`/Dashboard-Smoker/smoker-profile/${userId}`); 
        }
        break;
      case 'settings':
        navigate(`/Dashboard-Smoker/configuracion/${userId}`); // Ruta de configuración
        break;
      case 'logout':
        handleLogout(); // Llama a la lógica de cerrar sesión
        break;
      default:
        break;
    }
  };

  return (
    <header className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-20`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{active}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDarkMode
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img src="https://api.dicebear.com/6.x/micah/svg?seed=Aneka" alt="Perfil" className="h-8 w-8 rounded-full" />
              <ChevronDown className="h-4 w-4" />
            </button>
            {isProfileOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-50`}>
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    onClick={() => handleProfileOptionClick('profile')} // Llama a la función con la opción 'profile'
                    className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    <User className="inline-block w-4 h-4 mr-2" />
                    Perfil
                  </button>
                  <button
                    onClick={() => handleProfileOptionClick('settings')} // Llama a la función con la opción 'settings'
                    className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    Configuración
                  </button>
                  <button // Botón de cierre de sesión
                    onClick={() => handleProfileOptionClick('logout')} // Llama a la función con la opción 'logout'
                    className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
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
