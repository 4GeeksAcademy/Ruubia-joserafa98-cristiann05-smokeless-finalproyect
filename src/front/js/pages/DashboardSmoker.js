import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/appContext'
import Sidebar from '../component/DasboardSmoker/Sidebar'
import Header from '../component/DasboardSmoker/Header'
import MainDashboard from '../component/DasboardSmoker/MainDashboard'

export default function SmokelessDashboard() {
  const { store } = useStore()
  const [active, setActive] = useState('Dashboard')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [date, setDate] = useState(new Date())
  const [registrationDate, setRegistrationDate] = useState('')
  const [dailySaving, setDailySaving] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [daysWithoutSmoking, setDaysWithoutSmoking] = useState(0)
  const [hasNewNotification, setHasNewNotification] = useState(false) // Nuevo estado para las notificaciones

  const navigate = useNavigate()

  const getUserDataFromLocalStorage = () => {
    const userData = localStorage.getItem('loggedInUser')
    return userData ? JSON.parse(userData) : null
  }

  const calcularAhorro = (numero_cigarrillos, periodicidad_consumo) => {
    const costo_por_cigarrillo = 4.50 / 20
    const gastoDiario = numero_cigarrillos * costo_por_cigarrillo
    let totalAhorros = 0

    if (periodicidad_consumo === 'diaria') {
      totalAhorros = gastoDiario
    } else if (periodicidad_consumo === 'semanal') {
      totalAhorros = gastoDiario * 7
    } else if (periodicidad_consumo === 'mensual') {
      totalAhorros = gastoDiario * 30
    } else if (periodicidad_consumo === 'anual') {
      totalAhorros = gastoDiario * 365
    }

    return {
      diario: gastoDiario.toFixed(2),
      semanal: (gastoDiario * 7).toFixed(2),
      mensual: (gastoDiario * 30).toFixed(2),
      anual: (gastoDiario * 365).toFixed(2),
      totalAhorros: totalAhorros.toFixed(2),
    }
  }

  useEffect(() => {
    const loggedInUser = getUserDataFromLocalStorage()

    if (loggedInUser) {
      const { numero_cigarrillos, periodicidad_consumo } = loggedInUser
      const fechaRegistro = localStorage.getItem('fechaRegistro')
      if (fechaRegistro) {
        setRegistrationDate(new Date(fechaRegistro).toLocaleDateString())
        const today = new Date()
        const registration = new Date(fechaRegistro)
        const diffTime = Math.abs(today - registration)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setDaysWithoutSmoking(diffDays)

        const ahorros = calcularAhorro(numero_cigarrillos, periodicidad_consumo)
        setDailySaving(parseFloat(ahorros.diario))
        setTotalSavings(parseFloat(ahorros.totalAhorros))
      }
    }
  }, [])

  const handleNavigation = (item) => {
    setActive(item.name)
    navigate(item.path)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleNotification = (value) => {
    setHasNewNotification(value);
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Sidebar active={active} isDarkMode={isDarkMode} handleNavigation={handleNavigation} />
      <div className="md:ml-64 flex-1">
        <Header
          active={active}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          hasNewNotification={handleNotification} // Pasar la función correctamente
        />
        <main className="p-6">
          <MainDashboard
            isDarkMode={isDarkMode}
            daysWithoutSmoking={daysWithoutSmoking}
            registrationDate={registrationDate}
            totalSavings={totalSavings}
            dailySaving={dailySaving}
            date={date}
            setDate={setDate}
          />
        </main>
      </div>
    </div>
  )
}
