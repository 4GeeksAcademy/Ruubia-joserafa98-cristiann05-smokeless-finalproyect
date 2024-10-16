import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import Sidebar from '../component/DasboardSmoker/Sidebar';
import Header from '../component/DasboardSmoker/Header';
import { useNavigate } from 'react-router-dom';

const AdviceSmoker = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [consejo, setConsejo] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Obtiene el ID del usuario
        if (userId) {
            console.log("ID del usuario desde localStorage:", userId);
            // Llama a la acción para obtener la información del smoker
            actions.getSmoker(userId)
                .then(() => {
                    console.log("Información del usuario:", store.loggedInUser); // Asegúrate de que la información se haya actualizado
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error al obtener información del smoker:", error);
                    setLoading(false);
                });
        } else {
            console.error("No se encontró el ID del usuario en localStorage.");
            setLoading(false);
        }
    }, []); // Asegúrate de que el efecto dependa de las acciones y del store

    const handleAdvice = async () => {
        const userData = store.loggedInUser; // Usa el estado actualizado
        console.log("Datos del usuario:", userData); // Verifica los datos del usuario

        // Verifica que la información del usuario esté disponible
        if (!userData) {
            console.error("La información del usuario no está disponible.");
            alert("Por favor, completa tu información antes de solicitar un consejo.");
            return;
        }

        // Verifica que los datos del usuario sean completos
        const { tiempo_fumando, numero_cigarrillos, periodicidad_consumo } = userData;

        console.log("Tiempo fumando:", tiempo_fumando);
        console.log("Número de cigarrillos al día:", numero_cigarrillos);
        console.log("Periodicidad de consumo:", periodicidad_consumo);

        if (!tiempo_fumando || !numero_cigarrillos || !periodicidad_consumo) {
            console.error("Los datos del usuario son incompletos:", userData);
            alert("Por favor, completa tu información antes de solicitar un consejo.");
            return;
        }

        // Aquí puedes llamar a la función generarConsejo usando los datos del usuario
        await generarConsejo({ tiempo_fumando, numero_cigarrillos, periodicidad_consumo });
    };

    const generarConsejo = async (userInfo) => {
        try {
            const { tiempo_fumando, numero_cigarrillos, periodicidad_consumo } = userInfo;

            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `Soy un fumador que ha estado fumando durante ${tiempo_fumando} . Fumo ${numero_cigarrillos} cigarrillos y consumo de forma ${periodicidad_consumo}. ¿Puedes repetirme la informacion que te di y darme un consejo sobre cómo dejar de fumar?`
                        }
                    ]
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
            }

            const data = await response.json();
            console.log("Consejo recibido de la API:", data);

            // Actualiza el consejo en el estado local
            setConsejo(data.choices[0].message.content);

        } catch (error) {
            console.error("Error fetching consejo:", error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar active="Consejos" isDarkMode={true} handleNavigation={(item) => navigate(item.path)} />
            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={true} toggleTheme={() => {}} />
                <div className="user-main-content p-6">
                    <div className="text-center my-5">
                        <h1 className="display-4">¿Necesitas ayuda?</h1>
                        {loading ? (
                            <p>Cargando datos del usuario...</p> // Mensaje de carga
                        ) : (
                            <button 
                                className="btn btn-light tet-dark btn-lg mt-4" 
                                onClick={handleAdvice}
                            >
                                Dame un consejo
                            </button>
                        )}
                        {consejo && ( // Verificar que consejo no sea nulo antes de mostrarlo
                            <div className="mt-4">g
                                <p>{consejo}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdviceSmoker;
