import React, { useState, useEffect, useContext } from "react";
import getState from "../store/flux";

export const Context = React.createContext(null);

// Hook personalizado para usar el contexto
export const useStore = () => {
    return useContext(Context);
};

const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: (updatedStore) =>
                    setState((prevState) => ({
                        store: { ...prevState.store, ...updatedStore },
                        actions: { ...prevState.actions },
                    })),
            })
        );

        useEffect(() => {
            const fetchData = async () => {
                try {
                    await state.actions.getAllSmokers(); // Obtener la lista de fumadores
                    const coachId = state.store.coachId;
                    if (coachId) {
                        await state.actions.getCoach(coachId); // Obtener información del coach
                    }
                } catch (error) {
                    console.error("Error al obtener datos:", error); // Manejo de errores
                }
            };

            fetchData();
        }, []); // Dependencias

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;
