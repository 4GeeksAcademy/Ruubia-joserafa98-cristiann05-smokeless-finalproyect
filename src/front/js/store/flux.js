const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: [],
            coaches: [],
            loggedInUser: null,
            seguimiento: [],
            perfilCreado: false,
            isAuthenticated: false,
            userId: null,
            userInfo: null,


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

            signupSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup-smoker`, {
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

            // Login de Smoker
            loginSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-smoker`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData), // Esto debe ser { email_usuario, password_email }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({
                            isAuthenticated: true,
                            loggedInUser: {
                                id: data.user_id,  // Guarda el ID del usuario
                                nombre: data.nombre,
                                genero: data.genero,
                                cumpleaños: data.cumpleaños
                            },
                        });
                        localStorage.setItem("token", data.token); // Guarda el token
                        return true; // Indica que el inicio de sesión fue exitoso
                    } else {
                        // Aquí puedes manejar el error, mostrando el mensaje que regresa el servidor
                        const errorData = await response.json();
                        console.error("Error en el inicio de sesión:", errorData);
                        return false; // Indica que el inicio de sesión falló
                    }
                } catch (error) {
                    console.error("Error durante el inicio de sesión:", error);
                    return false; // Indica que ocurrió un error durante el inicio de sesión
                }
            },


            // Actualizar el perfil
            updateProfile: async (userId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/update_profile/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token si es necesario
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Si el perfil se actualiza correctamente, puedes actualizar el store
                        setStore((prevStore) => ({
                            ...prevStore,
                            loggedInUser: {
                                ...prevStore.loggedInUser,
                                ...data.user // Asumiendo que el backend devuelve el usuario actualizado
                            }
                        }));
                        return true; // Indica que la actualización fue exitosa
                    } else {
                        return false; // Indica que la actualización falló
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    return false; // Indica que ocurrió un error durante la actualización
                }
            },

            // Asegúrate de que esta función se encuentre en tu store
            getUserInfo: async (userId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user_info/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token si es necesario
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return data; // Devuelve los datos del usuario
                    } else {
                        console.error("Error fetching user info:", response.statusText);
                        return null; // Retorna null si hay un error
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                    return null; // Retorna null si ocurre un error
                }
            },

            updateConsumptionProfile: async (userId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/update_consumo/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token si es necesario
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Si el perfil se actualiza correctamente, puedes actualizar el store
                        setStore((prevStore) => ({
                            ...prevStore,
                            loggedInUser: {
                                ...prevStore.loggedInUser,
                                ...data.user // Asumiendo que el backend devuelve el usuario actualizado
                            }
                        }));
                        return true; // Indica que la actualización fue exitosa
                    } else {
                        return false; // Indica que la actualización falló
                    }
                } catch (error) {
                    console.error("Error updating consumption profile:", error);
                    return false; // Indica que ocurrió un error durante la actualización
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem('token'); // Obtener el token
                if (!token) {
                    console.error("No token found"); // Log para depuración
                    setStore({ isAuthenticated: false });
                    return false; // Retorna false si no hay token
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Error en checkAuth:", response.statusText);
                        setStore({ isAuthenticated: false }); // Actualiza el store si la verificación falla
                        return false; // Retorna false si la verificación falla
                    }

                    const userData = await response.json(); // Obtener información del usuario
                    setStore({
                        isAuthenticated: true,
                        loggedInUser: userData, // Guardar la información del usuario
                    });

                    return true; // Retorna true si el token es válido
                } catch (error) {
                    console.error("Error en checkAuth:", error); // Log para depuración
                    setStore({ isAuthenticated: false });
                    return false; // Retorna false en caso de error
                }
            },

            logout: () => {
                localStorage.removeItem('token'); // Eliminar el token
                setStore({ loggedInUser: null, isAuthenticated: false }); // Actualizar el store
            },

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
                        localStorage.setItem("token", newCoach.token);
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

            //login coach
            loginCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    if (response.ok) {
                        const data = await response.json();

                        setStore({
                            isAuthenticated: true,
                            coachId: data.coach_id,

                        });
                        localStorage.setItem("token", data.token);
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error("Error during login:", error);
                    return false;
                }
            },
        },
    };
};

export default getState;

