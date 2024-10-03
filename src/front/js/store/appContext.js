import React, { useState, useEffect } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: (updatedStore) =>
                    setState({
                        store: { ...state.store, ...updatedStore }, // Asegúrate de combinar correctamente los estados
                        actions: { ...state.actions },
                    }),
            })
        );

        useEffect(() => {
            state.actions.getSmokers(); // Obtener la lista de fumadores al cargar
            const coachId = state.store.coachId; // Asumiendo que tienes el ID del coach en tu estado
            if (coachId) {
                state.actions.getCoach(coachId); // Obtener información del coach si el ID está disponible
            }
        }, [state.actions, state.store.coachId]);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;
