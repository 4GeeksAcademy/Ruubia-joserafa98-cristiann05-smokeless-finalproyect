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
            seguimiento: [],
            perfilCreado: false,
            isAuthenticated: false,
            userId: null,
            userInfo: null,
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
                    // Llamada a la API para el login del fumador
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-smoker`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData), // Enviar los datos del smoker
                    });

                    // Obtener los datos de la respuesta
                    const data = await response.json();

                    // Log para verificar la respuesta
                    console.log("Datos recibidos en loginSmoker:", data);

                    // Verificar si la respuesta es exitosa
                    if (response.ok) {
                        // Almacenar el token en localStorage
                        localStorage.setItem('token', data.token);

                        // Actualizar el store con los datos del usuario y marcar como autenticado
                        setStore({
                            loggedInUser: {
                                id: data.user_id || null,  // Asignar el ID del usuario si existe
                                email: data.email_usuario || '',  // Asignar el email del usuario
                                nombre: data.nombre_usuario || '',  // Asignar el nombre del usuario
                                genero: data.genero_usuario || '',  // Asignar el género del usuario
                                cumpleaños: data.nacimiento_usuario || '',  // Asignar la fecha de nacimiento del usuario
                            },
                            isAuthenticated: true,  // Marcar como autenticado
                        });

                        return true;  // Retorna true si la autenticación es exitosa
                    } else {
                        // Si la respuesta no es exitosa, log de error y retorna false
                        console.error("Error en el login:", data.msg);
                        setStore({ isAuthenticated: false, loggedInUser: null });  // Limpia el estado si falla
                        return false;
                    }
                } catch (error) {
                    // Manejo de errores en la solicitud
                    console.error("Error en la solicitud de loginSmoker:", error);
                    setStore({ isAuthenticated: false, loggedInUser: null });  // Limpia el estado en caso de error
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
            logout: () => {
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
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-coach`, {
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
                            nombre_coach: data.nombre_coach, // Nuevo campo
                            genero_coach: data.genero_coach, // Nuevo campo
                            foto_coach: data.foto_coach, // Nuevo campo
                        });
                        localStorage.setItem("token", data.token); // Guarda el token en localStorage
                        return true; // Indica que el login fue exitoso
                    } else {
                        const errorData = await response.json();
                        console.error("Error en el login del coach:", errorData);
                        return false; // Indica que el login falló
                    }
                } catch (error) {
                    console.error("Error durante el login del coach:", error);
                    return false; // Indica que hubo un error durante el proceso
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
