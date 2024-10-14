import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/appContext";
import Sidebar from "../component/DashboardCoach/SiderbarCoach"; // Cambié el sidebar al del coach
import Header from "../component/DashboardCoach/HeaderCoach"; // Cambié el header al del coach
import MainDashboard from "../component/DashboardCoach/MainDashboardCoach"; // Cambié el MainDashboard al del coach

export default function CoachDashboard() {
  const { store } = useStore();
  const [active, setActive] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true); // Modo oscuro
  const [date, setDate] = useState(new Date());
  const [clientsHelped, setClientsHelped] = useState(0); // Estado para clientes ayudados
  const [totalSessions, setTotalSessions] = useState(0); // Estado para el número total de sesiones
  const [totalHoursCoached, setTotalHoursCoached] = useState(0); // Estado para horas de coaching

  const navigate = useNavigate();

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
        <main className="p-6">
          <MainDashboard
            isDarkMode={isDarkMode}
            clientsHelped={clientsHelped}
            totalSessions={totalSessions}
            totalHoursCoached={totalHoursCoached}
            date={date}
            setDate={setDate}
          />
        </main>
      </div>
    </div>
  );
}
