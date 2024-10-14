import React, { useContext } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta sea correcta
import Sidebar from '../component/DasboardSmoker/Sidebar'; // Importa el componente Sidebar
import Header from '../component/DasboardSmoker/Header'; // Importa el componente Header
import { useNavigate } from 'react-router-dom'; // Importa useNavigate si necesitas redireccionar

const AdviceSmoker = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); // Inicializa useNavigate

    // Función que se llama al hacer clic en el botón
    const handleAdvice = () => {
        const userId = store.loggedInUser.id; // Obtiene el ID del usuario
        actions.generarConsejo(userId); // Llama a la acción para obtener el consejo
    };

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
                        {store.loggedInUser.consejo && (
                            <div className="mt-4">
                                <h5>Consejo:</h5>
                                <p>{store.loggedInUser.consejo}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdviceSmoker;
