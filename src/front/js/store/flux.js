import { useNavigate } from 'react-router-dom';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: [],
            coaches: [],
            loggedInUser: {
                id: null,
                email: '',
                nombre: '',
                genero: '',
                cumpleaños: '',
                foto_coach: '',
                foto_usuario: ''
            },
            loggedInCoach: {
                id: null,
                email: '',
                nombre: '',
                genero: '',
                cumpleaños: '',
            },
            seguimiento: [],
            perfilCreado: false,
            isAuthenticated: false,
            userId: null,
            userInfo: null,
            coachInfo: null,
            solicitud: [],
        },
        actions: {

            setStore: (newStore) => setStore((prevStore) => ({ ...prevStore, ...newStore })),

            getAllSmokers: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
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

                    console.log("Response:", response); // Muestra la respuesta completa

                    if (response.ok) {
                        const newSmoker = await response.json();
                        console.log("Nuevo usuario creado:", newSmoker); // Muestra los datos del nuevo usuario

                        // No almacenar el token aquí
                        setStore({ smokers: [...getStore().smokers, newSmoker] }); // Actualiza el estado

                        return true; // Retorna verdadero si la operación es exitosa
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData); // Muestra el error del servidor
                        return false; // Retorna falso si hay un error
                    }
                } catch (error) {
                    console.error("Error durante el registro del fumador:", error); // Muestra el error de la solicitud
                    return false; // Retorna falso si hay un error
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
                        body: JSON.stringify(smokerData),
                    });
            
                    const data = await response.json();
                    console.log("Datos recibidos en loginSmoker:", data);
            
                    if (response.ok) {
                        localStorage.setItem('token', data.token);
            
                        setStore({
                            loggedInUser: {
                                id: data.user_id || null, // Asegúrate de que este valor sea correcto
                                email: data.email_usuario || '',
                                nombre: data.nombre_usuario || '',
                                genero: data.genero_usuario || '',
                                cumpleaños: data.nacimiento_usuario || '',
                            },
                            isAuthenticated: true,
                        });
            
                        return true; 
                    } else {
                        console.error("Error en el login:", data.msg);
                        setStore({ isAuthenticated: false, loggedInUser: null });
                        return false;
                    }
                } catch (error) {
                    console.error("Error en la solicitud de loginSmoker:", error);
                    setStore({ isAuthenticated: false, loggedInUser: null });
                    return false;
                }
            },
            



            // Actualizar el perfil
            updateProfile: async (userId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/create_profile/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore((prevStore) => ({
                            ...prevStore,
                            loggedInUser: {
                                ...prevStore.loggedInUser,
                                ...data.user
                            }
                        }));
                        localStorage.setItem("token", data.token); // Guardar el token en localStorage

                        setStore({
                            isAuthenticated: true,
                            userId: data.id,
                            nombreUsuario: data.nombre_usuario,
                            numerocigarro_usuario: data.numerocigarro_usuario,
                            periodicidad: data.periodicidad,
                            tipo_consumo: data.tipo_consumo,
                            fotoUsuario: data.foto_usuario,
                        });

                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error actualizando perfil:", errorData.msg);
                        return false;
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    return false;
                }
            },

            getUserInfo: async (userId) => { // Accept userId as a parameter
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user_info/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Información del usuario:", data);
                        setStore({ userInfo: data }); // Actualiza el store con la información del usuario
                        return data;
                    } else {
                        console.error("Error fetching user info:", response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                    return null;
                }
            },


            updateConsumptionProfile: async (userId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/create_config_profile/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(updatedData),
                    });
        
                    if (response.ok) {
                        const data = await response.json();
                        setStore((prevStore) => ({
                            ...prevStore,
                            loggedInUser: {
                                ...prevStore.loggedInUser,
                                ...data.user
                            }
                        }));
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error actualizando consumo:", errorData.msg);
                        return false;
                    }
                } catch (error) {
                    console.error("Error updating consumption profile:", error);
                    return false;
                }
            },

            checkAuth: () => {
                const token = localStorage.getItem('token');

                if (token) {
                    setStore({
                        user: { token },
                    });
                }
            },

            // Logout
            logoutsmoker: () => {
                localStorage.removeItem('token');
                setStore({
                    loggedInUser: null,
                    isAuthenticated: false,
                    userId: null,
                    userInfo: null,
                });
            },

            getAllCoaches: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`); // Ajusta la ruta según sea necesario
                    const data = await response.json();
                    setStore({ coaches: data }); // Actualiza el estado del store con los coaches obtenidos
                } catch (error) {
                    console.error("Error fetching coaches:", error); // Manejo de errores
                }
            },

            getCoach: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`); // Asegúrate de que esta URL sea correcta
                    const data = await response.json();
                    setStore({ coach: data }); // Guarda la información del coach en el store
                } catch (error) {
                    console.error("Error fetching coach:", error);
                }
            },

            updateProfile: async (coachId, coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/create_profile/coach/${coachId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluye el token si es necesario
                        },
                        body: JSON.stringify(coachData),
                    });
            
                    const data = await response.json();
                    console.log('Datos recibidos en updateProfile:', data);
            
                    if (response.ok) {
                        // Actualizar el store con la información del perfil actualizado
                        setStore({
                            loggedInCoach: {
                                id: coachId,
                                nombre: data.coach.nombre_coach || '',
                                genero: data.coach.genero_coach || '',
                                cumpleaños: data.coach.nacimiento_coach || ''
                            }
                        });
                        return true;
                    } else {
                        console.error("Error actualizando perfil:", data.msg);
                        return false;
                    }
                } catch (error) {
                    console.error("Error en la solicitud de updateProfile:", error);
                    return false;
                }
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

            // Login de Coach
            loginCoach: async (coachData) => {
                try {
                    // Enviar la solicitud de login al backend
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-coach`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(coachData),
                    });
            
                    // Obtener los datos devueltos por el backend
                    const data = await response.json();
                    console.log('Datos recibidos en loginCoach:', data);
            
                    // Verificar si la respuesta es exitosa
                    if (response.ok) {
                        // Guardar el token en el localStorage
                        localStorage.setItem('token', data.token);
            
                        // Almacenar la información del coach en el estado global/store
                        setStore({
                            loggedInCoach: {
                                id: data.coach_id || null, // Verificar si el ID está presente
                                email: data.email_coach || '', // Usar email_coach en lugar de email
                                nombre: data.nombre || '',  // Guardar otros datos si están disponibles
                                genero: data.genero || '',
                                cumpleaños: data.cumpleaños || ''
                            },
                            isAuthenticated: true,  // Marcar que el usuario está autenticado
                        });
            
                        return true;  // Devolver true si el login fue exitoso
                    } else {
                        // Manejar casos de error en el login
                        console.error("Error en el login del coach:", data.msg);
                        setStore({ isAuthenticated: false, loggedInCoach: null }); // Resetear el estado
                        return false;  // Devolver false si hubo un error
                    }
                } catch (error) {
                    // Manejo de errores en la solicitud al backend
                    console.error("Error en la solicitud de loginCoach:", error);
                    setStore({ isAuthenticated: false, loggedInCoach: null }); // Resetear el estado en caso de fallo
                    return false;  // Devolver false si ocurrió un error
                }
            },
            


            getCoachInfo: async (coachId) => { // Accept coachId as a parameter
                if (!coachId) {
                    console.error("Coach ID is required");
                    return null; // Return null if coachId is not provided
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coach_info/${coachId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure token is present
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Información del coach:", data);
                        setStore({ coachInfo: data }); // Update the store with the coach info
                        return data; // Return the fetched data for further use
                    } else {
                        console.error("Error fetching coach info:", response.statusText);
                        return null; // Return null in case of an error
                    }
                } catch (error) {
                    console.error("Error fetching coach info:", error);
                    return null; // Handle any network or unexpected errors
                }
            },


            // Método para subir la imagen del coach a Cloudinary
            uploadCoachImage: async (file) => {
                if (!file || !file.type.startsWith('image/')) {
                    console.error("El archivo no es una imagen válida.");
                    return null; // Retorna null si el archivo no es válido
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "ml_default"); // Tu preset de subida

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/dsnmmg3kl/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error al subir la imagen: ${errorData.message}`);
                    }

                    const data = await response.json();
                    // Actualiza el store con la nueva URL
                    setStore((prevStore) => ({
                        ...prevStore,
                        loggedInUser: {
                            ...prevStore.loggedInUser,
                            foto_coach: data.secure_url, // Asegúrate de que esto sea el campo correcto en el store
                        }
                    }));

                    return data.secure_url; // Retorna la URL de la imagen subida
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null; // Retorna null si hay un error
                }
            },

            // Método para subir la imagen del smoker a Cloudinary
            uploadSmokerImage: async (file) => {
                if (!file || !file.type.startsWith('image/')) {
                    console.error("El archivo no es una imagen válida.");
                    return null; // Retorna null si el archivo no es válido
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "ml_default"); // Tu preset de subida

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/dsnmmg3kl/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error al subir la imagen: ${errorData.message}`);
                    }

                    const data = await response.json();
                    // Actualiza el store con la nueva URL
                    setStore((prevStore) => ({
                        ...prevStore,
                        loggedInUser: {
                            ...prevStore.loggedInUser,
                            foto_usuario: data.secure_url, // Asegúrate de que esto sea el campo correcto en el store
                        }
                    }));

                    return data.secure_url; // Retorna la URL de la imagen subida
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null; // Retorna null si hay un error
                }
            },

            getCoachesLocations: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/ubicaciones`); // Ajusta la ruta según sea necesario
                    const data = await response.json();
                    setStore({ coachesLocations: data }); // Actualiza el estado del store con las ubicaciones obtenidas
                } catch (error) {
                    console.error("Error fetching coaches locations:", error);
                }
            },
            addCoachLocation: async (coachId, locationData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/ubicaciones`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ coach_id: coachId, ...locationData }),
                    });

                    if (response.ok) {
                        const newLocation = await response.json();
                        setStore({ coachesLocations: [...getStore().coachesLocations, newLocation] }); // Actualiza el estado
                        return true; // Retorna verdadero si la operación es exitosa
                    } else {
                        const errorData = await response.json();
                        console.error("Error al agregar ubicación:", errorData); // Muestra el error del servidor
                        return false; // Retorna falso si hay un error
                    }
                } catch (error) {
                    console.error("Error durante la adición de ubicación:", error); // Muestra el error de la solicitud
                    return false; // Retorna falso si hay un error
                }
            },
            deleteCoachLocation: async (locationId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/ubicaciones/${locationId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.ok) {
                        setStore({ coachesLocations: getStore().coachesLocations.filter(location => location.id !== locationId) }); // Actualiza el estado
                        return true; // Retorna verdadero si la operación es exitosa
                    } else {
                        const errorData = await response.json();
                        console.error("Error al eliminar ubicación:", errorData); // Muestra el error del servidor
                        return false; // Retorna falso si hay un error
                    }
                } catch (error) {
                    console.error("Error durante la eliminación de ubicación:", error); // Muestra el error de la solicitud
                    return false; // Retorna falso si hay un error
                }
            },


            // solicitudes


            getAllSolicitudes: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
                    setStore({ solicitudes: data }); // Guarda todas las solicitudes en el store
                } catch (error) {
                    console.error("Error fetching solicitudes:", error);
                }
            },

            // Obtener solicitudes por usuario específico
            getSolicitudesPorUser: async (userId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes/${userId}`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
                    setStore({ solicitudes: data }); // Guarda las solicitudes del usuario en el store
                } catch (error) {
                    console.error("Error fetching solicitudes por usuario:", error);
                }
            },

            // Agregar una nueva solicitud
            addSolicitud: async (newSolicitud) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newSolicitud), // Enviar el objeto de solicitud
                    });
                    if (!response.ok) {
                        throw new Error("Error al agregar la solicitud");
                    }

                    const data = await response.json();
                    setStore((prevStore) => ({
                        ...prevStore,
                        solicitudes: [...prevStore.solicitudes, data], // Añade la nueva solicitud al store
                    }));
                } catch (error) {
                    console.error("Error adding solicitud:", error);
                }
            },

            // Actualizar una solicitud específica
            updateSolicitud: async (solicitudId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes/${solicitudId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData), // Enviar el objeto de actualización
                    });
                    if (!response.ok) {
                        throw new Error("Error al actualizar la solicitud");
                    }

                    const data = await response.json();
                    setStore((prevStore) => ({
                        ...prevStore,
                        solicitudes: prevStore.solicitudes.map((solicitud) =>
                            solicitud.id === solicitudId ? data : solicitud // Actualiza la solicitud en el store
                        ),
                    }));
                } catch (error) {
                    console.error("Error updating solicitud:", error);
                }
            },

            // Eliminar una solicitud específica
            deleteSolicitud: async (solicitudId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes/${solicitudId}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error("Error al eliminar la solicitud");
                    }

                    // Actualiza el estado en el store después de eliminar la solicitud
                    setStore((prevStore) => ({
                        ...prevStore,
                        solicitudes: prevStore.solicitudes.filter((solicitud) => solicitud.id !== solicitudId),
                    }));
                } catch (error) {
                    console.error("Error deleting solicitud:", error);
                }
            },
            getTiposConsumo: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
                    setStore({ tiposConsumo: data });
                } catch (error) {
                    console.error("Error fetching tipos de consumo:", error);
                }
            },
        },
    };
};

export default getState;
