const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: [],
            coaches: [],
            loggedInUser: null,
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

            signupSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });
            
                    if (response.ok) {
                        const newSmoker = await response.json();
                        setStore({ smokers: [...getStore().smokers, newSmoker] });
                        localStorage.setItem("token", newSmoker.token);  // Guarda el token si es parte de la respuesta
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el registro del fumador:", error);
                    return false;
                }
            },
            
            loginSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        // Suponiendo que `data` contiene el ID del usuario y el token
                        setStore({
                            isAuthenticated: true, // Marca al usuario como autenticado
                            userId: data.user_id, // Guarda el ID del usuario en el store
                            // Otras propiedades que necesites
                        });
                        localStorage.setItem("token", data.token); // Guarda el token si es necesario
                        return true; // Indica que el inicio de sesión fue exitoso
                    } else {
                        return false; // Indica que el inicio de sesión falló
                    }
                } catch (error) {
                    console.error("Error during login:", error);
                    return false; // Indica que ocurrió un error durante el inicio de sesión
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

            createConsuming: async (consumingData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(consumingData),
                    });

                    if (response.ok) {
                        const newConsuming = await response.json();
                        setStore({ tiposConsumo: [...getStore().tiposConsumo, newConsuming] });
                    }
                } catch (error) {
                    console.error("Error creating consuming:", error);
                }
            },

            updateConsuming: async (consumingId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo/${consumingId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const updatedConsuming = await response.json();
                        const updatedTiposConsumo = getStore().tiposConsumo.map(consuming =>
                            consuming.id === consumingId ? updatedConsuming : consuming
                        );
                        setStore({ tiposConsumo: updatedTiposConsumo });
                    }
                } catch (error) {
                    console.error("Error updating consuming:", error);
                }
            },

            deleteConsuming: async (consumingId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo/${consumingId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        const updatedTiposConsumo = getStore().tiposConsumo.filter(consuming => consuming.id !== consumingId);
                        setStore({ tiposConsumo: updatedTiposConsumo });
                    }
                } catch (error) {
                    console.error("Error deleting consuming:", error);
                }
            },

                        //SEGUIMIENTO Y SOLICITUDES DE JOSE
            
            // Acciones para Coaches
            getCoaches: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`);
                    if (!response.ok) {
                        throw new Error(`Error fetching coaches: ${response.status}`);
                    }
                    const data = await response.json();
                    setStore({ coaches: data });
                } catch (error) {
                    console.error("Error fetching coaches:", error);
                }
            },

            // Crear un nuevo coach
            createCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error creating coach: ${errorText}`);
                    }

                    const newCoach = await response.json();
                    setStore((prevStore) => ({
                        coaches: [...prevStore.coaches, newCoach], // Agregar el nuevo coach al estado
                    }));
                } catch (error) {
                    console.error("Error creating coach:", error);
                }
            },

            // Actualizar un coach existente
            updateCoach: async (coachId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error updating coach: ${errorText}`);
                    }

                    const updatedCoach = await response.json();
                    setStore((prevStore) => ({
                        coaches: prevStore.coaches.map(coach =>
                            coach.id === coachId ? updatedCoach : coach
                        ),
                    }));
                } catch (error) {
                    console.error("Error updating coach:", error);
                }
            },

            // Eliminar un coach
            deleteCoach: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error deleting coach: ${errorText}`);
                    }

                    setStore((prevStore) => ({
                        coaches: prevStore.coaches.filter(coach => coach.id !== coachId),
                    }));
                } catch (error) {
                    console.error("Error deleting coach:", error);
                }
            },
                        //SIGNUP Y LOGIN DE BEA
            //SIGNUP COACH
            signupCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup-coach`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });
            
                    if (response.ok) {
                        const newCoach = await response.json();
                        setStore({ coaches: [...getStore().coaches, newCoach] });
                        localStorage.setItem("token", newCoach.token);  // Guarda el token si es parte de la respuesta
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el registro del coach:", error);
                    return false;
                }
            },
            
        },
    };
};

export default getState;

