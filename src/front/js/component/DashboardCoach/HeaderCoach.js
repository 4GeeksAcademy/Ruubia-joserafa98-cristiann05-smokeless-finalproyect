import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ active, isDarkMode, toggleTheme }) {
  const { store, actions } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

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

  // Verificar la autenticación al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('jwtTokenCoach');
    // Solo redirige si no hay token
    if (!token && !store.isAuthenticated) {
      navigate("/");
    }
  }, [navigate, store.isAuthenticated]); // Dependencias actualizadas

  const handleLogout = () => {
    actions.logoutCoach();
    navigate("/");
  };

  const handleProfileOptionClick = (option) => {
    setIsProfileOpen(false);
    const coachId = localStorage.getItem('coachId');
    switch (option) {
      case 'profile':
        if (coachId) {
          navigate(`/Dashboard-Coach/coach-profile/${coachId}`); 
        }
        break;
      case 'settings':
        navigate(`/Dashboard-coach/configuracion/${coachId}`);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

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
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img src="https://api.dicebear.com/6.x/micah/svg?seed=Coach" alt="Perfil" className="h-8 w-8 rounded-full" />
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
