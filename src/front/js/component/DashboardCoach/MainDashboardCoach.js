import React from 'react';
import { Calendar as CalendarIcon, TrendingUp, Award, Users, Activity, Bell } from 'lucide-react';

// StatCard Component
function StatCard({ title, value, icon, color, subtitle, footer, isDarkMode }) {
  const Icon = icon;
  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
        <Icon className={`h-6 w-6 text-${color}-500`} />
      </div>
      <p className={`text-4xl font-bold text-${color}-500`}>{value}</p>
      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
      {footer && (
        <div className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {typeof footer === 'string' ? <p className="text-sm">{footer}</p> : footer}
        </div>
      )}
    </div>
  );
}

// MotivationalWidget Component
function MotivationalWidget() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Motivación para tus Clientes</h2>
      <p className="text-lg">"Cada cliente que apoyas está un paso más cerca de mejorar su vida. ¡Sigue motivándolos!"</p>
      <button className="mt-4 bg-white text-blue-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
        Nueva Motivación
      </button>
    </div>
  );
}

// Calendar Component
function Calendar({ date, setDate, isDarkMode }) {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Calendario</h2>
      <div className="flex flex-wrap -mx-1">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="px-1 w-1/7 text-center text-sm font-medium">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
          <div key={day} className="px-1 w-1/7 text-center py-1">
            <button
              className={`w-8 h-8 rounded-full ${
                day === date.getDate()
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setDate(new Date(date.setDate(day)))}
            >
              {day}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// TipsAndTricks Component
function TipsAndTricks({ isDarkMode }) {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'}`}>
      <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Consejos para Coaches</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Activity className="h-6 w-6 mr-2 text-green-400 flex-shrink-0 mt-1" />
          <span>Proporciona rutinas personalizadas a tus clientes para mantenerlos motivados.</span>
        </li>
        <li className="flex items-start">
          <Bell className="h-6 w-6 mr-2 text-orange-400 flex-shrink-0 mt-1" />
          <span>Establece recordatorios para monitorear el progreso de tus clientes regularmente.</span>
        </li>
        <li className="flex items-start">
          <Users className="h-6 w-6 mr-2 text-blue-500 flex-shrink-0 mt-1" />
          <span>Organiza sesiones grupales para fomentar el apoyo entre clientes.</span>
        </li>
      </ul>
    </div>
  );
}

// MainDashboard Component
export default function MainDashboard({ 
  isDarkMode, 
  totalClients, 
  clientsProgress, 
  bestClient, 
  date, 
  setDate 
}) {
  const bestClientName = bestClient?.name || 'N/A'; 
  const bestClientProgress = bestClient?.progress ? `${bestClient.progress}%` : 'N/A'; 

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total de Clientes"
          value={totalClients}
          icon={Users}
          color="blue"
          subtitle="Número total de clientes que estás guiando."
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Progreso Promedio"
          value={`${clientsProgress}%`}
          icon={TrendingUp}
          color="green"
          subtitle="Progreso promedio de todos tus clientes."
          footer="Mantén a tus clientes enfocados para mejorar su progreso."
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Mejor Cliente"
          value={bestClientName} 
          icon={Award}
          color="orange"
          subtitle={`Progreso: ${bestClientProgress}`} 
          footer={
            <button className="mt-4 w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors duration-200">
              Ver detalles del cliente
            </button>
          }
          isDarkMode={isDarkMode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MotivationalWidget />
        <Calendar date={date} setDate={setDate} isDarkMode={isDarkMode} />
      </div>
      <TipsAndTricks isDarkMode={isDarkMode} />
    </div>
  );
}
