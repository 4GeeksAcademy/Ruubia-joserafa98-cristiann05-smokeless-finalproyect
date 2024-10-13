import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Header({ active, isDarkMode, toggleTheme, hasNewNotification, notifications }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    if (isNotificationsOpen) {
      hasNewNotification(false); // Resetea el contador cuando se abren las notificaciones
    }
  }, [isNotificationsOpen, hasNewNotification]);

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
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
            >
              <Bell className={`h-5 w-5 ${hasNewNotification ? 'text-red-500' : 'text-gray-300'}`} />
            </button>
            {isNotificationsOpen && (
              <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-50`}>
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No tienes notificaciones.</div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div key={index} className="px-4 py-2 text-sm">
                        {notification}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
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
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`} role="menuitem">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Perfil
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`} role="menuitem">
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    Configuración
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`} role="menuitem">
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Cerrar sesión
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
