import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta sea correcta
import Sidebar from '../component/DasboardSmoker/Sidebar'; // Importa el componente Sidebar
import Header from '../component/DasboardSmoker/Header'; // Importa el componente Header
import { useNavigate } from 'react-router-dom'; // Importa useNavigate si necesitas redireccionar

const AdviceSmoker = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); // Inicializa useNavigate

    // Efecto para obtener los datos del fumador
    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Obtiene el ID del usuario
        if (userId) {
            console.log("ID del usuario desde localStorage:", userId); // Verifica el ID del usuario
            actions.getUserInfo(userId); // Llama a la acción para obtener la información del usuario
        }
    }, []);

    // Función que se llama al hacer clic en el botón
    const handleAdvice = () => {
        const userId = store.userInfo?.id; // Usa el operador de encadenamiento opcional
        console.log("ID del usuario:", userId); // Verifica el ID del usuario

        // Verificar si los datos del usuario están completos antes de llamar a generarConsejo
        // const userInfoComplete = (store.userInfo?.tiempo_fumando) && 
        //     (store.userInfo?.numero_cigarrillos) &&
        //     (store.userInfo?.periodicidad_consumo);
        //     console.log (userInfoComplete)

        // if (!userInfoComplete) {
        //     console.error("Los datos del usuario son incompletos:", store.userInfo);
        //     alert("Por favor, completa tu información antes de solicitar un consejo.");
        //     return; // No hacer nada si los datos no son válidos
        // }

        actions.generarConsejo(userId); // Llama a la acción para obtener el consejo
    };
    useEffect (() =>{
        console.log (store.userInfo)
    }, [store.userInfo])

    // Verificar si los datos del usuario están completos y mostrar un mensaje si no lo están
    useEffect(() => {
        if (store.userInfo) {
            const userInfoComplete = store.userInfo.tiempo_fumando &&
                store.userInfo.numero_cigarrillos &&
                store.userInfo.periodicidad_consumo;

            if (!userInfoComplete) {
                console.error("Los datos del usuario son incompletos:", store.userInfo);
                alert("Por favor, completa tu información antes de solicitar un consejo.");
            }
        }
    }, [store.userInfo]);

    return ( 
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar active="Consejos" isDarkMode={true} handleNavigation={(item) => navigate(item.path)} /> {/* Sidebar con navegación */}
            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={true} toggleTheme={() => {}} /> {/* Header */}
                <div className="user-main-content p-6"> {/* Contenido principal */}
                    <div className="text-center my-5">
                        <h1 className="display-4">¿Necesitas ayuda?</h1>
                        <button 
                            className="btn btn-primary btn-lg mt-4" 
                            onClick={handleAdvice}
                        >
                            Dame un consejo
                        </button>
                        {store.userInfo && store.userInfo.consejo && ( // Verificar que userInfo no sea nulo antes de acceder a consejo
                            <div className="mt-4">
                                <h5>Consejo:</h5>
                                <p>{store.userInfo.consejo}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdviceSmoker;
