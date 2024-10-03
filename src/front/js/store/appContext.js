import React, { useState, useEffect, useContext } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

// Asegúrate de incluir esta función para usar el contexto
export const useStore = () => {
    return useContext(Context);
};

const injectContext = PassedComponent => {
    const StoreWrapper = props => {
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: updatedStore => 
                    setState({
                        store: Object.assign(state.store, updatedStore),
                        actions: { ...state.actions }
                    })
            })
        );

        useEffect(() => {
            state.actions.getSmokers(); // Obtener la lista de fumadores al cargar
        }, [state.actions]);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;
