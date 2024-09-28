const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: []
        },
        actions: {
            getSmokers: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`);
                    const data = await response.json();
                    setStore({ smokers: data }); 
                } catch (error) {
                    console.error("Error fetching smokers:", error);
                }
            },

            
            createSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });

                    if (response.ok) {
                        const newSmoker = await response.json();
                        setStore({ smokers: [...getStore().smokers, newSmoker] }); // Añadimos el nuevo fumador a la lista
                    }
                } catch (error) {
                    console.error("Error creating smoker:", error);
                }
            },

            // Actualizar un fumador existente
            updateSmoker: async (smokerId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers/${smokerId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const updatedSmoker = await response.json();
                        const smokers = getStore().smokers.map(smoker =>
                            smoker.id === smokerId ? updatedSmoker : smoker
                        );
                        setStore({ smokers }); // Actualizamos la lista de fumadores
                    }
                } catch (error) {
                    console.error("Error updating smoker:", error);
                }
            },

            // Eliminar un fumador
            deleteSmoker: async (smokerId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers/${smokerId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        const smokers = getStore().smokers.filter(smoker => smoker.id !== smokerId);
                        setStore({ smokers }); // Actualizamos la lista de fumadores
                    }
                } catch (error) {
                    console.error("Error deleting smoker:", error);
                }
            },
            
            getConsuming: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`);
                    const data = await response.json();
                    setStore({ tiposConsumo: data }); 
                } catch (error) {
                    console.error("Error fetching tiposconsumo:", error);
                }
            },

        },
    };
};

export default getState;
