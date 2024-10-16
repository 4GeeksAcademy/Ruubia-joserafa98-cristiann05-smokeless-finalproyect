import React from 'react'
import { Calendar as CalendarIcon, TrendingUp, Award, Activity, Bell, Users } from 'lucide-react'

// StatCard Component
function StatCard({ title, value, icon, color, subtitle, footer, isDarkMode }) {
  const Icon = icon
  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
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
  )
}

// MotivationalWidget Component
function MotivationalWidget() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Tu Motivación Diaria</h2>
      <p className="text-lg">"Cada cigarrillo que no fumas es una victoria. Sigue luchando por tu salud y tu futuro."</p>
      <button className="mt-4 bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
        Nueva Motivación
      </button>
    </div>
  )
}

// Calendar Component
function Calendar({ date, setDate, isDarkMode }) {
  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Calendario</h2>
      <div className="flex flex-wrap -mx-1">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="px-1 w-1/7 text-center text-sm font-medium">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
          <div key={day} className="px-1 w-1/7 text-center py-1">
            <button
              className={`w-8 h-8 rounded-full ${
                day === date.getDate()
                  ? 'bg-purple-500 text-white'
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
  )
}

// TipsAndTricks Component
function TipsAndTricks({ isDarkMode }) {
  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-2xl font-semibold mb-4">Consejos y Trucos</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Activity className="h-6 w-6 mr-2 text-green-500 flex-shrink-0 mt-1" />
          <span>Haz ejercicio regularmente para reducir el estrés y los antojos.</span>
        </li>
        <li className="flex items-start">
          <Bell className="h-6 w-6 mr-2 text-blue-500 flex-shrink-0 mt-1" />
          <span>Configura recordatorios para momentos de alto riesgo y mantente firme.</span>
        </li>
        <li className="flex items-start">
          <Users className="h-6 w-6 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
          <span>Únete a grupos de apoyo para compartir experiencias y motivación.</span>
        </li>
      </ul>
    </div>
  )
}

// MainDashboard Component
export default function MainDashboard({ 
  isDarkMode, 
  daysWithoutSmoking, 
  registrationDate, 
  totalSavings, 
  dailySaving,
  date,
  setDate
}) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Días sin fumar"
          value={daysWithoutSmoking}
          icon={CalendarIcon}
          color="purple"
          subtitle="¡Sigue así! Cada día cuenta."
          footer={`Fecha de registro: ${registrationDate}`}
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Gastos"
          value={`${totalSavings}€`}
          icon={TrendingUp}
          color="red"
          subtitle="Gastos totales desde que empezaste a fumar."
          footer={`
            Gastos Semanales: ${(dailySaving * 7).toFixed(2)}€
            Gastos Mensuales: ${(dailySaving * 30).toFixed(2)}€
            Gastos Anuales: ${(dailySaving * 365).toFixed(2)}€
          `}
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Dinero ahorrado"
          value={`${totalSavings}€`}
          icon={TrendingUp}
          color="green"
          subtitle="Imagina lo que puedes hacer con este ahorro."
          footer={
            <div className="mt-4 flex items-center">
              <span className="px-2 py-1 text-xs font-semibold bg-green-200 text-green-800 rounded-full mr-2">+5€</span>
              <span className="text-xs text-gray-500">desde ayer</span>
            </div>
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
  )
}