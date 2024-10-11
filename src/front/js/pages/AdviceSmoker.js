import React, { useContext } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta sea correcta

const AdviceSmoker = () => {
    const { store, actions } = useContext(Context);

    // Función que se llama al hacer clic en el botón
    const handleAdvice = () => {
        const userId = store.loggedInUser.id; // Obtiene el ID del usuario
        actions.generarConsejo(userId); // Llama a la acción para obtener el consejo
    };

    return (
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
    );
};

export default AdviceSmoker;
